begin;
select plan(12);

select ok(not has_table_privilege('anon', 'public.enterprise_demo_requests', 'select'), 'anonymous users cannot read requests');
select ok(not has_table_privilege('authenticated', 'public.enterprise_demo_requests', 'update'), 'workspace members cannot update requests');
select ok(not has_table_privilege('authenticated', 'public.enterprise_demo_history', 'select'), 'workspace members cannot read follow-up notes');
select ok(not has_function_privilege('anon', 'public.submit_enterprise_demo(text,text,text,text,text,text)', 'execute'), 'RPC is not exposed to the anonymous API');
select ok(not has_function_privilege('authenticated', 'public.review_enterprise_demo(uuid,uuid,text,text,text)', 'execute'), 'workspace members cannot call the review RPC');

insert into auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data)
values
  ('88000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'staff@test.local', '{"enterprise_demo_staff":true}', '{}'),
  ('88000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'member@test.local', '{}', '{"enterprise_demo_staff":true}');

set local role service_role;
select ok(public.submit_enterprise_demo('Test Person', 'Example Agency', 'sales@test.local', '', '2–5', 'Portfolio review'), 'a valid request is saved');
select ok(public.submit_enterprise_demo('Test Person', 'Example Agency', 'sales@test.local', '', '2–5', ''), 'a second request fits the email limit');
select ok(public.submit_enterprise_demo('Test Person', 'Example Agency', 'sales@test.local', '', '2–5', ''), 'a third request fits the email limit');
select ok(not public.submit_enterprise_demo('Test Person', 'Example Agency', 'sales@test.local', '', '2–5', ''), 'the next request is rate limited');

select ok(not public.review_enterprise_demo(
  (select id from public.enterprise_demo_requests where requirements = 'Portfolio review'),
  '88000000-0000-4000-8000-000000000002', 'contacted', 'self', 'Spoofed role'
), 'caller-supplied user metadata cannot grant staff access');
select ok(public.review_enterprise_demo(
  (select id from public.enterprise_demo_requests where requirements = 'Portfolio review'),
  '88000000-0000-4000-8000-000000000001', 'contacted', 'self', 'Emailed prospect'
), 'platform staff can save and assign a follow-up');
select is(
  (select count(*)::int from public.enterprise_demo_history h join public.enterprise_demo_requests r on r.id = h.request_id
    where r.status = 'contacted' and h.status = r.status and h.assigned_to = r.assigned_to and h.note = 'Emailed prospect'),
  1, 'the request and its history reflect the same update'
);

reset role;
select * from finish();
rollback;
