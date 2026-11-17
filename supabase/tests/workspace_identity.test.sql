begin;
select plan(17);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'admin-a@test.local', '', now(), '{}', '{"full_name":"Admin A"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'admin-b@test.local', '', now(), '{}', '{"full_name":"Admin B"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'agent@test.local', '', now(), '{}', '{"full_name":"Agent"}', now(), now());

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000001","email":"admin-a@test.local","role":"authenticated"}', true);
select lives_ok(
  $$select public.bootstrap_organization('Agency A', 'OFFICE@A.TEST', 'Admin A')$$,
  'an authenticated user can bootstrap an organization'
);
select is((select count(*)::integer from public.organizations), 1, 'member can read the new organization');
select is((select count(*)::integer from public.organization_memberships), 1, 'bootstrap creates one membership');
select is((select role from public.organization_memberships limit 1), 'admin', 'first membership is administrator');
select lives_ok(
  $$select public.bootstrap_organization('Duplicate', 'duplicate@a.test', 'Admin A')$$,
  'bootstrap is safe to retry'
);
select is((select count(*)::integer from public.organizations), 1, 'retry does not create a duplicate organization');
select lives_ok(
  $$insert into public.organization_invitations (id, organization_id, email, invited_by, expires_at)
    select '40000000-0000-0000-0000-000000000001', id, 'agent@test.local', auth.uid(), now() + interval '7 days'
    from public.organizations limit 1$$,
  'an administrator can create an invitation'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000002","email":"admin-b@test.local","role":"authenticated"}', true);
select lives_ok(
  $$select public.bootstrap_organization('Agency B', 'office@b.test', 'Admin B')$$,
  'a second user can create a separate organization'
);
select is((select count(*)::integer from public.organizations), 1, 'RLS exposes only the current organization');
select is((select count(*)::integer from public.organization_memberships), 1, 'RLS hides cross-agency memberships');
select throws_ok(
  $$select public.accept_organization_invitation('40000000-0000-0000-0000-000000000001')$$,
  'P0001',
  'Invitation does not match the signed-in user',
  'a different email cannot accept the invitation'
);

reset role;
select throws_ok(
  $$update public.organization_memberships set status = 'deactivated' where user_id = '10000000-0000-0000-0000-000000000002'$$,
  'P0001',
  'An organization must retain an active administrator',
  'the last active administrator cannot be deactivated'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000003","email":"agent@test.local","role":"authenticated"}', true);
select throws_ok(
  $$select public.bootstrap_organization('', 'bad', '')$$,
  'P0001',
  'Invalid organization registration details',
  'bootstrap rejects invalid identity details'
);
select is((select count(*)::integer from public.organizations), 0, 'signed-in outsider cannot read either agency');
select lives_ok(
  $$select public.accept_organization_invitation('40000000-0000-0000-0000-000000000001')$$,
  'the matching user can accept the invitation'
);
select is(
  (select role from public.organization_memberships where user_id = auth.uid()),
  'agent',
  'acceptance creates an agent membership'
);
select throws_ok(
  $$select public.accept_organization_invitation('40000000-0000-0000-0000-000000000001')$$,
  'P0001',
  'Invitation is not available',
  'an accepted invitation cannot be replayed'
);

select * from finish();
rollback;
