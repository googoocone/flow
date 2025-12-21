
const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role for delete

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase env vars (need service role key for truncate)');
    // Fallback to anon key if service role missing, but delete might fail due to RLS
    if (!supabaseKey) process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey || supabaseKey);

const cases = [
    // 1. 코인 투자 실패
    { title: '20대 사회초년생 코인 투자 실패 극복 사례', contents: '무리한 레버리지 사용으로 발생한 코인 채무, 개인회생을 통해 원금 80% 탕감받고 성실히 상환 중입니다.', tags: ['코인_투자_실패', '20대', '사회초년생'], metadata: { total_debt: 90000000, reduced_debt: 18000000, monthly_payment: 500000, period: 36, cancellation_rate: 80 } },
    { title: '30대 직장인 가상화폐 손실 만회 사례', contents: '급락장에서 발생한 거액의 손실을 감당하지 못해 신청, 금지명령으로 추심을 막고 인가 결정.', tags: ['코인_투자_실패', '30대', '직장인'], metadata: { total_debt: 120000000, reduced_debt: 40000000, monthly_payment: 1100000, period: 36, cancellation_rate: 66 } },
    { title: '40대 가장의 코인 대출 채무 해결', contents: '노후 자금 마련을 위해 시작했다가 대출까지 끌어다 쓴 사례, 가족을 위해 회생을 결심하고 재기 성공.', tags: ['코인_투자_실패', '40대', '가장'], metadata: { total_debt: 150000000, reduced_debt: 60000000, monthly_payment: 1600000, period: 36, cancellation_rate: 60 } },

    // 2. 주식 투자 실패
    { title: '주식 미수 거래로 인한 채무 개인회생 성공', contents: '미수 거래 실패로 발생한 증권사 채무와 대출, 원금의 75%를 탕감받고 새출발하였습니다.', tags: ['주식_투자_실패', '30대', '미수거래'], metadata: { total_debt: 80000000, reduced_debt: 20000000, monthly_payment: 550000, period: 36, cancellation_rate: 75 } },
    { title: '해외 선물 옵션 투자 실패 탕감 사례', contents: '높은 변동성으로 인해 순식간에 불어난 빚, 도박성이 아님을 소명하여 기각 없이 개시 결정.', tags: ['주식_투자_실패', '해외선물', '50대'], metadata: { total_debt: 200000000, reduced_debt: 80000000, monthly_payment: 2200000, period: 36, cancellation_rate: 60 } },
    { title: '재테크 목적 주식 투자 실패 해결', contents: '내 집 마련을 위해 시작한 주식 투자가 빚으로 돌아왔으나, 성실한 변제 계획으로 인가받은 사례.', tags: ['주식_투자_실패', '20대', '신혼부부'], metadata: { total_debt: 70000000, reduced_debt: 28000000, monthly_payment: 770000, period: 36, cancellation_rate: 60 } },

    // 3. 도박
    { title: '스포츠 토토 도박 채무 개인회생 사례', contents: '스포츠 토토 중독으로 인한 채무, 도박 치료 상담 병행을 조건으로 인가 결정.', tags: ['도박', '20대', '스포츠토토'], metadata: { total_debt: 50000000, reduced_debt: 35000000, monthly_payment: 580000, period: 60, cancellation_rate: 30 } },
    { title: '온라인 카지노 도박 빚 청산 성공', contents: '호기심에 시작한 온라인 도박이 겉잡을 수 없이 커졌으나, 반성문과 치료 의지로 선처받은 사례.', tags: ['도박', '30대', '온라인도박'], metadata: { total_debt: 90000000, reduced_debt: 54000000, monthly_payment: 900000, period: 60, cancellation_rate: 40 } },
    { title: '주식으로 시작해 도박으로 이어진 채무 해결', contents: '손실 만회를 위해 도박에 손을 댔다가 빚이 폭증했으나, 회생을 통해 단절하고 재기.', tags: ['도박', '40대', '복합원인'], metadata: { total_debt: 110000000, reduced_debt: 66000000, monthly_payment: 1100000, period: 60, cancellation_rate: 40 } },

    // 4. 사업 실패
    { title: '자영업 폐업 후 남은 빚 개인회생 사례', contents: '코로나19 여파로 식당 폐업 후 남은 대출금과 거래처 미수금, 회생을 통해 정리하고 재취업.', tags: ['사업_실패', '자영업', '폐업'], metadata: { total_debt: 180000000, reduced_debt: 36000000, monthly_payment: 1000000, period: 36, cancellation_rate: 80 } },
    { title: '법인 대표 연대보증 채무 해결', contents: '사업 실패로 인한 법인 연대보증 채무, 개인회생을 통해 감당 가능한 수준으로 조정.', tags: ['사업_실패', '연대보증', '50대'], metadata: { total_debt: 500000000, reduced_debt: 60000000, monthly_payment: 1660000, period: 36, cancellation_rate: 88 } },
    { title: '청년 창업 실패 후 재기 성공 사례', contents: '야심차게 시작한 스타트업 실패, 청년 특례를 통해 신속하게 채무를 정리하고 개발자로 취업.', tags: ['사업_실패', '청년창업', '20대'], metadata: { total_debt: 60000000, reduced_debt: 12000000, monthly_payment: 330000, period: 36, cancellation_rate: 80 } },

    // 5. 사채
    { title: '고금리 불법 사채 빚 개인회생 해결', contents: '급전이 필요해 쓴 일수와 사채, 살인적인 이자에서 벗어나 법적 보호를 받으며 원금만 변제 중.', tags: ['사채', '고금리', '일수'], metadata: { total_debt: 40000000, reduced_debt: 40000000, monthly_payment: 1110000, period: 36, cancellation_rate: 0 } },
    { title: '사채업자 추심 방어 및 채무 조정', contents: '밤낮 없는 불법 추심에 시달리다 금지명령으로 보호받고, 법원 인가로 합법적 채무 탕감.', tags: ['사채', '추심방어', '30대'], metadata: { total_debt: 55000000, reduced_debt: 30000000, monthly_payment: 830000, period: 36, cancellation_rate: 45 } },
    { title: '대부업체 고금리 대출 통합 정리', contents: '여러 대부업체에 흩어진 고금리 대출을 개인회생으로 통합하여 이자 전액 탕감.', tags: ['사채', '대부업', '다중채무'], metadata: { total_debt: 70000000, reduced_debt: 35000000, monthly_payment: 970000, period: 36, cancellation_rate: 50 } },

    // 6. 사기 피해
    { title: '보이스피싱 대출 피해 구제 사례', contents: '보이스피싱으로 인해 내 명의로 대출이 실행되었으나, 피해 사실을 소명하여 채무 조정 성공.', tags: ['사기_피해', '보이스피싱', '60대'], metadata: { total_debt: 30000000, reduced_debt: 10000000, monthly_payment: 270000, period: 36, cancellation_rate: 66 } },
    { title: '전세 사기 피해자 보증금 대출 면책', contents: '전세 사기로 보증금을 날리고 대출 빚만 남았으나, 개인회생을 통해 빚의 늪에서 탈출.', tags: ['사기_피해', '전세사기', '30대'], metadata: { total_debt: 200000000, reduced_debt: 100000000, monthly_payment: 2770000, period: 36, cancellation_rate: 50 } },
    { title: '다단계 투자 사기 피해 채무 해결', contents: '수익 보장이라는 말에 속아 대출받아 투자했으나 사기였음이 밝혀져 회생 신청, 성실 상환 중.', tags: ['사기_피해', '투자사기', '40대'], metadata: { total_debt: 80000000, reduced_debt: 30000000, monthly_payment: 830000, period: 36, cancellation_rate: 62 } },

    // 7. 개인 채무
    { title: '지인에게 빌린 돈 개인회생 포함 사례', contents: '가까운 지인들에게 빌린 돈도 채권자 목록에 포함하여, 관계 단절 없이 법적으로 공평하게 변제.', tags: ['개인_채무', '지인빚', '50대'], metadata: { total_debt: 60000000, reduced_debt: 60000000, monthly_payment: 1660000, period: 36, cancellation_rate: 0 } },
    { title: '계 모임 파투로 인한 개인 채무 해결', contents: '계주 도주로 인해 떠안은 개인 빚들, 개인회생을 통해 법적 절차대로 해결.', tags: ['개인_채무', '계모임', '60대'], metadata: { total_debt: 40000000, reduced_debt: 20000000, monthly_payment: 550000, period: 36, cancellation_rate: 50 } },
    { title: '이혼 위자료 및 양육비 채무 조정', contents: '이혼 과정에서 발생한 각종 비용과 개인 채무를 개인회생으로 통합하여 정리.', tags: ['개인_채무', '이혼', '40대'], metadata: { total_debt: 50000000, reduced_debt: 25000000, monthly_payment: 690000, period: 36, cancellation_rate: 50 } },

    // 8. 가족 빚
    { title: '부모님 병원비 대납으로 인한 채무 해결', contents: '부모님 수술비와 병원비를 감당하다 빚이 늘었으나, 효심과 불가피한 상황을 인정받아 탕감.', tags: ['가족_빚', '병원비', '효도'], metadata: { total_debt: 70000000, reduced_debt: 20000000, monthly_payment: 550000, period: 36, cancellation_rate: 71 } },
    { title: '배우자의 사업 실패 보증 채무', contents: '배우자 사업 자금 보증을 섰다가 빚더미에 앉았으나, 주부 개인회생으로 해결.', tags: ['가족_빚', '보증', '주부'], metadata: { total_debt: 100000000, reduced_debt: 30000000, monthly_payment: 830000, period: 36, cancellation_rate: 70 } },
    { title: '형제의 빚을 떠안은 사례 구제', contents: '형제의 대출에 명의를 빌려줬다 발생한 채무, 명의 대여 사실은 인정하되 성실 상환으로 면책 도모.', tags: ['가족_빚', '명의대여', '20대'], metadata: { total_debt: 45000000, reduced_debt: 15000000, monthly_payment: 410000, period: 36, cancellation_rate: 66 } },

    // 9. 생활비 부족
    { title: '소득 부족으로 인한 생활비 대출 해결', contents: '월급만으로 생활이 안 되어 카드깡과 대출을 반복하다 신청, 최저생계비 보장받으며 빚 청산 중.', tags: ['생활비_부족', '저소득', '30대'], metadata: { total_debt: 50000000, reduced_debt: 15000000, monthly_payment: 410000, period: 36, cancellation_rate: 70 } },
    { title: '실직 기간 생활비 채무 개인회생', contents: '갑작스러운 실직으로 생활비를 대출로 충당, 재취업 후 개인회생을 통해 안정적인 삶 회복.', tags: ['생활비_부족', '실직', '40대'], metadata: { total_debt: 35000000, reduced_debt: 10000000, monthly_payment: 270000, period: 36, cancellation_rate: 71 } },
    { title: '다자녀 가구 생활비난 해결 사례', contents: '자녀 셋을 키우며 부족한 생활비를 메꾸다 빚이 생겼으나, 부양가족 생계비를 넉넉히 인정받아 탕감 성공.', tags: ['생활비_부족', '다자녀', '40대'], metadata: { total_debt: 85000000, reduced_debt: 17000000, monthly_payment: 470000, period: 36, cancellation_rate: 80 } },

    // 10. 병원비 부족
    { title: '본인 희귀병 치료비 채무 탕감', contents: '희귀 난치병 치료를 위해 고액의 대출을 받았으나 갚을 길이 없어 회생 신청, 치료비 제외 생계비 인정.', tags: ['병원비_부족', '희귀병', '30대'], metadata: { total_debt: 60000000, reduced_debt: 12000000, monthly_payment: 330000, period: 36, cancellation_rate: 80 } },
    { title: '가족 수술비로 인한 카드 빚 해결', contents: '가족의 긴급 수술비 마련을 위해 여러 개의 카드를 썼으나 연체 위기, 회생으로 이자 전액 탕감.', tags: ['병원비_부족', '수술비', '카드빚'], metadata: { total_debt: 40000000, reduced_debt: 20000000, monthly_payment: 550000, period: 36, cancellation_rate: 50 } },
    { title: '교통사고 후유증 치료비 채무 조정', contents: '교통사고 후 근로 능력이 떨어져 치료비와 생활비를 감당 못했으나, 법원에서 사정 참작하여 개시 결정.', tags: ['병원비_부족', '교통사고', '50대'], metadata: { total_debt: 55000000, reduced_debt: 15000000, monthly_payment: 410000, period: 36, cancellation_rate: 72 } }
];

async function seed() {
    console.log('Clearing existing success_cases...');
    const { error: deleteError } = await supabase.from('success_cases').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using neq id 0 uuid hack if needed, or if policy allows)

    // Note: if delete fails due to RLS, we might need a different approach or manual SQL.
    // Assuming service role key works or we are in dev.
    if (deleteError) {
        console.warn('Delete might have failed (check RLS):', deleteError.message);
    }

    console.log(`Inserting ${cases.length} new cases...`);
    const { data, error } = await supabase.from('success_cases').insert(cases).select();

    if (error) {
        console.error('Insert Error:', error);
    } else {
        console.log('Successfully seeded:', data.length, 'cases.');
    }
}

seed();
