-- Create storage bucket for photos
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Allow public access to read photos
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'photos' );

-- Allow authenticated users to upload photos
create policy "Authenticated users can upload"
on storage.objects for insert
with check ( bucket_id = 'photos' );

-- Allow authenticated users to delete photos
create policy "Authenticated users can delete"
on storage.objects for delete
using ( bucket_id = 'photos' and auth.uid() is not null );
