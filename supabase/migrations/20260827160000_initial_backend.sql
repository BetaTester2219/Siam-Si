create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_language text not null default 'th' check (preferred_language in ('th', 'en', 'zh')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, preferred_language)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'preferred_language', ''), 'th')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_th text not null,
  name_en text not null,
  name_zh text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.temples (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_th text not null,
  name_en text not null,
  name_zh text,
  sacred_name_th text,
  sacred_name_en text,
  sacred_name_zh text,
  description_th text,
  description_en text,
  description_zh text,
  province_th text,
  province_en text,
  location_text text,
  hero_image_url text,
  thumbnail_image_url text,
  source_url text,
  source_name text,
  source_reference text,
  fortune_source_status text not null default 'reference_only',
  content_status text not null default 'reference_only' check (content_status in ('reference_only', 'draft', 'verified', 'licensed', 'published')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.temple_categories (
  temple_id uuid not null references public.temples(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (temple_id, category_id)
);

create table public.fortune_sets (
  id uuid primary key default gen_random_uuid(),
  temple_id uuid not null references public.temples(id) on delete restrict,
  name text not null,
  version text not null default 'v1',
  total_fortunes integer not null check (total_fortunes > 0),
  source_url text,
  source_name text,
  source_note text,
  content_status text not null default 'reference_only' check (content_status in ('reference_only', 'draft', 'verified', 'licensed', 'published')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fortunes (
  id uuid primary key default gen_random_uuid(),
  fortune_set_id uuid not null references public.fortune_sets(id) on delete cascade,
  number integer not null check (number > 0),
  original_text_th text not null,
  interpretation_th text,
  original_text_en text,
  interpretation_en text,
  original_text_zh text,
  interpretation_zh text,
  source_url text,
  source_reference text,
  content_status text not null default 'reference_only' check (content_status in ('reference_only', 'draft', 'verified', 'licensed', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (fortune_set_id, number)
);

create table public.fortune_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  temple_id uuid not null references public.temples(id) on delete restrict,
  fortune_set_id uuid not null references public.fortune_sets(id) on delete restrict,
  fortune_id uuid not null references public.fortunes(id) on delete restrict,
  fortune_number integer not null check (fortune_number > 0),
  language text not null default 'th' check (language in ('th', 'en', 'zh')),
  created_at timestamptz not null default now()
);

create table public.nfc_cards (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  zodiac text,
  edition text,
  temple_id uuid references public.temples(id) on delete set null,
  owner_id uuid references public.profiles(id) on delete set null,
  is_active boolean not null default true,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger temples_set_updated_at before update on public.temples for each row execute function public.set_updated_at();
create trigger fortune_sets_set_updated_at before update on public.fortune_sets for each row execute function public.set_updated_at();
create trigger fortunes_set_updated_at before update on public.fortunes for each row execute function public.set_updated_at();
create trigger nfc_cards_set_updated_at before update on public.nfc_cards for each row execute function public.set_updated_at();

create index temples_slug_idx on public.temples (slug);
create index temples_active_idx on public.temples (is_active);
create index categories_slug_idx on public.categories (slug);
create index fortune_sets_temple_id_idx on public.fortune_sets (temple_id);
create index fortune_sets_active_idx on public.fortune_sets (temple_id, is_active);
create index fortunes_set_number_idx on public.fortunes (fortune_set_id, number);
create index fortune_history_user_created_idx on public.fortune_history (user_id, created_at desc);
create index fortune_history_temple_idx on public.fortune_history (temple_id);
create index nfc_cards_token_idx on public.nfc_cards (token);
create index nfc_cards_owner_idx on public.nfc_cards (owner_id);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.temples enable row level security;
alter table public.temple_categories enable row level security;
alter table public.fortune_sets enable row level security;
alter table public.fortunes enable row level security;
alter table public.fortune_history enable row level security;
alter table public.nfc_cards enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "categories_read_active"
  on public.categories for select
  to anon, authenticated
  using (is_active = true);

create policy "temples_read_active"
  on public.temples for select
  to anon, authenticated
  using (is_active = true);

create policy "temple_categories_read_active"
  on public.temple_categories for select
  to anon, authenticated
  using (
    exists (select 1 from public.temples where temples.id = temple_categories.temple_id and temples.is_active = true)
    and exists (select 1 from public.categories where categories.id = temple_categories.category_id and categories.is_active = true)
  );

create policy "fortune_sets_public_published"
  on public.fortune_sets for select
  to anon, authenticated
  using (is_active = true and content_status in ('verified', 'licensed', 'published'));

create policy "fortunes_public_published"
  on public.fortunes for select
  to anon, authenticated
  using (content_status in ('verified', 'licensed', 'published'));

create policy "fortune_history_select_own"
  on public.fortune_history for select
  to authenticated
  using (user_id = auth.uid());

create policy "fortune_history_insert_own"
  on public.fortune_history for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "nfc_cards_read_own_or_unclaimed"
  on public.nfc_cards for select
  to authenticated
  using (owner_id = auth.uid() or owner_id is null);

insert into storage.buckets (id, name, public)
values ('temple-images', 'temple-images', true)
on conflict (id) do nothing;
