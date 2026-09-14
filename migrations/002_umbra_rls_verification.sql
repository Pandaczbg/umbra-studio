-- Verification only, never changes persistent data: every operation rolls back.
-- Run after 001 in a disposable/staging Supabase SQL session as postgres.
begin;
insert into auth.users(id,aud,role,email) values
 ('a0000000-0000-4000-8000-000000000001','authenticated','authenticated','umbra-test-a@example.invalid'),
 ('b0000000-0000-4000-8000-000000000002','authenticated','authenticated','umbra-test-b@example.invalid');
insert into public.umbra_profiles(user_id,display_name) values
 ('a0000000-0000-4000-8000-000000000001','A'),('b0000000-0000-4000-8000-000000000002','B');
insert into public.umbra_saved(user_id,item_id,item) values
 ('b0000000-0000-4000-8000-000000000002','project:test','{"id":"project:test","kind":"project","title":"Test","href":"/serije/test"}');
set local role authenticated;
select set_config('request.jwt.claim.sub','a0000000-0000-4000-8000-000000000001',true);
select set_config('request.jwt.claims','{"sub":"a0000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$ declare affected integer; begin
 if (select count(*) from public.umbra_profiles)<>1 then raise exception 'FAIL profile read isolation'; end if;
 if (select count(*) from public.umbra_saved)<>0 then raise exception 'FAIL saved read isolation'; end if;
 update public.umbra_profiles set display_name='intruder' where user_id='b0000000-0000-4000-8000-000000000002';
 get diagnostics affected=row_count; if affected<>0 then raise exception 'FAIL profile update isolation'; end if;
 delete from public.umbra_saved where user_id='b0000000-0000-4000-8000-000000000002';
 get diagnostics affected=row_count; if affected<>0 then raise exception 'FAIL saved delete isolation'; end if;
 begin
 insert into public.umbra_saved(user_id,item_id,item) values('b0000000-0000-4000-8000-000000000002','project:attack','{"id":"project:attack"}');
 raise exception 'FAIL saved insert isolation';
 exception when insufficient_privilege then null;
 end;
end $$;
select public.umbra_delete_own_account();
reset role;
do $$ begin
 if exists(select 1 from auth.users where id='a0000000-0000-4000-8000-000000000001') then raise exception 'FAIL self delete'; end if;
 if not exists(select 1 from auth.users where id='b0000000-0000-4000-8000-000000000002') then raise exception 'FAIL another user deleted'; end if;
 if exists(select 1 from public.umbra_profiles where user_id='a0000000-0000-4000-8000-000000000001') then raise exception 'FAIL profile cascade'; end if;
end $$;
rollback;
