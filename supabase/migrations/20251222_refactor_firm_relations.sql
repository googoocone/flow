-- 1. Add firm_id column to profiles
alter table profiles
add column firm_id uuid references law_firms(id);

-- 2. Add firm_id and url columns to success_cases
alter table success_cases
add column firm_id uuid references law_firms(id),
add column url text;

-- 3. Create indices for performance
create index idx_profiles_firm_id on profiles(firm_id);
create index idx_success_cases_firm_id on success_cases(firm_id);

-- Note: We are keeping the old 'firm' column temporarily or dropping it depending on user preference. 
-- For strictness, let's migrate data then drop it. But doing that in SQL without knowing IDs is hard if data is dirty.
-- Assuming user will run the new seed script to fix data.

-- 4. Drop old text columns (Warning: Data loss if not migrated)
-- alter table profiles drop column firm;
-- alter table success_cases drop column firm;
