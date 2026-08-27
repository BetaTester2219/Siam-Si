insert into public.categories (id, slug, name_th, name_en)
values
  ('00000000-0000-4000-8000-000000000001', 'finance', 'การเงิน', 'Finance'),
  ('00000000-0000-4000-8000-000000000002', 'career', 'การงาน', 'Career'),
  ('00000000-0000-4000-8000-000000000003', 'love', 'ความรัก', 'Love'),
  ('00000000-0000-4000-8000-000000000004', 'health', 'สุขภาพ', 'Health'),
  ('00000000-0000-4000-8000-000000000005', 'luck', 'โชคลาภ', 'Luck'),
  ('00000000-0000-4000-8000-000000000006', 'business', 'ค้าขาย', 'Business'),
  ('00000000-0000-4000-8000-000000000007', 'negotiation', 'เจรจา', 'Negotiation'),
  ('00000000-0000-4000-8000-000000000008', 'protection', 'แก้เคราะห์', 'Protection'),
  ('00000000-0000-4000-8000-000000000009', 'wealth', 'มั่งคั่ง', 'Wealth')
on conflict (slug) do update
set name_th = excluded.name_th,
    name_en = excluded.name_en,
    updated_at = now();

insert into public.temples (
  id,
  slug,
  name_th,
  name_en,
  sacred_name_th,
  sacred_name_en,
  description_th,
  description_en,
  province_th,
  province_en,
  location_text,
  source_url,
  source_name,
  source_reference,
  fortune_source_status,
  content_status,
  is_active
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'ai-khai-wat-chedi',
    'ไอ้ไข่ วัดเจดีย์',
    'Ai Khai, Wat Chedi',
    'ไอ้ไข่ เด็กวัดเจดีย์',
    'Ai Khai',
    'ข้อมูลวัดและประสบการณ์เซียมซีอ้างอิงจาก Thai Merit เพื่อใช้เป็นโครงสร้างพัฒนา',
    'Temple and fortune experience metadata adapted as development reference from Thai Merit.',
    'นครศรีธรรมราช',
    'Nakhon Si Thammarat',
    'Sichon, Nakhon Si Thammarat, Thailand',
    'https://thaimerit.com/e-fortune/4',
    'Thai Merit',
    'Thai Merit e-fortune/4',
    'reference_only',
    'draft',
    true
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'wat-chulamanee',
    'วัดจุฬามณี',
    'Wat Chulamanee',
    'ท้าวเวสสุวรรณ วัดจุฬามณี',
    'Thao Wessuwan at Wat Chulamanee',
    'ข้อมูลร่างสำหรับระบบหลายวัดและชุดเซียมซีเฉพาะวัด',
    'Draft temple metadata for temple-specific fortune set architecture.',
    'สมุทรสงคราม',
    'Samut Songkhram',
    'Samut Songkhram, Thailand',
    'https://thaimerit.com/e-fortune/21',
    'Thai Merit',
    'Thai Merit e-fortune/21',
    'reference_only',
    'draft',
    true
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'wat-rai-khing',
    'วัดไร่ขิง',
    'Wat Rai Khing',
    'หลวงพ่อวัดไร่ขิง',
    'Luang Pho Wat Rai Khing',
    'ข้อมูลร่างสำหรับระบบหลายวัดและชุดเซียมซีเฉพาะวัด',
    'Draft temple metadata for temple-specific fortune set architecture.',
    'นครปฐม',
    'Nakhon Pathom',
    'Sam Phran, Nakhon Pathom, Thailand',
    'https://www.thaimerit.com/e-fortune/20',
    'Thai Merit',
    'Thai Merit e-fortune/20',
    'reference_only',
    'draft',
    true
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'wat-phra-that-doi-kham',
    'วัดพระธาตุดอยคำ',
    'Wat Phra That Doi Kham',
    'หลวงพ่อทันใจ',
    'Luang Pho Tan Jai',
    'ข้อมูลร่างสำหรับระบบหลายวัดและชุดเซียมซีเฉพาะวัด',
    'Draft temple metadata for temple-specific fortune set architecture.',
    'เชียงใหม่',
    'Chiang Mai',
    'Chiang Mai, Thailand',
    'https://thaimerit.com/e-fortune/19',
    'Thai Merit',
    'Thai Merit e-fortune/19',
    'reference_only',
    'draft',
    true
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    'lim-ko-niao-shrine',
    'ศาลเจ้าแม่ลิ้มกอเหนี่ยว',
    'Lim Ko Niao Shrine',
    'เจ้าแม่ลิ้มกอเหนี่ยว',
    'Chao Mae Lim Ko Niao',
    'ข้อมูลร่างสำหรับระบบหลายวัดและชุดเซียมซีเฉพาะวัด',
    'Draft temple metadata for temple-specific fortune set architecture.',
    'ปัตตานี',
    'Pattani',
    'Pattani, Thailand',
    'https://thaimerit.com/e-fortune/6',
    'Thai Merit',
    'Thai Merit e-fortune/6',
    'reference_only',
    'draft',
    true
  )
on conflict (slug) do update
set name_th = excluded.name_th,
    name_en = excluded.name_en,
    sacred_name_th = excluded.sacred_name_th,
    sacred_name_en = excluded.sacred_name_en,
    source_url = excluded.source_url,
    source_reference = excluded.source_reference,
    updated_at = now();

insert into public.temple_categories (temple_id, category_id)
values
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002'),
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005'),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002'),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000005'),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000006'),
  ('10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000005'),
  ('10000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000002'),
  ('10000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000005'),
  ('10000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000008'),
  ('10000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000004'),
  ('10000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000003'),
  ('10000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000005')
on conflict do nothing;

insert into public.fortune_sets (id, temple_id, name, version, total_fortunes, source_url, source_name, source_note, content_status, is_active)
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Ai Khai Development Fortune Set', 'v1', 3, 'https://thaimerit.com/e-fortune/4', 'Thai Merit', 'Reference metadata only; draft placeholder content.', 'draft', true),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'Wat Chulamanee Development Fortune Set', 'v1', 3, 'https://thaimerit.com/e-fortune/21', 'Thai Merit', 'Reference metadata only; draft placeholder content.', 'draft', true),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'Wat Rai Khing Development Fortune Set', 'v1', 3, 'https://www.thaimerit.com/e-fortune/20', 'Thai Merit', 'Reference metadata only; draft placeholder content.', 'draft', true),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', 'Wat Phra That Doi Kham Development Fortune Set', 'v1', 3, 'https://thaimerit.com/e-fortune/19', 'Thai Merit', 'Reference metadata only; draft placeholder content.', 'draft', true),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', 'Lim Ko Niao Development Fortune Set', 'v1', 3, 'https://thaimerit.com/e-fortune/6', 'Thai Merit', 'Reference metadata only; draft placeholder content.', 'draft', true)
on conflict (id) do update
set total_fortunes = excluded.total_fortunes,
    source_note = excluded.source_note,
    updated_at = now();

insert into public.fortunes (fortune_set_id, number, original_text_th, interpretation_th, original_text_en, interpretation_en, source_reference, content_status)
select
  fortune_sets.id,
  series.number,
  'ข้อความร่างสำหรับทดสอบระบบเซียมซีเฉพาะวัด หมายเลข ' || series.number,
  'คำทำนายร่างของ ' || temples.name_th || ' หมายเลข ' || series.number || ' ใช้สำหรับทดสอบ backend เท่านั้น',
  'Draft fortune text for temple-specific draw number ' || series.number,
  'Draft interpretation for ' || temples.name_en || ' number ' || series.number || '. Use for backend testing only.',
  fortune_sets.source_note,
  'draft'
from public.fortune_sets
join public.temples on temples.id = fortune_sets.temple_id
cross join generate_series(1, 3) as series(number)
on conflict (fortune_set_id, number) do update
set original_text_th = excluded.original_text_th,
    interpretation_th = excluded.interpretation_th,
    original_text_en = excluded.original_text_en,
    interpretation_en = excluded.interpretation_en,
    updated_at = now();
