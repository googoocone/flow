-- Create success_cases table
create table if not exists success_cases (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  contents text,
  tags text[], -- Array of tags for matching (e.g., ['주식', '20대', '직장인'])
  metadata jsonb, -- Flexible metadata for UI (debt_amount, reduced_amount, etc.)
  created_at timestamptz default now()
);

-- Enable RLS
alter table success_cases enable row level security;

-- Policies
-- Everyone can read success cases (needed for generating reports)
create policy "Enable read access for all users"
on success_cases for select
using (true);

-- Only admins/service role can insert/update (for now, or maybe authenticated users)
create policy "Enable insert for authenticated users only"
on success_cases for insert
with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only"
on success_cases for update
using (auth.role() = 'authenticated');

-- Seed Data (Initial Examples)

-- Case 1: 30s Stock Investment Failure
insert into success_cases (title, contents, tags, metadata)
values (
  '30대 직장인 주식 투자 실패 탕감 사례',
  '무리한 주식 투자로 인해 감당할 수 없는 채무가 발생했으나, 개인회생을 통해 원금의 70%를 탕감받고 새출발한 사례입니다.',
  ARRAY['주식_투자_실패', '투자_실패', '30대', '직장인'],
  '{
    "total_debt": 85000000,
    "reduced_debt": 25000000,
    "monthly_payment": 690000,
    "period": 36,
    "cancellation_rate": 70
  }'
);

-- Case 2: Living Expenses (Daily Worker)
insert into success_cases (title, contents, tags, metadata)
values (
  '일용직 근로자 생활비 채무 해결 사례',
  '불규칙한 소득으로 인해 생활비를 대출로 충당하다 빚이 늘어났으나, 주거비와 최저생계비를 인정받아 생활 안정을 되찾았습니다.',
  ARRAY['생활비_부족', '일용직', '40대', '저소득'],
  '{
    "total_debt": 45000000,
    "reduced_debt": 15000000,
    "monthly_payment": 350000,
    "period": 36,
    "cancellation_rate": 66
  }'
);

-- Case 3: Gambling Addiction
insert into success_cases (title, contents, tags, metadata)
values (
  '20대 도박 채무 개인회생 성공 사례',
  '온라인 도박 중독으로 막대한 채무를 졌으나, 도박 치료 의지와 성실한 변제 계획을 소명하여 인가 결정을 받은 사례입니다.',
  ARRAY['도박', '20대', '대학생', '알바'],
  '{
    "total_debt": 60000000,
    "reduced_debt": 40000000,
    "monthly_payment": 550000,
    "period": 60,
    "cancellation_rate": 33
  }'
);

-- Case 4: Scam Victim (Jeonse)
insert into success_cases (title, contents, tags, metadata)
values (
  '전세 사기 피해자 구제 사례',
  '전세 사기로 인해 보증금을 잃고 대출금 상환 압박에 시달렸으나, 특별법 및 회생 제도를 통해 채무 조정을 받았습니다.',
  ARRAY['사기_피해', '전세_사기', '30대', '신혼부부'],
  '{
    "total_debt": 200000000,
    "reduced_debt": 120000000,
    "monthly_payment": 1500000,
    "period": 36,
    "cancellation_rate": 40
  }'
);
