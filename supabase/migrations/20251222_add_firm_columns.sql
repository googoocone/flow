-- Add firm column to profiles to track counselor's affiliation
alter table profiles
add column firm text;

-- Add firm column to success_cases to track which firm owns the case
alter table success_cases
add column firm text;

-- Optional: Index on firm for faster filtering
create index idx_success_cases_firm on success_cases(firm);
