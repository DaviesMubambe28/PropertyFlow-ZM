create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (length(btrim(full_name)) between 2 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 2 and 160),
  logo_url text,
  phone text,
  email text not null check (email = lower(btrim(email))),
  location text,
  timezone text not null default 'Africa/Lusaka',
  currency text not null default 'ZMW' check (currency ~ '^[A-Z]{3}$'),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('admin', 'agent')),
  status text not null default 'active' check (status in ('active', 'deactivated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null check (email = lower(btrim(email))),
  role text not null default 'agent' check (role = 'agent'),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  invited_by uuid not null references public.profiles(id),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index organization_memberships_user_id_idx on public.organization_memberships(user_id);
create index organization_invitations_organization_id_idx on public.organization_invitations(organization_id);
create unique index organization_invitations_one_pending_email_idx
  on public.organization_invitations(organization_id, email) where status = 'pending';

create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger organizations_set_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger organization_memberships_set_updated_at before update on public.organization_memberships for each row execute function public.set_updated_at();
create trigger organization_invitations_set_updated_at before update on public.organization_invitations for each row execute function public.set_updated_at();

create function public.bootstrap_organization(p_name text, p_email text, p_full_name text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_existing_organization_id uuid;
  v_organization_id uuid;
begin
  if v_user_id is null then raise exception 'Authentication is required' using errcode = 'P0001'; end if;
  if length(btrim(p_name)) not between 2 and 160
    or length(btrim(p_full_name)) not between 2 and 120
    or length(btrim(p_email)) < 3 then
    raise exception 'Invalid organization registration details' using errcode = 'P0001';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text, 0));
  select organization_id into v_existing_organization_id
  from public.organization_memberships
  where user_id = v_user_id and role = 'admin' and status = 'active'
  order by created_at limit 1;
  if v_existing_organization_id is not null then return v_existing_organization_id; end if;

  insert into public.profiles (id, full_name) values (v_user_id, btrim(p_full_name))
  on conflict (id) do update set full_name = excluded.full_name, updated_at = now();
  insert into public.organizations (name, email, created_by)
  values (btrim(p_name), lower(btrim(p_email)), v_user_id) returning id into v_organization_id;
  insert into public.organization_memberships (organization_id, user_id, role, status)
  values (v_organization_id, v_user_id, 'admin', 'active');
  return v_organization_id;
end;
$$;

create function public.accept_organization_invitation(p_invitation_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_user_email text := lower(auth.jwt() ->> 'email');
  v_invitation public.organization_invitations%rowtype;
  v_full_name text;
begin
  if v_user_id is null or v_user_email is null then raise exception 'Authentication is required' using errcode = 'P0001'; end if;
  select * into v_invitation from public.organization_invitations where id = p_invitation_id for update;
  if not found or v_invitation.status <> 'pending' then raise exception 'Invitation is not available' using errcode = 'P0001'; end if;
  if v_invitation.email <> v_user_email then raise exception 'Invitation does not match the signed-in user' using errcode = 'P0001'; end if;
  if v_invitation.expires_at <= now() then raise exception 'Invitation has expired' using errcode = 'P0001'; end if;

  v_full_name := coalesce(nullif(btrim(auth.jwt() -> 'user_metadata' ->> 'full_name'), ''), split_part(v_user_email, '@', 1));
  insert into public.profiles (id, full_name) values (v_user_id, v_full_name) on conflict (id) do nothing;
  insert into public.organization_memberships (organization_id, user_id, role, status)
  values (v_invitation.organization_id, v_user_id, 'agent', 'active')
  on conflict (organization_id, user_id) do update set role = 'agent', status = 'active', updated_at = now();
  update public.organization_invitations set status = 'accepted', accepted_at = now(), updated_at = now() where id = p_invitation_id;
  return v_invitation.organization_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.organization_invitations enable row level security;

revoke all on table public.profiles, public.organizations, public.organization_memberships, public.organization_invitations from anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.bootstrap_organization(text, text, text) from public, anon;
revoke all on function public.accept_organization_invitation(uuid) from public, anon;
grant execute on function public.bootstrap_organization(text, text, text) to authenticated;
grant execute on function public.accept_organization_invitation(uuid) to authenticated;
