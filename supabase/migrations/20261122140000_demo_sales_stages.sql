alter table public.demo_requests drop constraint demo_requests_status_check;
alter table public.demo_requests add constraint demo_requests_status_check
  check (status in ('new','contacted','qualified','demo_requested','evaluation','pilot','won','lost','closed'));
alter table public.demo_request_activity drop constraint demo_request_activity_status_check;
alter table public.demo_request_activity add constraint demo_request_activity_status_check
  check (status in ('new','contacted','qualified','demo_requested','evaluation','pilot','won','lost','closed'));
