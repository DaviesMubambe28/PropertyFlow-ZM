create table public.agency_branches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 120),
  city text not null default '' check (char_length(city) <= 120),
  created_at timestamptz not null default now(),
  unique (organization_id, id)
);
create unique index agency_branches_name_idx on public.agency_branches (organization_id, lower(btrim(name)));

create table public.agency_branch_members (
  organization_id uuid not null,
  branch_id uuid not null,
  user_id uuid not null,
  role text not null check (role in ('manager', 'member')),
  primary key (branch_id, user_id),
  foreign key (organization_id, branch_id) references public.agency_branches (organization_id, id) on delete cascade,
  foreign key (organization_id, user_id) references public.organization_memberships (organization_id, user_id) on delete cascade
);
create unique index agency_branch_one_manager_idx on public.agency_branch_members (branch_id) where role = 'manager';
create index agency_branch_members_user_idx on public.agency_branch_members (user_id, branch_id);

alter table public.agency_branches enable row level security;
alter table public.agency_branch_members enable row level security;
revoke all on public.agency_branches, public.agency_branch_members from public, anon, authenticated;
grant select, insert on public.agency_branches to authenticated;
grant select, insert, update, delete on public.agency_branch_members to authenticated;

create function public.can_access_agency_branch(workspace uuid, branch uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce(public.is_active_organization_member(workspace) and (
    branch is null or public.is_active_organization_admin(workspace) or exists (
      select 1 from public.agency_branch_members m
      where m.organization_id = workspace and m.branch_id = branch and m.user_id = auth.uid()
    )
  ), false);
$$;
revoke all on function public.can_access_agency_branch(uuid,uuid) from public, anon, authenticated;
grant execute on function public.can_access_agency_branch(uuid,uuid) to authenticated;

create policy agency_branches_read on public.agency_branches for select to authenticated
using (public.can_access_agency_branch(organization_id, id));
create policy agency_branches_insert on public.agency_branches for insert to authenticated
with check (public.is_active_organization_admin(organization_id));
create policy agency_branch_members_admin on public.agency_branch_members for all to authenticated
using (public.is_active_organization_admin(organization_id))
with check (public.is_active_organization_admin(organization_id));
create policy agency_branch_members_self on public.agency_branch_members for select to authenticated
using (user_id = auth.uid() and public.is_active_organization_member(organization_id));

alter table public.properties add column branch_id uuid;
alter table public.properties add foreign key (organization_id, branch_id)
  references public.agency_branches (organization_id, id);
create index properties_branch_idx on public.properties (organization_id, branch_id) where branch_id is not null;

create function public.check_property_branch_assignment()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and new.branch_id is not distinct from old.branch_id then
    return new;
  end if;
  if (tg_op = 'UPDATE' or new.branch_id is not null)
     and not public.is_active_organization_admin(new.organization_id) then
    raise exception 'Only agency administrators can assign property branches' using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke all on function public.check_property_branch_assignment() from public, anon, authenticated;
create trigger properties_check_branch before insert or update of branch_id on public.properties
  for each row execute function public.check_property_branch_assignment();

create policy properties_branch_access on public.properties as restrictive for all to authenticated
using (public.can_access_agency_branch(organization_id, branch_id))
with check (public.can_access_agency_branch(organization_id, branch_id));

create function public.can_access_linked_property(workspace uuid, property uuid)
returns boolean
language sql stable set search_path = ''
as $$
  select property is null or exists (
    select 1 from public.properties p where p.id = property and p.organization_id = workspace
  );
$$;

create function public.can_access_linked_lead(workspace uuid, lead uuid)
returns boolean
language sql stable set search_path = ''
as $$
  select exists (
    select 1 from public.leads l where l.id = lead and l.organization_id = workspace
  );
$$;

revoke all on function public.can_access_linked_property(uuid,uuid), public.can_access_linked_lead(uuid,uuid) from public, anon, authenticated;
grant execute on function public.can_access_linked_property(uuid,uuid), public.can_access_linked_lead(uuid,uuid) to authenticated;

create policy leads_branch_access on public.leads as restrictive for all to authenticated
using (public.can_access_linked_property(organization_id, property_id))
with check (public.can_access_linked_property(organization_id, property_id));
create policy tasks_branch_access on public.tasks as restrictive for all to authenticated
using (public.can_access_linked_property(organization_id, property_id))
with check (public.can_access_linked_property(organization_id, property_id));
create policy viewings_branch_access on public.viewings as restrictive for all to authenticated
using (public.can_access_linked_property(organization_id, property_id) and public.can_access_linked_lead(organization_id, lead_id))
with check (public.can_access_linked_property(organization_id, property_id) and public.can_access_linked_lead(organization_id, lead_id));
create policy deals_branch_access on public.deals as restrictive for all to authenticated
using (public.can_access_linked_property(organization_id, property_id) and public.can_access_linked_lead(organization_id, lead_id))
with check (public.can_access_linked_property(organization_id, property_id) and public.can_access_linked_lead(organization_id, lead_id));
create policy interactions_branch_access on public.lead_interactions as restrictive for all to authenticated
using (public.can_access_linked_lead(organization_id, lead_id))
with check (public.can_access_linked_lead(organization_id, lead_id));
