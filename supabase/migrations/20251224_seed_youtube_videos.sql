-- Seed YouTube videos for '법무법인 에이파트'
-- We use a DO block or just simple inserts selecting the firm_id

WITH firm AS (
  SELECT id FROM law_firms WHERE name = '법무법인 에이파트' LIMIT 1
)
INSERT INTO youtube_videos (firm_id, title, video_url, thumbnail_url, tags, published_at)
SELECT 
  firm.id,
  v.title,
  v.video_url,
  v.thumbnail_url,
  v.tags,
  now() - (v.days_algo || ' days')::interval
FROM firm, (VALUES
  -- @gentle_fighter (젠틀한 싸움닭)
  ('2026년 개인회생 수임료 2026년 개인회생, 개인파산 비용', 'https://www.youtube.com/watch?v=MNA7zI3_Z4A', 'https://i.ytimg.com/vi/MNA7zI3_Z4A/hqdefault.jpg', ARRAY['비용', '수임료', '절차'], 1),
  ('개인회생 조건부인가 어떤 경우에 나오는지 실제 사례 10건', 'https://www.youtube.com/watch?v=cg9lv_Ny0q4', 'https://i.ytimg.com/vi/cg9lv_Ny0q4/hqdefault.jpg', ARRAY['조건부인가', '사례'], 2),
  ('개인회생 2026년 회생법원 3곳 추가 개원', 'https://www.youtube.com/watch?v=RQGa2nLnbGY', 'https://i.ytimg.com/vi/RQGa2nLnbGY/hqdefault.jpg', ARRAY['법원', '제도변화'], 5),
  ('개인회생 시청자 Q&A, 편파변제 금액이 많은 채무자', 'https://www.youtube.com/watch?v=8tQVvQzKK7U', 'https://i.ytimg.com/vi/8tQVvQzKK7U/hqdefault.jpg', ARRAY['편파변제', 'Q&A'], 7),
  ('개인회생 변제금 낮추고, 빚 탕감 많이 받으려면', 'https://www.youtube.com/watch?v=dQMBl1Agf9Y', 'https://i.ytimg.com/vi/dQMBl1Agf9Y/hqdefault.jpg', ARRAY['변제금', '탕감'], 9),
  ('남자친구 사업자금으로 빌려준 돈 개인회생', 'https://www.youtube.com/watch?v=j-rsHkEZ6-4', 'https://i.ytimg.com/vi/j-rsHkEZ6-4/hqdefault.jpg', ARRAY['사업자금', '대여금'], 12),
  ('회생 직전 배우자에게 전세보증금 명의를 이전했는데', 'https://www.youtube.com/watch?v=-Ate4NwaPlQ', 'https://i.ytimg.com/vi/-Ate4NwaPlQ/hqdefault.jpg', ARRAY['배우자', '전세보증금', '사기피해'], 14),
  ('코인투자 실패로 인한 개인회생 가능할까요?', 'https://www.youtube.com/watch?v=FBs8ChizC7c', 'https://i.ytimg.com/vi/FBs8ChizC7c/hqdefault.jpg', ARRAY['코인', '주식', '투자실패'], 14),
  ('주민등록만 옮겨놓으면 서울회생법원에 접수 가능할까요?', 'https://www.youtube.com/watch?v=gt1wY0JZxY4', 'https://i.ytimg.com/vi/gt1wY0JZxY4/hqdefault.jpg', ARRAY['관할', '서울회생법원'], 14),
  ('개인회생 절차에서 부동산 가격 산정방법', 'https://www.youtube.com/watch?v=Ikxe9d7zbvA', 'https://i.ytimg.com/vi/Ikxe9d7zbvA/hqdefault.jpg', ARRAY['부동산', '청산가치'], 21),
  ('개인회생, 파산 인지액과 송달료 얼마나 드나요?', 'https://www.youtube.com/watch?v=FUZDYYAVbBo', 'https://i.ytimg.com/vi/FUZDYYAVbBo/hqdefault.jpg', ARRAY['비용', '절차'], 21),
  ('개인회생 변제금 미납현황 조회하기', 'https://www.youtube.com/watch?v=_IwN_DvbHQY', 'https://i.ytimg.com/vi/_IwN_DvbHQY/hqdefault.jpg', ARRAY['변제금', '미납'], 30),
  ('개인회생 하면 청약통장 반드시 해지해야 할까?', 'https://www.youtube.com/watch?v=FR_W08_DcXw', 'https://i.ytimg.com/vi/FR_W08_DcXw/hqdefault.jpg', ARRAY['청약통장', '자산'], 30),
  ('전세대출에 질권이 설정되어 있는 경우와 아닌 경우', 'https://www.youtube.com/watch?v=Fb9-i9qbyBA', 'https://i.ytimg.com/vi/Fb9-i9qbyBA/hqdefault.jpg', ARRAY['전세자금대출', '질권'], 30),
  ('개인회생 유리하게 진행하려고 이혼? 재산분할?', 'https://www.youtube.com/watch?v=Ivm_AzcYsQM', 'https://i.ytimg.com/vi/Ivm_AzcYsQM/hqdefault.jpg', ARRAY['이혼', '재산분할'], 30),
  ('개인회생 전 연체가 시작되면 계좌나 월급이 바로 압류될까?', 'https://www.youtube.com/watch?v=Ip8ewAzVzLU', 'https://i.ytimg.com/vi/Ip8ewAzVzLU/hqdefault.jpg', ARRAY['압류', '추심', '연체'], 30),
  ('개인회생 신청 자격 이 3가지만 알면 됩니다', 'https://www.youtube.com/watch?v=Uvn471gdZCw', 'https://i.ytimg.com/vi/Uvn471gdZCw/hqdefault.jpg', ARRAY['자격조건', '절차'], 60),

  -- @개인회생길잡이
  ('서울 자가 대기업 다니는 김부장 개인회생하면 집 지킬 수 있었을까?', 'https://www.youtube.com/watch?v=lg5ogjI7mvg', 'https://i.ytimg.com/vi/lg5ogjI7mvg/hqdefault.jpg', ARRAY['부동산', '자가', '아파트'], 1),
  ('세금 빚 있으면 개인회생 안 된다?', 'https://www.youtube.com/watch?v=IM8UcCgtwss', 'https://i.ytimg.com/vi/IM8UcCgtwss/hqdefault.jpg', ARRAY['세금', '조세채무'], 4),
  ('기준이 매우 타이트한 대전! 1차보정', 'https://www.youtube.com/watch?v=V12IUhPR66E', 'https://i.ytimg.com/vi/V12IUhPR66E/hqdefault.jpg', ARRAY['보정', '대전지방법원'], 6),
  ('지인에게만 돈 갚은 상담자 개인회생 변제금 계산법', 'https://www.youtube.com/watch?v=IIWp9een8jM', 'https://i.ytimg.com/vi/IIWp9een8jM/hqdefault.jpg', ARRAY['지인채무', '편파변제', '변제금'], 11),
  ('수험생, 취준생 소득이 없는데 개인회생 진행 가능한가요', 'https://www.youtube.com/watch?v=sJwPQbFU9bk', 'https://i.ytimg.com/vi/sJwPQbFU9bk/hqdefault.jpg', ARRAY['무직', '미취업', '자격조건'], 13),
  ('아파트 판 돈 배우자에게 주고 개인회생 가능할까?!', 'https://www.youtube.com/watch?v=m320LAYRAZw', 'https://i.ytimg.com/vi/m320LAYRAZw/hqdefault.jpg', ARRAY['배우자', '부동산', '재산처분'], 14),
  ('춘천지방법원에 접수한 회생 사건, 강릉지원으로 강제 이송?', 'https://www.youtube.com/watch?v=ZOI1YnyVJEg', 'https://i.ytimg.com/vi/ZOI1YnyVJEg/hqdefault.jpg', ARRAY['이송', '관할'], 14),
  ('코인손실금 1억5천 실무 해결방법', 'https://www.youtube.com/watch?v=6CKuo75t7IY', 'https://i.ytimg.com/vi/6CKuo75t7IY/hqdefault.jpg', ARRAY['코인', '주식', '투자실패'], 14),
  ('개인회생 변제금이 높아지는 청산가치 증가 사유 5가지', 'https://www.youtube.com/watch?v=t0Kh-k3oZHY', 'https://i.ytimg.com/vi/t0Kh-k3oZHY/hqdefault.jpg', ARRAY['청산가치', '변제금'], 21),
  ('빚독촉 전화, 무시하면 큰일 날까?', 'https://www.youtube.com/watch?v=hrU-ADnKl2c', 'https://i.ytimg.com/vi/hrU-ADnKl2c/hqdefault.jpg', ARRAY['추심', '독촉', '대응법'], 21),
  ('개인회생 진술서에서 담아야 할 흐름과 감정', 'https://www.youtube.com/watch?v=I0c61icYIqQ', 'https://i.ytimg.com/vi/I0c61icYIqQ/hqdefault.jpg', ARRAY['진술서', '작성법'], 28),
  ('개인회생 유리하게 진행하려 이혼, 재산분할 한다면?', 'https://www.youtube.com/watch?v=ZVIxQUdtTzM', 'https://i.ytimg.com/vi/ZVIxQUdtTzM/hqdefault.jpg', ARRAY['이혼', '재산분할'], 30),
  ('개인회생 편파변제 케이스와 실무적 대응법 총정리', 'https://www.youtube.com/watch?v=hE5yNJXwp7o', 'https://i.ytimg.com/vi/hE5yNJXwp7o/hqdefault.jpg', ARRAY['편파변제', '대응법'], 30),
  ('개인회생, 배우자의 재산은 제외해야 하는 이유', 'https://www.youtube.com/watch?v=-31MMwGHeFw', 'https://i.ytimg.com/vi/-31MMwGHeFw/hqdefault.jpg', ARRAY['배우자', '재산'], 30),
  ('개인회생이 답이 아닐 수도 있습니다 – 워크아웃이 유리한 케이스', 'https://www.youtube.com/watch?v=tKIzTQLakXI', 'https://i.ytimg.com/vi/tKIzTQLakXI/hqdefault.jpg', ARRAY['워크아웃', '비교'], 30),
  ('주택·전세보증금 청산가치 때문에 회생 막히는 분들', 'https://www.youtube.com/watch?v=UVrLF00JMwo', 'https://i.ytimg.com/vi/UVrLF00JMwo/hqdefault.jpg', ARRAY['전세보증금', '부동산', '청산가치'], 30),
  ('2026 개인회생 최신기준 공개! 생계비 인상', 'https://www.youtube.com/watch?v=9zef9f1uUKI', 'https://i.ytimg.com/vi/9zef9f1uUKI/hqdefault.jpg', ARRAY['최생', '생계비', '2026년'], 30)

) as v(title, video_url, thumbnail_url, tags, days_algo);
