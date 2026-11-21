create table public.enterprise_demo_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(full_name) between 2 and 100),
  company text not null check (length(company) between 2 and 150),
  email text not null check (length(email) between 3 and 254 and email = lower(email)),
  phone text not null check (length(phone) <= 32),
  team_size text not null check (team_size in ('1', '2–5', '6–20', '21–50', '51+')),
  requirements text not null check (length(requirements) <= 1500),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index enterprise_demo_requests_email_time
  on public.enterprise_demo_requests(email, created_at desc);
create index enterprise_demo_requests_time
  on public.enterprise_demo_requests(created_at desc);

create table public.enterprise_demo_history (
  id bigint generated always as identity primary key,
  request_id uuid not null references public.enterprise_demo_requests(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  status text not null check (status in ('new', 'contacted', 'closed')),
  assigned_to uuid references auth.users(id) on delete set null,
  note text not null check (length(note) <= 1500),
  created_at timestamptz not null default now()
);

create index enterprise_demo_history_request_time
  on public.enterprise_demo_history(request_id, created_at desc);

alter table public.enterprise_demo_requests enable row level security;
alter table public.enterprise_demo_history enable row level security;
revoke all on public.enterprise_demo_requests, public.enterprise_demo_history from public, anon, authenticated;
grant select on public.enterprise_demo_requests, public.enterprise_demo_history to service_role;

create function public.submit_enterprise_demo(
  p_full_name text, p_company text, p_email text, p_phone text, p_team_size text, p_requirements text
) returns boolean
language plpgsql security definer set search_path = ''
as $$
begin
  -- Serialise the cap and insertion across app instances, including simultaneous retries.
  perform pg_catalog.pg_advisory_xact_lock(410831265);
  if (select count(*) from public.enterprise_demo_requests
      where email = p_email and created_at > now() - interval '24 hours') >= 3
     or (select count(*) from public.enterprise_demo_requests
         where created_at > now() - interval '10 minutes') >= 60 then
    return false;
  end if;

  insert into public.enterprise_demo_requests(full_name, company, email, phone, team_size, requirements)
    values (p_full_name, p_company, p_email, p_phone, p_team_size, p_requirements);
  return true;
end;
$$;

create function public.review_enterprise_demo(
  p_id uuid, p_actor uuid, p_status text, p_assignment text, p_note text
) returns boolean
language plpgsql security definer set search_path = ''
as $$
declare
  assignee uuid;
begin
  if not exists (
    select 1 from auth.users
    where id = p_actor and raw_app_meta_data -> 'enterprise_demo_staff' = 'true'::jsonb
  ) then
    return false;
  end if;
  if p_assignment not in ('keep', 'self', 'clear') then
    return false;
  end if;

  update public.enterprise_demo_requests
    set status = p_status,
      assigned_to = case p_assignment when 'self' then p_actor when 'clear' then null else assigned_to end
    where id = p_id returning assigned_to into assignee;
  if not found then
    return false;
  end if;

  insert into public.enterprise_demo_history(request_id, actor_id, status, assigned_to, note)
    values (p_id, p_actor, p_status, assignee, p_note);
  return true;
end;
$$;

revoke execute on function public.submit_enterprise_demo(text, text, text, text, text, text) from public, anon, authenticated;
revoke execute on function public.review_enterprise_demo(uuid, uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_enterprise_demo(text, text, text, text, text, text) to service_role;
grant execute on function public.review_enterprise_demo(uuid, uuid, text, text, text) to service_role;
