begin;
select plan(13);

insert into auth.users (id, email) values
  ('edb23b5c-815c-45a3-9914-66bc7a22fa15', 'publishing-owner@example.test'),
  ('edb23b5c-815c-45a3-9914-66bc7a22fa16', 'publishing-agent@example.test'),
  ('edb23b5c-815c-45a3-9914-66bc7a22fa17', 'publishing-outsider@example.test');
insert into public.profiles (id, full_name) values
  ('edb23b5c-815c-45a3-9914-66bc7a22fa15', 'Listing Owner'),
  ('edb23b5c-815c-45a3-9914-66bc7a22fa16', 'Listing Agent'),
  ('edb23b5c-815c-45a3-9914-66bc7a22fa17', 'Other Agency Owner');
insert into public.organizations (id, name, email, created_by) values
  ('a6d52c51-666a-4180-a293-ec36acface15', 'Publishing Agency', 'agency@example.test', 'edb23b5c-815c-45a3-9914-66bc7a22fa15'),
  ('a6d52c51-666a-4180-a293-ec36acface17', 'Other Agency', 'other@example.test', 'edb23b5c-815c-45a3-9914-66bc7a22fa17');
insert into public.organization_memberships (organization_id, user_id, role) values
  ('a6d52c51-666a-4180-a293-ec36acface15', 'edb23b5c-815c-45a3-9914-66bc7a22fa15', 'admin'),
  ('a6d52c51-666a-4180-a293-ec36acface15', 'edb23b5c-815c-45a3-9914-66bc7a22fa16', 'agent'),
  ('a6d52c51-666a-4180-a293-ec36acface17', 'edb23b5c-815c-45a3-9914-66bc7a22fa17', 'admin');
insert into public.properties (id, organization_id, title, type, listing_type, price, location, status, owner_phone, created_by)
values ('e0b8be71-8adb-433a-a055-bfe9ba3a7700', 'a6d52c51-666a-4180-a293-ec36acface15',
  'Lusaka listing fixture', 'House', 'sale', 1200000, 'Lusaka', 'available', 'private fixture',
  'edb23b5c-815c-45a3-9914-66bc7a22fa15');

set local role anon;
select is((select count(*) from public.public_property_listings where id = 'e0b8be71-8adb-433a-a055-bfe9ba3a7700'), 0::bigint, 'available private properties are unpublished by default');
select is(has_function_privilege('anon', 'public.set_property_publication(uuid,boolean,timestamptz)', 'EXECUTE'), false, 'visitors cannot invoke publishing');
reset role;
select hasnt_column('public', 'public_property_listings', 'owner_phone', 'the public snapshot has no private owner phone');
select is(has_table_privilege('authenticated', 'public.public_property_listings', 'INSERT'), false, 'authenticated roles cannot bypass the publishing function');

set local role authenticated;
set local "request.jwt.claims" = '{"sub":"edb23b5c-815c-45a3-9914-66bc7a22fa16","role":"authenticated"}';
select is(public.set_property_publication('e0b8be71-8adb-433a-a055-bfe9ba3a7700', true, (select updated_at from public.properties where id = 'e0b8be71-8adb-433a-a055-bfe9ba3a7700')), false, 'agency agents cannot publish');
set local "request.jwt.claims" = '{"sub":"edb23b5c-815c-45a3-9914-66bc7a22fa17","role":"authenticated"}';
select is(public.set_property_publication('e0b8be71-8adb-433a-a055-bfe9ba3a7700', true, (select updated_at from public.properties where id = 'e0b8be71-8adb-433a-a055-bfe9ba3a7700')), false, 'admins cannot publish another agency record');
set local "request.jwt.claims" = '{"sub":"edb23b5c-815c-45a3-9914-66bc7a22fa15","role":"authenticated"}';
select is(public.set_property_publication('e0b8be71-8adb-433a-a055-bfe9ba3a7700', true, '2001-01-01Z'), false, 'stale review cannot publish later edits');
select is(public.set_property_publication('e0b8be71-8adb-433a-a055-bfe9ba3a7700', true, (select updated_at from public.properties where id = 'e0b8be71-8adb-433a-a055-bfe9ba3a7700')), true, 'agencies can explicitly publish available properties');
reset role;

set local role anon;
select is((select title from public.public_property_listings where id = 'e0b8be71-8adb-433a-a055-bfe9ba3a7700'), 'Lusaka listing fixture', 'published listings can be read by anonymous visitors');
reset role;
update public.properties set owner_phone = 'new private phone' where id = 'e0b8be71-8adb-433a-a055-bfe9ba3a7700';
select is((select count(*) from public.public_property_listings where id = 'e0b8be71-8adb-433a-a055-bfe9ba3a7700'), 1::bigint, 'private-only edits leave reviewed public details in place');
update public.properties set price = 1300000 where id = 'e0b8be71-8adb-433a-a055-bfe9ba3a7700';
select is((select count(*) from public.public_property_listings where id = 'e0b8be71-8adb-433a-a055-bfe9ba3a7700'), 0::bigint, 'public-field edits withdraw the listing for renewed review');
select is(public.set_property_publication('e0b8be71-8adb-433a-a055-bfe9ba3a7700', true, (select updated_at from public.properties where id = 'e0b8be71-8adb-433a-a055-bfe9ba3a7700')), true, 'an edited property can be reviewed and republished');
update public.properties set status = 'sold' where id = 'e0b8be71-8adb-433a-a055-bfe9ba3a7700';
select is((select count(*) from public.public_property_listings where id = 'e0b8be71-8adb-433a-a055-bfe9ba3a7700'), 0::bigint, 'sold properties are withdrawn');

select * from finish();
rollback;
