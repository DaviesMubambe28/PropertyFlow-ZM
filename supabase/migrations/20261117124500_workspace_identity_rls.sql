create function public.is_active_organization_member(p_organization_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.organization_memberships
    where organization_id = p_organization_id and user_id = auth.uid() and status = 'active'
  );
$$;

create function public.is_active_organization_admin(p_organization_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.organization_memberships
    where organization_id = p_organization_id and user_id = auth.uid()
      and role = 'admin' and status = 'active'
  );
$$;

revoke all on function public.is_active_organization_member(uuid) from public, anon;
revoke all on function public.is_active_organization_admin(uuid) from public, anon;
grant execute on function public.is_active_organization_member(uuid) to authenticated;
grant execute on function public.is_active_organization_admin(uuid) to authenticated;

grant select on public.profiles, public.organizations, public.organization_memberships, public.organization_invitations to authenticated;
grant update on public.organizations to authenticated;
grant insert, update, delete on public.organization_memberships, public.organization_invitations to authenticated;

create policy profiles_member_read on public.profiles for select to authenticated using (
  id = auth.uid() or exists (
    select 1 from public.organization_memberships mine
    join public.organization_memberships theirs on theirs.organization_id = mine.organization_id
    where mine.user_id = auth.uid() and mine.status = 'active' and theirs.status = 'active' and theirs.user_id = profiles.id
  )
);

create policy organizations_member_read on public.organizations for select to authenticated
using (public.is_active_organization_member(id));
create policy organizations_admin_update on public.organizations for update to authenticated
using (public.is_active_organization_admin(id)) with check (public.is_active_organization_admin(id));

create policy memberships_member_read on public.organization_memberships for select to authenticated
using (public.is_active_organization_member(organization_id));
create policy memberships_admin_insert on public.organization_memberships for insert to authenticated
with check (public.is_active_organization_admin(organization_id));
create policy memberships_admin_update on public.organization_memberships for update to authenticated
using (public.is_active_organization_admin(organization_id))
with check (public.is_active_organization_admin(organization_id));
create policy memberships_admin_delete on public.organization_memberships for delete to authenticated
using (public.is_active_organization_admin(organization_id));

create policy invitations_admin_read on public.organization_invitations for select to authenticated
using (public.is_active_organization_admin(organization_id));
create policy invitations_admin_insert on public.organization_invitations for insert to authenticated
with check (public.is_active_organization_admin(organization_id) and invited_by = auth.uid());
create policy invitations_admin_update on public.organization_invitations for update to authenticated
using (public.is_active_organization_admin(organization_id))
with check (public.is_active_organization_admin(organization_id));
create policy invitations_admin_delete on public.organization_invitations for delete to authenticated
using (public.is_active_organization_admin(organization_id));

create function public.protect_last_active_admin() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.role = 'admin' and old.status = 'active'
    and (tg_op = 'DELETE' or new.role <> 'admin' or new.status <> 'active')
    and not exists (
      select 1 from public.organization_memberships
      where organization_id = old.organization_id and role = 'admin' and status = 'active'
        and user_id <> old.user_id
    ) then
    raise exception 'An organization must retain an active administrator' using errcode = 'P0001';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function public.protect_last_active_admin() from public, anon, authenticated;
create trigger organization_memberships_protect_last_admin
before update or delete on public.organization_memberships
for each row execute function public.protect_last_active_admin();
