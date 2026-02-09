-- Create cocktails table
create table if not exists public.cocktails (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  friend_name text not null,
  description text,
  ingredients text[],
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create sports memorabilia table
create table if not exists public.memorabilia (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create visitor photos table
create table if not exists public.visitor_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  visitor_name text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.cocktails enable row level security;
alter table public.memorabilia enable row level security;
alter table public.visitor_photos enable row level security;

-- Public read access for all tables (anyone can view)
create policy "public_read_cocktails" on public.cocktails for select using (true);
create policy "public_read_memorabilia" on public.memorabilia for select using (true);
create policy "public_read_visitor_photos" on public.visitor_photos for select using (true);

-- Anyone can insert visitor photos
create policy "public_insert_visitor_photos" on public.visitor_photos for insert with check (true);

-- Only authenticated users can manage cocktails and memorabilia (for admin)
create policy "auth_insert_cocktails" on public.cocktails for insert with check (auth.uid() is not null);
create policy "auth_update_cocktails" on public.cocktails for update using (auth.uid() is not null);
create policy "auth_delete_cocktails" on public.cocktails for delete using (auth.uid() is not null);

create policy "auth_insert_memorabilia" on public.memorabilia for insert with check (auth.uid() is not null);
create policy "auth_update_memorabilia" on public.memorabilia for update using (auth.uid() is not null);
create policy "auth_delete_memorabilia" on public.memorabilia for delete using (auth.uid() is not null);

create policy "auth_delete_visitor_photos" on public.visitor_photos for delete using (auth.uid() is not null);
