-- Create law_firms table
create table if not exists law_firms (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamptz default now()
);

-- Enable RLS
alter table law_firms enable row level security;

-- Policies
create policy "Enable read access for all users" on law_firms for select using (true);
-- Only allow service_role or manual SQL to insert/update/delete for now to enforce "admin only" management style
-- create policy "Enable insert for authenticated users" ... (Skipped for stricter control)

-- Seed initial data
insert into law_firms (name) values 
  ('우인'), 
  ('에이파트')
on conflict (name) do nothing;
