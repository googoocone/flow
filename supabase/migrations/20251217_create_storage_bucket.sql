-- Create a new private bucket for company logos
insert into storage.buckets (id, name, public)
values ('company_logos', 'company_logos', true);

-- Policy to allow authenticated users to upload files
create policy "Authenticated users can upload logos"
on storage.objects for insert
with check (
  bucket_id = 'company_logos' and
  auth.role() = 'authenticated'
);

-- Policy to allow everyone to view logos (since they are for public profiles)
create policy "Anyone can view logos"
on storage.objects for select
using ( bucket_id = 'company_logos' );

-- Policy to allow users to update/delete their own files (optional, but good for cleanup)
create policy "Users can update their own logos"
on storage.objects for update
using ( bucket_id = 'company_logos' and auth.uid() = owner )
with check ( bucket_id = 'company_logos' and auth.uid() = owner );

create policy "Users can delete their own logos"
on storage.objects for delete
using ( bucket_id = 'company_logos' and auth.uid() = owner );
