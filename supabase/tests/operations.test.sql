begin;
select plan(28);

select has_table('public', 'properties', 'properties table exists');
select has_table('public', 'contacts', 'contacts table exists');
select has_table('public', 'leads', 'leads table exists');
select has_table('public', 'viewings', 'viewings table exists');
select has_table('public', 'tasks', 'tasks table exists');
select has_table('public', 'deals', 'deals table exists');
select has_table('public', 'lead_interactions', 'lead interaction history table exists');
select has_column('public', 'properties', 'owner_name', 'properties record the owner');
select has_column('public', 'properties', 'assigned_to', 'properties can be assigned to an agent');
select has_column('public', 'contacts', 'whatsapp', 'contacts record WhatsApp details');
select has_column('public', 'viewings', 'feedback', 'viewings record customer feedback');
select has_column('public', 'tasks', 'contact_id', 'tasks can link to a customer');
select has_column('public', 'deals', 'transaction_type', 'deals distinguish sales from rentals');
select has_column('public', 'deals', 'closing_date', 'deals record completion dates');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('00000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'ops-a@test.local', '', now(), '{}', '{"full_name":"Ops A"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'ops-b@test.local', '', now(), '{}', '{"full_name":"Ops B"}', now(), now());

insert into public.profiles (id, full_name) values ('20000000-0000-0000-0000-000000000002', 'Ops B');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"20000000-0000-0000-0000-000000000001","email":"ops-a@test.local","role":"authenticated"}', true);
select public.bootstrap_organization('Operations A', 'office-a@test.local', 'Ops A');
select lives_ok(
  $$insert into public.properties (id, organization_id, title, type, listing_type, price, location, description, created_by)
    select '50000000-0000-0000-0000-000000000001', id, 'Kabulonga Home', 'house', 'sale', 750000, 'Lusaka', 'Family home', auth.uid()
    from public.organizations limit 1$$,
  'an active member can create an operational record'
);
select is((select count(*)::integer from public.properties), 1, 'member can read own agency records');
insert into public.contacts (id, organization_id, name, email, phone, created_by)
select '50000000-0000-0000-0000-000000000002', id, 'Buyer One', 'buyer@test.local', '+260', auth.uid() from public.organizations limit 1;
insert into public.leads (id, organization_id, contact_id, property_id, title, assigned_to)
select '50000000-0000-0000-0000-000000000003', id, '50000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 'Buyer enquiry', auth.uid() from public.organizations limit 1;
insert into public.deals (id, organization_id, lead_id, property_id, client_name, amount, assigned_to, transaction_type)
select '50000000-0000-0000-0000-000000000004', id, '50000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', 'Buyer One', 700000, auth.uid(), 'sale' from public.organizations limit 1;
select lives_ok(
  $$update public.deals set status = 'completed' where id = '50000000-0000-0000-0000-000000000004'$$,
  'a deal can be completed'
);
select is(
  (select status from public.properties where id = '50000000-0000-0000-0000-000000000001'),
  'sold',
  'completing a sale marks the property sold'
);

insert into public.organization_memberships (organization_id, user_id, role, status)
select id, '20000000-0000-0000-0000-000000000002', 'agent', 'active'
from public.organizations limit 1;
select lives_ok(
  $$update public.leads set assigned_to = '20000000-0000-0000-0000-000000000002'$$,
  'an administrator can assign a lead to an active agent'
);
select is((select assigned_to::text from public.leads limit 1), '20000000-0000-0000-0000-000000000002', 'assignment persisted');

select set_config('request.jwt.claims', '{"sub":"20000000-0000-0000-0000-000000000002","email":"ops-b@test.local","role":"authenticated"}', true);
select throws_ok(
  $$update public.leads set assigned_to = '20000000-0000-0000-0000-000000000001'$$,
  '42501', 'Only an active agency administrator can reassign leads', 'an agent cannot reassign a lead'
);
select lives_ok($$update public.leads set stage = 'contacted'$$, 'an agent can still update a lead stage');

select set_config('request.jwt.claims', '{"sub":"20000000-0000-0000-0000-000000000001","email":"ops-a@test.local","role":"authenticated"}', true);
update public.leads set assigned_to = auth.uid();
update public.organization_memberships set status = 'deactivated' where user_id = '20000000-0000-0000-0000-000000000002';
select throws_ok(
  $$update public.leads set assigned_to = '20000000-0000-0000-0000-000000000002'$$,
  '23514', 'The assignee must be an active workspace member', 'an inactive agent cannot receive an assignment'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"20000000-0000-0000-0000-000000000002","email":"ops-b@test.local","role":"authenticated"}', true);
select public.bootstrap_organization('Operations B', 'office-b@test.local', 'Ops B');
select is((select count(*)::integer from public.properties), 0, 'cross-agency records are hidden');
select lives_ok(
  $$update public.properties set title = 'Stolen'$$,
  'a denied cross-agency update does not expose an authorization oracle'
);
select lives_ok(
  $$delete from public.properties$$,
  'a denied cross-agency delete leaves hidden rows untouched'
);
reset role;
select is(
  (select title from public.properties where id = '50000000-0000-0000-0000-000000000001'),
  'Kabulonga Home',
  'cross-agency records cannot be modified'
);

select is(
  (select count(*)::integer from public.properties where id = '50000000-0000-0000-0000-000000000001'),
  1, 'cross-agency records cannot be deleted'
);

select * from finish();
rollback;
