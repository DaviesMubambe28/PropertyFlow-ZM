begin;
select plan(7);
insert into auth.users (id, email) values
  ('db3b948e-cfdc-4dfd-adf8-3f51a8e70515', 'csv-owner@example.test'),
  ('db3b948e-cfdc-4dfd-adf8-3f51a8e70516', 'csv-agent@example.test');
insert into public.profiles (id, full_name) values
  ('db3b948e-cfdc-4dfd-adf8-3f51a8e70515', 'CSV Owner'),
  ('db3b948e-cfdc-4dfd-adf8-3f51a8e70516', 'CSV Agent');
insert into public.organizations (id, name, email, created_by) values
  ('db3b948e-cfdc-4dfd-adf8-3f51a8e70517', 'Import Agency', 'csv-owner@example.test', 'db3b948e-cfdc-4dfd-adf8-3f51a8e70515');
insert into public.organization_memberships (organization_id, user_id, role) values
  ('db3b948e-cfdc-4dfd-adf8-3f51a8e70517', 'db3b948e-cfdc-4dfd-adf8-3f51a8e70515', 'admin'),
  ('db3b948e-cfdc-4dfd-adf8-3f51a8e70517', 'db3b948e-cfdc-4dfd-adf8-3f51a8e70516', 'agent');

set local role authenticated;
set local "request.jwt.claims" = '{"sub":"db3b948e-cfdc-4dfd-adf8-3f51a8e70515","role":"authenticated"}';
select is(public.import_agency_records('db3b948e-cfdc-4dfd-adf8-3f51a8e70517', 'properties',
  '[{"title":"CSV home","type":"House","listingType":"sale","price":1000,"location":"Lusaka"},{"title":"csv HOME","type":"House","listingType":"sale","price":2000,"location":"lusaka"}]'), 1, 'duplicate property rows are skipped');
select is((select status from public.properties where title = 'CSV home'), 'draft', 'imports create private drafts');
select is((select price from public.properties where title = 'CSV home'), 1000::numeric, 'duplicate rows never overwrite the first listing');
select is(public.import_agency_records('db3b948e-cfdc-4dfd-adf8-3f51a8e70517', 'contacts',
  '[{"name":"New Buyer","email":"BUYER@EXAMPLE.TEST","phone":"+260971000000","category":"buyer"}]'), 1, 'admin imports contacts');
select is(public.import_agency_records('db3b948e-cfdc-4dfd-adf8-3f51a8e70517', 'contacts',
  '[{"name":"Replacement","email":"buyer@example.test","phone":"+260971000000","category":"buyer"}]'), 0, 'retries skip existing emails');
select throws_ok(
  $$select public.import_agency_records('db3b948e-cfdc-4dfd-adf8-3f51a8e70517', 'properties', '[]')$$,
  '22023', 'Invalid import size', 'empty imports are rejected');
set local "request.jwt.claims" = '{"sub":"db3b948e-cfdc-4dfd-adf8-3f51a8e70516","role":"authenticated"}';
select throws_ok(
  $$select public.import_agency_records('db3b948e-cfdc-4dfd-adf8-3f51a8e70517', 'contacts', '[]')$$,
  '42501', 'Agency administrator access required', 'an agent cannot invoke agency import');

select * from finish();
rollback;
