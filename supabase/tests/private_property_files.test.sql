begin;
select plan(8);
insert into auth.users (id, email) values
  ('6cf52e68-824c-424c-816c-079e27ac1001','file-admin@example.test'),
  ('6cf52e68-824c-424c-816c-079e27ac1002','file-outsider@example.test');
insert into public.profiles (id,full_name) values
  ('6cf52e68-824c-424c-816c-079e27ac1001','File Admin'),
  ('6cf52e68-824c-424c-816c-079e27ac1002','Outside User');
insert into public.organizations (id,name,email,created_by) values
  ('6cf52e68-824c-424c-816c-079e27ac1003','File Agency','files@example.test','6cf52e68-824c-424c-816c-079e27ac1001');
insert into public.organization_memberships (organization_id,user_id,role) values
  ('6cf52e68-824c-424c-816c-079e27ac1003','6cf52e68-824c-424c-816c-079e27ac1001','admin');
insert into public.properties (id,organization_id,title,type,listing_type,price,location,created_by)
values ('6cf52e68-824c-424c-816c-079e27ac1004','6cf52e68-824c-424c-816c-079e27ac1003','File Fixture','House','sale',1000,'Lusaka','6cf52e68-824c-424c-816c-079e27ac1001');

select is((select public from storage.buckets where id='property-files'), false, 'the property bucket is private');
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"6cf52e68-824c-424c-816c-079e27ac1001","role":"authenticated"}';
select is(public.can_access_property_file('6cf52e68-824c-424c-816c-079e27ac1004/example.pdf'), true, 'the agency can reach the property folder');
select is(public.can_access_property_file('invalid/example.pdf'), false, 'malformed folders cannot associate files');
select is(public.can_access_property_file('6cf52e68-824c-424c-816c-079e27ac1004/subfolder/example.pdf'), false, 'nested folders are rejected');
select lives_ok(
  $$insert into storage.objects(bucket_id,name) values ('property-files','6cf52e68-824c-424c-816c-079e27ac1004/example.pdf')$$,
  'an authorised staff member can create an object');
select is((select count(*) from storage.objects where name='6cf52e68-824c-424c-816c-079e27ac1004/example.pdf'),1::bigint,'authorised staff can read the object');
set local "request.jwt.claims" = '{"sub":"6cf52e68-824c-424c-816c-079e27ac1002","role":"authenticated"}';
select is((select count(*) from storage.objects where name='6cf52e68-824c-424c-816c-079e27ac1004/example.pdf'),0::bigint,'outsiders cannot read the object');
select throws_ok(
  $$insert into storage.objects(bucket_id,name) values ('property-files','6cf52e68-824c-424c-816c-079e27ac1004/other.pdf')$$,
  '42501',null,'outsiders cannot upload to another agency property');
select * from finish();
rollback;
