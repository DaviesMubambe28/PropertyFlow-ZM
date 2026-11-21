create function public.record_lead_assignment()
returns trigger language plpgsql set search_path = ''
as $$
declare
  assignee_name text;
begin
  if new.assigned_to is not distinct from old.assigned_to or auth.uid() is null then return null; end if;
  select full_name into assignee_name from public.profiles where id = new.assigned_to;
  insert into public.lead_interactions (organization_id, lead_id, interaction_type, summary, created_by)
  values (new.organization_id, new.id, 'note', 'Lead assigned to ' || coalesce(assignee_name, 'a team member'), auth.uid());
  return null;
end;
$$;

revoke all on function public.record_lead_assignment() from public, anon, authenticated;
create trigger leads_record_assignment after update of assigned_to on public.leads
for each row execute function public.record_lead_assignment();

create function public.prevent_duplicate_deal_completion()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.status <> 'completed' then return new; end if;
  if tg_op = 'UPDATE' and row(old.status, old.property_id, old.lead_id, old.transaction_type)
    is not distinct from row(new.status, new.property_id, new.lead_id, new.transaction_type) then
    return new;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(
    new.organization_id::text || new.property_id::text || new.lead_id::text || new.transaction_type, 0));
  if exists (
    select 1 from public.deals d where d.organization_id = new.organization_id
      and d.property_id = new.property_id and d.lead_id = new.lead_id
      and d.transaction_type = new.transaction_type and d.status = 'completed' and d.id <> new.id
  ) then
    raise exception 'A completed deal already exists for this property and lead' using errcode = '23505';
  end if;
  return new;
end;
$$;
revoke all on function public.prevent_duplicate_deal_completion() from public, anon, authenticated;
create trigger deals_prevent_duplicate_completion before insert or update of status,property_id,lead_id,transaction_type on public.deals
for each row execute function public.prevent_duplicate_deal_completion();
