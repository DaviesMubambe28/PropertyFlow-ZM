begin;
select plan(11);

select has_table('public', 'properties', 'properties table exists');
select has_table('public', 'contacts', 'contacts table exists');
select has_table('public', 'leads', 'leads table exists');
select has_table('public', 'viewings', 'viewings table exists');
select has_table('public', 'tasks', 'tasks table exists');
select has_table('public', 'deals', 'deals table exists');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('00000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'ops-a@test.local', '', now(), '{}', '{"full_name":"Ops A"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'ops-b@test.local', '', now(), '{}', '{"full_name":"Ops B"}', now(), now());

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"20000000-0000-0000-0000-000000000001","email":"ops-a@test.local","role":"authenticated"}', true);
select public.bootstrap_organization('Operations A', 'office-a@test.local', 'Ops A');
select lives_ok(
  $$insert into public.properties (organization_id, title, type, listing_type, price, location, description, created_by)
    select id, 'Kabulonga Home', 'house', 'sale', 750000, 'Lusaka', 'Family home', auth.uid()
    from public.organizations limit 1$$,
  'an active member can create an operational record'
);
select is((select count(*)::integer from public.properties), 1, 'member can read own agency records');

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"20000000-0000-0000-0000-000000000002","email":"ops-b@test.local","role":"authenticated"}', true);
select public.bootstrap_organization('Operations B', 'office-b@test.local', 'Ops B');
select is((select count(*)::integer from public.properties), 0, 'cross-agency records are hidden');
select lives_ok(
  $$update public.properties set title = 'Stolen'$$,
  'a denied cross-agency update does not expose an authorization oracle'
);
reset role;
select is(
  (select title from public.properties limit 1),
  'Kabulonga Home',
  'cross-agency records cannot be modified'
);

select * from finish();
rollback;
