-- Apply once to the selected Supabase project; safe to repeat this V10 migration.
begin;
create table if not exists public.umbra_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check (length(display_name)<=60),
 created_at timestamptz not null default now()
);
create table if not exists public.umbra_saved (
 user_id uuid not null references auth.users(id) on delete cascade,
 item_id text not null check (item_id ~ '^[a-zA-Z0-9:_-]{1,120}$'),
 item jsonb not null check (jsonb_typeof(item)='object' and octet_length(item::text)<2000 and item->>'id'=item_id),
 created_at timestamptz not null default now(), primary key(user_id,item_id)
);
alter table public.umbra_profiles enable row level security;
alter table public.umbra_saved enable row level security;
revoke all on public.umbra_profiles, public.umbra_saved from anon, authenticated;
grant select,insert,update,delete on public.umbra_profiles, public.umbra_saved to authenticated;
drop policy if exists own_profile on public.umbra_profiles;
create policy own_profile on public.umbra_profiles to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists own_saved on public.umbra_saved;
create policy own_saved on public.umbra_saved to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create or replace function public.umbra_saved_limit() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 perform pg_advisory_xact_lock(hashtextextended(new.user_id::text,0));
 if not exists(select 1 from public.umbra_saved where user_id=new.user_id and item_id=new.item_id) and (select count(*) from public.umbra_saved where user_id=new.user_id)>=200 then raise exception 'saved_limit'; end if;
 return new;
end $$;
drop trigger if exists umbra_saved_limit on public.umbra_saved;
create trigger umbra_saved_limit before insert on public.umbra_saved for each row execute function public.umbra_saved_limit();
-- No user-supplied identifier: this function can remove only its authenticated caller.
create or replace function public.umbra_delete_own_account() returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'authentication_required'; end if;
 delete from auth.users where id=auth.uid();
end $$;
revoke all on function public.umbra_delete_own_account() from public,anon;
grant execute on function public.umbra_delete_own_account() to authenticated;
commit;
