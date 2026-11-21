create function public.enforce_lead_assignment()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    if new.assigned_to is not distinct from old.assigned_to
       and new.organization_id is not distinct from old.organization_id then
      return new;
    end if;
    if new.organization_id is distinct from old.organization_id then
      raise exception 'Lead workspace cannot be changed' using errcode = '42501';
    end if;
  end if;

  if auth.uid() is not null
     and (tg_op = 'UPDATE' or new.assigned_to is distinct from auth.uid())
     and not public.is_active_organization_admin(new.organization_id) then
    raise exception 'Only an active agency administrator can reassign leads' using errcode = '42501';
  end if;

  perform 1 from public.organization_memberships
    where organization_id = new.organization_id and user_id = new.assigned_to and status = 'active'
    for share;
  if not found then
    raise exception 'The assignee must be an active workspace member' using errcode = '23514';
  end if;
  return new;
end;
$$;

revoke all on function public.enforce_lead_assignment() from public, anon, authenticated;
create trigger leads_enforce_assignment
before insert or update of assigned_to, organization_id on public.leads
for each row execute function public.enforce_lead_assignment();
