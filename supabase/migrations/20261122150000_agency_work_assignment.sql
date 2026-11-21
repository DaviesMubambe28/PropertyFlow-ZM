create function public.agency_assignee_has_property_access(workspace uuid, assignee uuid, property uuid)
returns boolean
language sql stable set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_memberships m
    where m.organization_id = workspace and m.user_id = assignee and m.status = 'active'
      and (property is null or exists (
        select 1 from public.properties p
        where p.organization_id = workspace and p.id = property
          and (p.branch_id is null or m.role = 'admin' or exists (
            select 1 from public.agency_branch_members b
            where b.organization_id = workspace and b.branch_id = p.branch_id and b.user_id = assignee
          ))
      ))
  );
$$;

create function public.reassign_agency_record(workspace uuid, record_kind text, record_id uuid, assignee uuid)
returns boolean
language plpgsql set search_path = ''
as $$
declare
  affected integer;
begin
  if not public.is_active_organization_admin(workspace) then return false; end if;
  case record_kind
    when 'property' then
      update public.properties p set assigned_to = assignee
      where p.id = record_id and p.organization_id = workspace
        and public.agency_assignee_has_property_access(workspace, assignee, p.id);
    when 'lead' then
      update public.leads l set assigned_to = assignee
      where l.id = record_id and l.organization_id = workspace
        and public.agency_assignee_has_property_access(workspace, assignee, l.property_id);
    when 'task' then
      update public.tasks t set assignee_id = assignee
      where t.id = record_id and t.organization_id = workspace
        and public.agency_assignee_has_property_access(workspace, assignee, t.property_id);
    when 'viewing' then
      update public.viewings v set agent_id = assignee
      where v.id = record_id and v.organization_id = workspace
        and public.agency_assignee_has_property_access(workspace, assignee, v.property_id)
        and exists (
          select 1 from public.leads l where l.id = v.lead_id and l.organization_id = workspace
            and public.agency_assignee_has_property_access(workspace, assignee, l.property_id)
        );
    when 'deal' then
      update public.deals d set assigned_to = assignee
      where d.id = record_id and d.organization_id = workspace
        and public.agency_assignee_has_property_access(workspace, assignee, d.property_id)
        and exists (
          select 1 from public.leads l where l.id = d.lead_id and l.organization_id = workspace
            and public.agency_assignee_has_property_access(workspace, assignee, l.property_id)
        );
    else return false;
  end case;
  get diagnostics affected = row_count;
  return affected = 1;
end;
$$;

revoke all on function public.agency_assignee_has_property_access(uuid,uuid,uuid), public.reassign_agency_record(uuid,text,uuid,uuid) from public, anon, authenticated;
grant execute on function public.agency_assignee_has_property_access(uuid,uuid,uuid), public.reassign_agency_record(uuid,text,uuid,uuid) to authenticated;
