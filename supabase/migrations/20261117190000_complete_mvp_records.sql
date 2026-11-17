alter table public.properties
  add column province text not null default 'Lusaka' check (length(province) <= 80),
  add column owner_name text not null default '' check (length(owner_name) <= 160),
  add column owner_phone text not null default '' check (length(owner_phone) <= 40),
  add column assigned_to uuid;
alter table public.properties add foreign key (organization_id, assigned_to)
  references public.organization_memberships(organization_id, user_id);
alter table public.properties drop constraint properties_status_check;
update public.properties set status = case status when 'active' then 'available' when 'archived' then 'unavailable' else status end;
alter table public.properties add constraint properties_status_check
  check (status in ('available', 'reserved', 'under_offer', 'sold', 'rented', 'unavailable', 'draft'));
alter table public.properties alter column status set default 'available';

alter table public.contacts
  add column whatsapp text not null default '' check (length(whatsapp) <= 40),
  add column preferred_location text not null default '' check (length(preferred_location) <= 160),
  add column preferences text not null default '' check (length(preferences) <= 2000);

alter table public.leads drop constraint leads_stage_check;
update public.leads set stage = case stage when 'qualified' then 'interested' when 'won' then 'converted' else stage end;
alter table public.leads add constraint leads_stage_check
  check (stage in ('new', 'contacted', 'interested', 'viewing_scheduled', 'negotiation', 'converted', 'lost'));

create table public.lead_interactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid not null,
  interaction_type text not null check (interaction_type in ('note', 'call', 'whatsapp', 'email', 'meeting', 'status_change')),
  summary text not null check (length(btrim(summary)) between 2 and 5000),
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  foreign key (organization_id, lead_id) references public.leads(organization_id, id) on delete cascade
);
create index lead_interactions_lead_idx on public.lead_interactions(organization_id, lead_id, created_at desc);
alter table public.lead_interactions enable row level security;
grant select, insert, update, delete on public.lead_interactions to authenticated;
create policy lead_interactions_member_access on public.lead_interactions for all to authenticated
  using (public.is_active_organization_member(organization_id))
  with check (public.is_active_organization_member(organization_id));

alter table public.viewings
  add column feedback text not null default '' check (length(feedback) <= 5000),
  add column outcome text not null default '' check (outcome in ('', 'offer', 'another_viewing', 'discontinued'));
alter table public.viewings drop constraint viewings_status_check;
alter table public.viewings add constraint viewings_status_check
  check (status in ('scheduled', 'completed', 'cancelled', 'missed'));

alter table public.tasks
  add column contact_id uuid,
  add column property_id uuid;
alter table public.tasks add foreign key (organization_id, contact_id)
  references public.contacts(organization_id, id) on delete set null (contact_id);
alter table public.tasks add foreign key (organization_id, property_id)
  references public.properties(organization_id, id) on delete set null (property_id);

alter table public.deals
  add column transaction_type text not null default 'sale' check (transaction_type in ('sale', 'rental')),
  add column closing_date date,
  add column lease_start date,
  add column monthly_rent numeric(14,2) check (monthly_rent is null or monthly_rent >= 0);
alter table public.deals drop constraint deals_status_check;
update public.deals set status = 'completed' where status = 'closed';
alter table public.deals add constraint deals_status_check
  check (status in ('open', 'completed', 'cancelled'));

create function public.sync_completed_deal_property_status()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.status = 'completed' and old.status is distinct from new.status then
    update public.properties
    set status = case new.transaction_type when 'rental' then 'rented' else 'sold' end,
        updated_at = now()
    where id = new.property_id and organization_id = new.organization_id;
  end if;
  return new;
end;
$$;
revoke all on function public.sync_completed_deal_property_status() from public, anon, authenticated;
create trigger deals_sync_completed_property_status
after update of status on public.deals
for each row execute function public.sync_completed_deal_property_status();
