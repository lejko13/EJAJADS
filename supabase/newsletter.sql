-- Newsletter: e-maily z okna „Prihlás sa na newsletter“
-- Spusti raz v Supabase → SQL Editor → New query → Run

create table if not exists public.newsletter (
  id bigint generated always as identity primary key,
  email text not null unique
    check (length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);

alter table public.newsletter enable row level security;

-- návštevníci webu môžu e-mail len PRIDAŤ – čítať, meniť ani mazať nemôžu
grant insert on public.newsletter to anon, authenticated;
revoke select, update, delete on public.newsletter from anon, authenticated;

drop policy if exists "pridat email na newsletter" on public.newsletter;
create policy "pridat email na newsletter"
  on public.newsletter for insert
  to anon, authenticated
  with check (true);
