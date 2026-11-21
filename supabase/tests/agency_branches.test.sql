begin;
select plan(17);
insert into auth.users (id, email) values
  ('fcd44b97-74e5-4ebb-be40-e8bfa00c0011','branch-admin@example.test'),
  ('fcd44b97-74e5-4ebb-be40-e8bfa00c0012','branch-agent@example.test');
insert into public.profiles (id, full_name) values
  ('fcd44b97-74e5-4ebb-be40-e8bfa00c0011','Branch Admin'),
  ('fcd44b97-74e5-4ebb-be40-e8bfa00c0012','Branch Agent');
insert into public.organizations (id,name,email,created_by) values
  ('fcd44b97-74e5-4ebb-be40-e8bfa00c0013','Branch Agency','branch@example.test','fcd44b97-74e5-4ebb-be40-e8bfa00c0011');
insert into public.organization_memberships (organization_id,user_id,role) values
  ('fcd44b97-74e5-4ebb-be40-e8bfa00c0013','fcd44b97-74e5-4ebb-be40-e8bfa00c0011','admin'),
  ('fcd44b97-74e5-4ebb-be40-e8bfa00c0013','fcd44b97-74e5-4ebb-be40-e8bfa00c0012','agent');

set local role authenticated;
set local "request.jwt.claims" = '{"sub":"fcd44b97-74e5-4ebb-be40-e8bfa00c0011","role":"authenticated"}';
insert into public.agency_branches (id,organization_id,name) values
  ('fcd44b97-74e5-4ebb-be40-e8bfa00c0014','fcd44b97-74e5-4ebb-be40-e8bfa00c0013','Test Branch');
insert into public.properties (id,organization_id,title,type,listing_type,price,location,created_by,branch_id)
values ('fcd44b97-74e5-4ebb-be40-e8bfa00c0021','fcd44b97-74e5-4ebb-be40-e8bfa00c0013','Branch Home','House','sale',1000,'Lusaka',auth.uid(),'fcd44b97-74e5-4ebb-be40-e8bfa00c0014'),
       ('fcd44b97-74e5-4ebb-be40-e8bfa00c0022','fcd44b97-74e5-4ebb-be40-e8bfa00c0013','Shared Home','House','sale',1000,'Lusaka',auth.uid(),null);
insert into public.contacts (id,organization_id,name,email) values
  ('fcd44b97-74e5-4ebb-be40-e8bfa00c0023','fcd44b97-74e5-4ebb-be40-e8bfa00c0013','Branch Buyer','branch-buyer@example.test');
insert into public.leads (id,organization_id,contact_id,property_id,title,assigned_to) values
  ('fcd44b97-74e5-4ebb-be40-e8bfa00c0024','fcd44b97-74e5-4ebb-be40-e8bfa00c0013','fcd44b97-74e5-4ebb-be40-e8bfa00c0023','fcd44b97-74e5-4ebb-be40-e8bfa00c0021','Branch enquiry',auth.uid());
select is((select count(*) from public.properties where organization_id = 'fcd44b97-74e5-4ebb-be40-e8bfa00c0013'), 2::bigint, 'agency admins see branch and shared property');

set local "request.jwt.claims" = '{"sub":"fcd44b97-74e5-4ebb-be40-e8bfa00c0012","role":"authenticated"}';
select is((select count(*) from public.agency_branches), 0::bigint, 'an agent without membership cannot see branches');
select is((select count(*) from public.properties where id = 'fcd44b97-74e5-4ebb-be40-e8bfa00c0021'), 0::bigint, 'branch property is hidden');
select is((select count(*) from public.properties where id = 'fcd44b97-74e5-4ebb-be40-e8bfa00c0022'), 1::bigint, 'legacy agency-wide property remains visible');
select is((select count(*) from public.leads where id = 'fcd44b97-74e5-4ebb-be40-e8bfa00c0024'), 0::bigint, 'branch linked lead is hidden');
select throws_ok(
  $$insert into public.agency_branch_members values ('fcd44b97-74e5-4ebb-be40-e8bfa00c0013','fcd44b97-74e5-4ebb-be40-e8bfa00c0014',auth.uid(),'member')$$,
  '42501', null, 'an agent cannot give themself branch membership');

set local "request.jwt.claims" = '{"sub":"fcd44b97-74e5-4ebb-be40-e8bfa00c0011","role":"authenticated"}';
select is(public.reassign_agency_record('fcd44b97-74e5-4ebb-be40-e8bfa00c0013','property',
  'fcd44b97-74e5-4ebb-be40-e8bfa00c0021','fcd44b97-74e5-4ebb-be40-e8bfa00c0012'), false, 'admins cannot assign branch work to staff without branch access');
insert into public.agency_branch_members values
  ('fcd44b97-74e5-4ebb-be40-e8bfa00c0013','fcd44b97-74e5-4ebb-be40-e8bfa00c0014','fcd44b97-74e5-4ebb-be40-e8bfa00c0012','manager');
select is(public.reassign_agency_record('fcd44b97-74e5-4ebb-be40-e8bfa00c0013','property',
  'fcd44b97-74e5-4ebb-be40-e8bfa00c0021','fcd44b97-74e5-4ebb-be40-e8bfa00c0012'), true, 'admins can assign work to branch staff');
select is((select count(*) from public.agency_access_events where action = 'Branch access granted or changed'), 1::bigint, 'branch access grants are recorded');
select is(public.reassign_agency_record('fcd44b97-74e5-4ebb-be40-e8bfa00c0013','lead',
  'fcd44b97-74e5-4ebb-be40-e8bfa00c0024','fcd44b97-74e5-4ebb-be40-e8bfa00c0012'), true, 'an authorised branch member can receive a lead assignment');
select is((select count(*) from public.lead_interactions where summary = 'Lead assigned to Branch Agent'), 1::bigint, 'lead reassignment adds a transactional history note');
select throws_ok(
  $$update public.organization_memberships set role = 'agent' where user_id = auth.uid()$$,
  'P0001', 'An organization must retain an active administrator', 'the last agency administrator cannot be demoted');
set local "request.jwt.claims" = '{"sub":"fcd44b97-74e5-4ebb-be40-e8bfa00c0012","role":"authenticated"}';
select is((select count(*) from public.agency_branches), 1::bigint, 'assigned staff can see their branch');
select is((select count(*) from public.properties where id = 'fcd44b97-74e5-4ebb-be40-e8bfa00c0021'), 1::bigint, 'assigned staff can see branch property');
select is((select count(*) from public.leads where id = 'fcd44b97-74e5-4ebb-be40-e8bfa00c0024'), 1::bigint, 'assigned staff can see linked lead');
select throws_ok(
  $$update public.properties set branch_id = null where id = 'fcd44b97-74e5-4ebb-be40-e8bfa00c0021'$$,
  '42501', 'Only agency administrators can assign property branches', 'branch staff cannot widen the property scope');

select is((select count(*) from public.agency_access_events), 0::bigint, 'agents cannot read agency access history');
select * from finish();
rollback;
