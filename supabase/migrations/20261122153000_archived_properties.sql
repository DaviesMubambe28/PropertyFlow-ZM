alter table public.properties drop constraint properties_status_check;
alter table public.properties add constraint properties_status_check
  check (status in ('available','reserved','under_offer','sold','rented','unavailable','draft','archived'));
