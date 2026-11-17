create table public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null check (length(btrim(title)) between 2 and 160),
  type text not null check (length(btrim(type)) between 2 and 80),
  listing_type text not null check (listing_type in ('sale', 'rent')),
  price numeric(14,2) not null check (price >= 0),
  location text not null check (length(btrim(location)) between 2 and 160),
  bedrooms integer not null default 0 check (bedrooms between 0 and 100),
  bathrooms integer not null default 0 check (bathrooms between 0 and 100),
  area numeric(12,2) not null default 0 check (area >= 0),
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  image_url text,
  description text not null default '' check (length(description) <= 5000),
  featured boolean not null default false,
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id)
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (length(btrim(name)) between 2 and 160),
  email text not null check (email = lower(btrim(email))),
  phone text not null default '' check (length(phone) <= 40),
  category text not null default 'buyer' check (length(category) between 2 and 40),
  lead_source text not null default '' check (length(lead_source) <= 80),
  budget text not null default '' check (length(budget) <= 80),
  notes text not null default '' check (length(notes) <= 5000),
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  contact_id uuid not null,
  property_id uuid,
  title text not null check (length(btrim(title)) between 2 and 160),
  stage text not null default 'new' check (stage in ('new', 'contacted', 'qualified', 'viewing_scheduled', 'negotiation', 'won', 'lost')),
  assigned_to uuid not null,
  value numeric(14,2) not null default 0 check (value >= 0),
  notes text not null default '' check (length(notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, contact_id) references public.contacts(organization_id, id) on delete restrict,
  foreign key (organization_id, property_id) references public.properties(organization_id, id) on delete set null (property_id),
  foreign key (organization_id, assigned_to) references public.organization_memberships(organization_id, user_id)
);

create table public.viewings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid not null,
  property_id uuid not null,
  scheduled_at timestamptz not null,
  agent_id uuid not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  notes text not null default '' check (length(notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (organization_id, lead_id) references public.leads(organization_id, id) on delete cascade,
  foreign key (organization_id, property_id) references public.properties(organization_id, id) on delete restrict,
  foreign key (organization_id, agent_id) references public.organization_memberships(organization_id, user_id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null check (length(btrim(title)) between 2 and 200),
  description text not null default '' check (length(description) <= 5000),
  assignee_id uuid not null,
  due_at timestamptz not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'done')),
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (organization_id, assignee_id) references public.organization_memberships(organization_id, user_id)
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid not null,
  property_id uuid not null,
  client_name text not null check (length(btrim(client_name)) between 2 and 160),
  amount numeric(14,2) not null check (amount >= 0),
  status text not null default 'open' check (status in ('open', 'closed')),
  assigned_to uuid not null,
  notes text not null default '' check (length(notes) <= 5000),
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  updated_at timestamptz not null default now(),
  foreign key (organization_id, lead_id) references public.leads(organization_id, id) on delete restrict,
  foreign key (organization_id, property_id) references public.properties(organization_id, id) on delete restrict,
  foreign key (organization_id, assigned_to) references public.organization_memberships(organization_id, user_id)
);

create index properties_organization_id_idx on public.properties(organization_id);
create index contacts_organization_id_idx on public.contacts(organization_id);
create index leads_organization_stage_idx on public.leads(organization_id, stage);
create index viewings_organization_date_idx on public.viewings(organization_id, scheduled_at);
create index tasks_organization_due_idx on public.tasks(organization_id, due_at);
create index deals_organization_status_idx on public.deals(organization_id, status);

create trigger properties_set_updated_at before update on public.properties for each row execute function public.set_updated_at();
create trigger contacts_set_updated_at before update on public.contacts for each row execute function public.set_updated_at();
create trigger leads_set_updated_at before update on public.leads for each row execute function public.set_updated_at();
create trigger viewings_set_updated_at before update on public.viewings for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks for each row execute function public.set_updated_at();
create trigger deals_set_updated_at before update on public.deals for each row execute function public.set_updated_at();

alter table public.properties enable row level security;
alter table public.contacts enable row level security;
alter table public.leads enable row level security;
alter table public.viewings enable row level security;
alter table public.tasks enable row level security;
alter table public.deals enable row level security;

grant select, insert, update, delete on public.properties, public.contacts, public.leads, public.viewings, public.tasks, public.deals to authenticated;

create policy properties_member_access on public.properties for all to authenticated
  using (public.is_active_organization_member(organization_id))
  with check (public.is_active_organization_member(organization_id));
create policy contacts_member_access on public.contacts for all to authenticated
  using (public.is_active_organization_member(organization_id))
  with check (public.is_active_organization_member(organization_id));
create policy leads_member_access on public.leads for all to authenticated
  using (public.is_active_organization_member(organization_id))
  with check (public.is_active_organization_member(organization_id));
create policy viewings_member_access on public.viewings for all to authenticated
  using (public.is_active_organization_member(organization_id))
  with check (public.is_active_organization_member(organization_id));
create policy tasks_member_access on public.tasks for all to authenticated
  using (public.is_active_organization_member(organization_id))
  with check (public.is_active_organization_member(organization_id));
create policy deals_member_access on public.deals for all to authenticated
  using (public.is_active_organization_member(organization_id))
  with check (public.is_active_organization_member(organization_id));
