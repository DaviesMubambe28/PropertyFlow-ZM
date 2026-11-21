create function public.import_agency_records(workspace uuid, record_kind text, records jsonb)
returns integer
language plpgsql
set search_path = ''
as $$
declare
  item jsonb;
  inserted integer := 0;
  affected integer;
begin
  if not public.is_active_organization_admin(workspace) then
    raise exception 'Agency administrator access required' using errcode = '42501';
  end if;
  if record_kind not in ('properties', 'contacts') or record_kind is null
     or jsonb_typeof(records) is distinct from 'array' then
    raise exception 'Invalid import' using errcode = '22023';
  end if;
  if jsonb_array_length(records) not between 1 and 100 then
    raise exception 'Invalid import size' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(workspace::text || record_kind, 0));
  for item in select value from jsonb_array_elements(records)
  loop
    if record_kind = 'properties' then
      insert into public.properties
        (organization_id, title, type, listing_type, price, location, province, description, status, assigned_to, created_by)
      select workspace, trim(item->>'title'), trim(item->>'type'), item->>'listingType', (item->>'price')::numeric,
        trim(item->>'location'), coalesce(item->>'province', ''), coalesce(item->>'description', ''), 'draft', auth.uid(), auth.uid()
      where not exists (
        select 1 from public.properties p
        where p.organization_id = workspace
          and lower(trim(p.title)) = lower(trim(item->>'title'))
          and lower(trim(p.location)) = lower(trim(item->>'location'))
          and p.listing_type = item->>'listingType'
      );
    else
      insert into public.contacts (organization_id, name, email, phone, category, lead_source, notes, created_by)
      select workspace, trim(item->>'name'), lower(trim(item->>'email')), trim(item->>'phone'),
        trim(item->>'category'), coalesce(item->>'leadSource', ''), coalesce(item->>'notes', ''), auth.uid()
      where not exists (
        select 1 from public.contacts c
        where c.organization_id = workspace and c.email = lower(trim(item->>'email'))
      );
    end if;
    get diagnostics affected = row_count;
    inserted := inserted + affected;
  end loop;
  return inserted;
end;
$$;

revoke all on function public.import_agency_records(uuid,text,jsonb) from public, anon, authenticated;
grant execute on function public.import_agency_records(uuid,text,jsonb) to authenticated;
