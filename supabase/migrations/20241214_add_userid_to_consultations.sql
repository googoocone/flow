-- Add user_id to consultations table to link with auth.users
alter table consultations
add column user_id uuid references auth.users(id);

-- Optional: Update RLS if needed (e.g., only allow users to see their own consultations)
-- create policy "Users can view own consultations" on consultations
--   for select using (auth.uid() = user_id);
