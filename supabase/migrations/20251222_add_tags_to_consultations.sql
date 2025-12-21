-- Add tags column to consultations table
alter table consultations
add column tags text[];

-- Optional: Add index for faster filtering by tags
create index idx_consultations_tags on consultations using gin(tags);
