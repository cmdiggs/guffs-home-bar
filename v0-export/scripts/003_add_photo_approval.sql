-- Add approved and comment fields to visitor_photos
alter table public.visitor_photos 
add column if not exists approved boolean default false,
add column if not exists comment text;

-- Update RLS policy to only show approved photos publicly
drop policy if exists "public_read_visitor_photos" on public.visitor_photos;
create policy "public_read_approved_visitor_photos" on public.visitor_photos 
  for select using (approved = true);

-- Allow authenticated users to see all photos (for admin)
create policy "auth_read_all_visitor_photos" on public.visitor_photos
  for select using (auth.uid() is not null);

-- Allow authenticated users to update photos (for approval)
create policy "auth_update_visitor_photos" on public.visitor_photos 
  for update using (auth.uid() is not null);
