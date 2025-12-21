-- 1. Ensure firms exist
insert into law_firms (name) values ('법률사무소 우인'), ('법무법인 에이파트')
on conflict (name) do nothing;

-- 2. Migrate existing success_cases firm text to firm_id
update success_cases
set firm_id = law_firms.id
from law_firms
where success_cases.firm = law_firms.name;

-- 3. Randomly assign firms to all success_cases
-- This ensures a mix of '법률사무소 우인' and '법무법인 에이파트'
update success_cases
set firm_id = (
  case 
    when random() < 0.5 then (select id from law_firms where name = '법률사무소 우인')
    else (select id from law_firms where name = '법무법인 에이파트')
  end
);

-- 4. Set URL for demo purposes (optional)
update success_cases
set url = 'https://law-firm-link.com/case/' || id::text
where url is null;
