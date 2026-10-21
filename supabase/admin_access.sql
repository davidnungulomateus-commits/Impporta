-- Execute once in the Supabase SQL Editor after help@impporta.com exists in Auth.
-- This changes only the matching profile and is safe to run repeatedly.
update public.profiles
set role = 'admin', updated_at = now()
where id = (select id from auth.users where lower(email) = 'help@impporta.com');

-- Verify the promotion:
select p.id, u.email, p.role
from public.profiles p
join auth.users u on u.id = p.id
where lower(u.email) = 'help@impporta.com';
