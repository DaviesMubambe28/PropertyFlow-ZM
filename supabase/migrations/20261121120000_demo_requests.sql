create table public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  company text not null check (char_length(company) between 2 and 160),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null check (char_length(phone) <= 30),
  team_size text not null check (team_size in ('1', '2–10', '11–50', '51+')),
  message text not null check (char_length(message) <= 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now()
);

create table public.demo_request_activity (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.demo_requests on delete cascade,
  staff_id uuid not null,
  status text not null check (status in ('new', 'contacted', 'qualified', 'closed')),
  note text not null check (char_length(note) <= 2000),
  created_at timestamptz not null default now()
);

alter table public.demo_requests enable row level security;
alter table public.demo_request_activity enable row level security;
revoke all on public.demo_requests, public.demo_request_activity from public, anon, authenticated;
grant select, insert, update, delete on public.demo_requests, public.demo_request_activity to service_role;

create index demo_requests_created_idx on public.demo_requests (created_at desc);
create index demo_requests_email_created_idx on public.demo_requests (email, created_at desc);
create index demo_request_activity_request_idx on public.demo_request_activity (request_id, created_at desc);

create function public.submit_demo_request(payload jsonb)
returns boolean
language plpgsql
set search_path = ''
as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(1972042026);
  if (select count(*) from public.demo_requests where created_at >= now() - interval '1 minute') >= 20 then
    return false;
  end if;
  if exists (
    select 1 from public.demo_requests
    where email = payload->>'email' and created_at >= now() - interval '15 minutes'
  ) then
    return true;
  end if;
  insert into public.demo_requests (name, company, email, phone, team_size, message)
  values (payload->>'name', payload->>'company', payload->>'email', payload->>'phone',
          payload->>'teamSize', payload->>'message');
  return true;
end;
$$;

create function public.update_demo_request(request_id uuid, staff_id uuid, next_status text, note text)
returns boolean
language plpgsql
set search_path = ''
as $$
begin
  update public.demo_requests set status = next_status where id = request_id;
  if not found then
    return false;
  end if;
  insert into public.demo_request_activity (request_id, staff_id, status, note)
  values ($1, $2, $3, $4);
  return true;
end;
$$;

revoke all on function public.submit_demo_request(jsonb) from public, anon, authenticated;
revoke all on function public.update_demo_request(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.submit_demo_request(jsonb) to service_role;
grant execute on function public.update_demo_request(uuid, uuid, text, text) to service_role;
