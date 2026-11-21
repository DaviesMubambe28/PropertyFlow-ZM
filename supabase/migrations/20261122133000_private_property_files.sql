insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-files', 'property-files', false, 768000, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);

create function public.can_access_property_file(object_name text)
returns boolean language sql stable set search_path = ''
as $$
  select cardinality(storage.foldername(object_name)) = 1 and exists (
    select 1 from public.properties p
    where p.id = case
      when (storage.foldername(object_name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        then (storage.foldername(object_name))[1]::uuid
      else null
    end
  );
$$;
revoke all on function public.can_access_property_file(text) from public, anon, authenticated;
grant execute on function public.can_access_property_file(text) to authenticated;

create policy property_files_read on storage.objects for select to authenticated
using (bucket_id = 'property-files' and public.can_access_property_file(name));
create policy property_files_upload on storage.objects for insert to authenticated
with check (bucket_id = 'property-files' and public.can_access_property_file(name));
