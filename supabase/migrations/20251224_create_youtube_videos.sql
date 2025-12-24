-- Create youtube_videos table
create table if not exists youtube_videos (
  id uuid default gen_random_uuid() primary key,
  firm_id uuid references law_firms(id) on delete cascade not null,
  title text not null,
  video_url text not null,
  thumbnail_url text,
  tags text[] default array[]::text[],
  published_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add RLS policies
alter table youtube_videos enable row level security;

create policy "Enable read access for all users"
on youtube_videos for select
using (true);

create policy "Enable insert for authenticated users only"
on youtube_videos for insert
with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only"
on youtube_videos for update
using (auth.role() = 'authenticated');

-- Create index on firm_id for faster filtering
create index idx_youtube_videos_firm_id on youtube_videos(firm_id);
-- Create index on tags for faster matching
create index idx_youtube_videos_tags on youtube_videos using gin(tags);
