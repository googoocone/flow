-- Update success_cases with new metadata structure including age, job, and cause
-- Based on previous migration data, we map existing tags/content to new fields.

-- 1. 코인 Investment Failure (20s, 30s, 40s)
UPDATE success_cases
SET metadata = metadata || '{"age": "20대", "job": "급여소득", "cause": ["코인,주식"]}'::jsonb
WHERE tags @> ARRAY['코인_투자_실패', '20대'];

UPDATE success_cases
SET metadata = metadata || '{"age": "30대", "job": "급여소득", "cause": ["코인,주식"]}'::jsonb
WHERE tags @> ARRAY['코인_투자_실패', '30대'];

UPDATE success_cases
SET metadata = metadata || '{"age": "40대", "job": "영업소득", "cause": ["코인,주식"]}'::jsonb
WHERE tags @> ARRAY['코인_투자_실패', '40대'];

-- 2. Stock Investment Failure
UPDATE success_cases
SET metadata = metadata || '{"age": "30대", "job": "급여소득", "cause": ["코인,주식"]}'::jsonb
WHERE tags @> ARRAY['주식_투자_실패', '30대'];

UPDATE success_cases
SET metadata = metadata || '{"age": "50대", "job": "기타", "cause": ["코인,주식", "투자실패"]}'::jsonb
WHERE tags @> ARRAY['주식_투자_실패', '해외선물'];

UPDATE success_cases
SET metadata = metadata || '{"age": "20대", "job": "급여소득", "cause": ["코인,주식"]}'::jsonb
WHERE tags @> ARRAY['주식_투자_실패', '20대'];

-- 3. Gambling
UPDATE success_cases
SET metadata = metadata || '{"age": "20대", "job": "아르바이트", "cause": ["도박"]}'::jsonb
WHERE tags @> ARRAY['도박', '20대'];

UPDATE success_cases
SET metadata = metadata || '{"age": "30대", "job": "급여소득", "cause": ["도박"]}'::jsonb
WHERE tags @> ARRAY['도박', '30대'];

UPDATE success_cases
SET metadata = metadata || '{"age": "40대", "job": "영업소득", "cause": ["도박", "코인,주식"]}'::jsonb
WHERE tags @> ARRAY['도박', '40대'];

-- 4. Business Failure
UPDATE success_cases
SET metadata = metadata || '{"age": "40대", "job": "영업소득", "cause": ["사업운영실패"]}'::jsonb
WHERE tags @> ARRAY['사업_실패', '자영업'];

UPDATE success_cases
SET metadata = metadata || '{"age": "50대", "job": "영업소득", "cause": ["사업운영실패"]}'::jsonb
WHERE tags @> ARRAY['사업_실패', '연대보증'];

UPDATE success_cases
SET metadata = metadata || '{"age": "20대", "job": "영업소득", "cause": ["사업운영실패"]}'::jsonb
WHERE tags @> ARRAY['사업_실패', '청년창업'];

-- 5. Private Loan
UPDATE success_cases
SET metadata = metadata || '{"age": "40대", "job": "영업소득", "cause": ["사채"]}'::jsonb
WHERE tags @> ARRAY['사채', '고금리'];

UPDATE success_cases
SET metadata = metadata || '{"age": "30대", "job": "급여소득", "cause": ["사채", "개인채무"]}'::jsonb
WHERE tags @> ARRAY['사채', '추심방어'];

UPDATE success_cases
SET metadata = metadata || '{"age": "40대", "job": "기타", "cause": ["사채", "생활비"]}'::jsonb
WHERE tags @> ARRAY['사채', '대부업'];

-- 6. Fraud
UPDATE success_cases
SET metadata = metadata || '{"age": "60대", "job": "무직", "cause": ["사기피해"]}'::jsonb
WHERE tags @> ARRAY['사기_피해', '보이스피싱'];

UPDATE success_cases
SET metadata = metadata || '{"age": "30대", "job": "급여소득", "cause": ["사기피해"]}'::jsonb
WHERE tags @> ARRAY['사기_피해', '전세사기'];

UPDATE success_cases
SET metadata = metadata || '{"age": "40대", "job": "주부", "cause": ["사기피해", "투자실패"]}'::jsonb
WHERE tags @> ARRAY['사기_피해', '투자사기'];

-- 7. Personal Debt
UPDATE success_cases
SET metadata = metadata || '{"age": "50대", "job": "영업소득", "cause": ["개인채무"]}'::jsonb
WHERE tags @> ARRAY['개인_채무', '지인빚'];

UPDATE success_cases
SET metadata = metadata || '{"age": "60대", "job": "무직", "cause": ["개인채무"]}'::jsonb
WHERE tags @> ARRAY['개인_채무', '계모임'];

UPDATE success_cases
SET metadata = metadata || '{"age": "40대", "job": "급여소득", "cause": ["개인채무", "생활비"]}'::jsonb
WHERE tags @> ARRAY['개인_채무', '이혼'];

-- 8. Family Debt
UPDATE success_cases
SET metadata = metadata || '{"age": "30대", "job": "급여소득", "cause": ["병원비"]}'::jsonb
WHERE tags @> ARRAY['가족_빚', '병원비'];

UPDATE success_cases
SET metadata = metadata || '{"age": "40대", "job": "주부", "cause": ["개인채무"]}'::jsonb
WHERE tags @> ARRAY['가족_빚', '보증'];

UPDATE success_cases
SET metadata = metadata || '{"age": "20대", "job": "급여소득", "cause": ["개인채무"]}'::jsonb
WHERE tags @> ARRAY['가족_빚', '명의대여'];

-- 9. Living Expenses
UPDATE success_cases
SET metadata = metadata || '{"age": "30대", "job": "아르바이트", "cause": ["생활비"]}'::jsonb
WHERE tags @> ARRAY['생활비_부족', '저소득'];

UPDATE success_cases
SET metadata = metadata || '{"age": "40대", "job": "무직", "cause": ["생활비"]}'::jsonb
WHERE tags @> ARRAY['생활비_부족', '실직'];

UPDATE success_cases
SET metadata = metadata || '{"age": "40대", "job": "급여소득", "cause": ["생활비"]}'::jsonb
WHERE tags @> ARRAY['생활비_부족', '다자녀'];

-- 10. Medical Expenses
UPDATE success_cases
SET metadata = metadata || '{"age": "30대", "job": "무직", "cause": ["병원비"]}'::jsonb
WHERE tags @> ARRAY['병원비_부족', '희귀병'];

UPDATE success_cases
SET metadata = metadata || '{"age": "40대", "job": "급여소득", "cause": ["병원비", "생활비"]}'::jsonb
WHERE tags @> ARRAY['병원비_부족', '수술비'];

UPDATE success_cases
SET metadata = metadata || '{"age": "50대", "job": "일용직", "cause": ["병원비"]}'::jsonb
WHERE tags @> ARRAY['병원비_부족', '교통사고'];
