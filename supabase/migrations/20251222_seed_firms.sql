-- Assign first 15 cases to '우인'
with cases as (
    select id from success_cases order by created_at desc limit 15
)
update success_cases
set firm = '우인'
where id in (select id from cases);

-- Assign the rest to '에이파트'
update success_cases
set firm = '에이파트'
where firm is null;

-- Check results
-- select firm, count(*) from success_cases group by firm;
