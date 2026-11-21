create table public.public_property_listings (
  id uuid primary key references public.properties(id) on delete cascade,
  title text not null,
  type text not null,
  listing_type text not null,
  price numeric(14,2) not null,
  location text not null,
  bedrooms integer not null,
  bathrooms integer not null,
  area numeric(12,2) not null,
  image_url text,
  description text not null,
  published_at timestamptz not null default now()
);

create index public_property_listings_published_idx
  on public.public_property_listings (published_at desc, id);

alter table public.public_property_listings enable row level security;
revoke all on public.public_property_listings from public, anon, authenticated;
grant select on public.public_property_listings to anon, authenticated;
create policy public_property_listings_read on public.public_property_listings
  for select to anon, authenticated using (true);

create function public.set_property_publication(property_id uuid, publish boolean, expected_version timestamptz)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  listing public.properties%rowtype;
begin
  select * into listing
  from public.properties
  where id = property_id and public.is_active_organization_admin(organization_id)
  for update;
  if not found then
    return false;
  end if;
  if not publish then
    delete from public.public_property_listings where id = listing.id;
    return true;
  end if;
  if listing.status <> 'available' or listing.updated_at is distinct from expected_version then
    return false;
  end if;

  insert into public.public_property_listings (
    id, title, type, listing_type, price, location, bedrooms, bathrooms, area, image_url, description
  ) values (
    listing.id, listing.title, listing.type, listing.listing_type, listing.price, listing.location,
    listing.bedrooms, listing.bathrooms, listing.area,
    case when listing.image_url like 'https://%' then listing.image_url else null end,
    listing.description
  )
  on conflict (id) do nothing;
  return true;
end;
$$;

revoke all on function public.set_property_publication(uuid,boolean,timestamptz) from public, anon, authenticated;
grant execute on function public.set_property_publication(uuid,boolean,timestamptz) to authenticated;

create function public.withdraw_changed_property_publication()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status <> 'available' or
    row(new.organization_id, new.title, new.type, new.listing_type, new.price, new.location,
        new.bedrooms, new.bathrooms, new.area, new.image_url, new.description)
    is distinct from
    row(old.organization_id, old.title, old.type, old.listing_type, old.price, old.location,
        old.bedrooms, old.bathrooms, old.area, old.image_url, old.description)
  then
    delete from public.public_property_listings where id = new.id;
  end if;
  return new;
end;
$$;

revoke all on function public.withdraw_changed_property_publication() from public, anon, authenticated;

create trigger properties_withdraw_publication
after update on public.properties
for each row execute function public.withdraw_changed_property_publication();
