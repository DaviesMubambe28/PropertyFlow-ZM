create or replace function public.protect_last_active_admin() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and row(new.organization_id, new.user_id) is distinct from row(old.organization_id, old.user_id) then
    raise exception 'Membership identifiers cannot be changed' using errcode = '42501';
  end if;
  if old.role = 'admin' and old.status = 'active'
     and (tg_op = 'DELETE' or new.role <> 'admin' or new.status <> 'active') then
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(old.organization_id::text || ':admin-role', 0));
    if not exists (
      select 1 from public.organization_memberships
      where organization_id = old.organization_id and role = 'admin' and status = 'active' and user_id <> old.user_id
    ) then
      raise exception 'An organization must retain an active administrator' using errcode = 'P0001';
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create table public.agency_access_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid,
  subject_id uuid not null,
  action text not null,
  detail text not null,
  created_at timestamptz not null default now()
);
create index agency_access_events_workspace_idx on public.agency_access_events (organization_id, created_at desc);
alter table public.agency_access_events enable row level security;
revoke all on public.agency_access_events from public, anon, authenticated;
grant select on public.agency_access_events to authenticated;
create policy agency_access_events_admin_read on public.agency_access_events
for select to authenticated using (public.is_active_organization_admin(organization_id));

create function public.log_agency_access_event() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if tg_table_name = 'organization_memberships' then
    if row(old.role, old.status) is distinct from row(new.role, new.status) then
      insert into public.agency_access_events (organization_id, actor_id, subject_id, action, detail)
      values (new.organization_id, auth.uid(), new.user_id, 'Agency membership updated',
        old.role || ' / ' || old.status || ' → ' || new.role || ' / ' || new.status);
    end if;
  elsif tg_table_name = 'agency_branch_members' then
    if tg_op = 'DELETE' then
      if not exists (select 1 from public.organizations where id = old.organization_id) then return null; end if;
      insert into public.agency_access_events (organization_id, actor_id, subject_id, action, detail)
      values (old.organization_id, auth.uid(), old.user_id, 'Branch access removed', old.branch_id::text);
    elsif tg_op = 'INSERT' or row(new.role, new.branch_id, new.user_id) is distinct from row(old.role, old.branch_id, old.user_id) then
      insert into public.agency_access_events (organization_id, actor_id, subject_id, action, detail)
      values (new.organization_id, auth.uid(), new.user_id, 'Branch access granted or changed', new.role || ' · ' || new.branch_id::text);
    end if;
  elsif tg_table_name = 'properties' and new.branch_id is distinct from old.branch_id then
    insert into public.agency_access_events (organization_id, actor_id, subject_id, action, detail)
    values (new.organization_id, auth.uid(), new.id, 'Property branch changed',
      coalesce(new.branch_id::text, 'Agency-wide'));
  end if;
  return null;
end;
$$;

revoke all on function public.log_agency_access_event() from public, anon, authenticated;
create trigger organization_memberships_audit_access after update of role,status on public.organization_memberships
for each row execute function public.log_agency_access_event();
create trigger agency_branch_members_audit_access after insert or update or delete on public.agency_branch_members
for each row execute function public.log_agency_access_event();
create trigger properties_audit_branch after update of branch_id on public.properties
for each row execute function public.log_agency_access_event();
