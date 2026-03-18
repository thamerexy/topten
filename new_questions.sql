-- Optimized SQL for 12 New Categories
-- This version uses a more robust structure for the Supabase SQL Editor

DO $$
DECLARE
    q_id UUID;
BEGIN

-- 1. أطول 10 سور في القرآن الكريم
INSERT INTO public.top_questions (topic_ar) VALUES ('أطول 10 سور في القرآن الكريم (حسب عدد الآيات)') RETURNING id INTO q_id;
INSERT INTO public.top_answers (question_id, answer_ar, rank, points) VALUES
    (q_id, 'البقرة', 1, 10),
    (q_id, 'الشعراء', 2, 20),
    (q_id, 'الأعراف', 3, 30),
    (q_id, 'آل عمران', 4, 40),
    (q_id, 'الصافات', 5, 50),
    (q_id, 'النساء', 6, 60),
    (q_id, 'الأنعام', 7, 70),
    (q_id, 'طـه', 8, 80),
    (q_id, 'المائدة', 9, 90),
    (q_id, 'هـود', 10, 100);

-- 2. السور التي سُميت بأسماء الأنبياء
INSERT INTO public.top_questions (topic_ar) VALUES ('سور في القرآن سُميت بأسماء الأنبياء') RETURNING id INTO q_id;
INSERT INTO public.top_answers (question_id, answer_ar, rank, points) VALUES
    (q_id, 'يونس', 1, 10),
    (q_id, 'هـود', 2, 20),
    (q_id, 'يوسف', 3, 30),
    (q_id, 'إبراهيم', 4, 40),
    (q_id, 'مـحمد', 5, 50),
    (q_id, 'نوح', 6, 60),
    (q_id, 'لوط', 7, 70),
    (q_id, 'داوود', 8, 80),
    (q_id, 'سليمان', 9, 90),
    (q_id, 'عيسى (آل عمران)', 10, 100);

-- 3. الخلفاء الأمويون الأوائل
INSERT INTO public.top_questions (topic_ar) VALUES ('أوائل الخلفاء الأمويين (بالترتيب الزمني)') RETURNING id INTO q_id;
INSERT INTO public.top_answers (question_id, answer_ar, rank, points) VALUES
    (q_id, 'معاوية بن أبي سفيان', 1, 10),
    (q_id, 'يزيد بن معاوية', 2, 20),
    (q_id, 'معاوية بن يزيد', 3, 30),
    (q_id, 'مروان بن الحكم', 4, 40),
    (q_id, 'عبد الملك بن مروان', 5, 50),
    (q_id, 'الوليد بن عبد الملك', 6, 60),
    (q_id, 'سليمان بن عبد الملك', 7, 70),
    (q_id, 'عمر بن عبد العزيز', 8, 80),
    (q_id, 'يزيد بن عبد الملك', 9, 90),
    (q_id, 'هشام بن عبد الملك', 10, 100);

-- 4. أكبر 10 دول في العالم من حيث المساحة
INSERT INTO public.top_questions (topic_ar) VALUES ('أكبر 10 دول في العالم من حيث المساحة') RETURNING id INTO q_id;
INSERT INTO public.top_answers (question_id, answer_ar, rank, points) VALUES
    (q_id, 'روسيا', 1, 10),
    (q_id, 'كندا', 2, 20),
    (q_id, 'الصين', 3, 30),
    (q_id, 'الولايات المتحدة', 4, 40),
    (q_id, 'البرازيل', 5, 50),
    (q_id, 'أستراليا', 6, 60),
    (q_id, 'الهند', 7, 70),
    (q_id, 'الأرجنتين', 8, 80),
    (q_id, 'كازاخستان', 9, 90),
    (q_id, 'الجزائر', 10, 100);

-- 5. أكبر 10 دول عربية من حيث المساحة
INSERT INTO public.top_questions (topic_ar) VALUES ('أكبر 10 دول عربية من حيث المساحة') RETURNING id INTO q_id;
INSERT INTO public.top_answers (question_id, answer_ar, rank, points) VALUES
    (q_id, 'الجزائر', 1, 10),
    (q_id, 'السعودية', 2, 20),
    (q_id, 'السودان', 3, 30),
    (q_id, 'ليبيا', 4, 40),
    (q_id, 'موريتانيا', 5, 50),
    (q_id, 'مصر', 6, 60),
    (q_id, 'المغرب', 7, 70),
    (q_id, 'العراق', 8, 80),
    (q_id, 'عُمان', 9, 90),
    (q_id, 'الصومال', 10, 100);

-- 6. أطول 10 أنهار في العالم
INSERT INTO public.top_questions (topic_ar) VALUES ('أطول 10 أنهار في العالم') RETURNING id INTO q_id;
INSERT INTO public.top_answers (question_id, answer_ar, rank, points) VALUES
    (q_id, 'النيل', 1, 10),
    (q_id, 'الأمازون', 2, 20),
    (q_id, 'يانغتسي', 3, 30),
    (q_id, 'المسيسيبي', 4, 40),
    (q_id, 'الينسي', 5, 50),
    (q_id, 'النهر الأصفر', 6, 60),
    (q_id, 'أوب', 7, 70),
    (q_id, 'بارانا', 8, 80),
    (q_id, 'الكونغو', 9, 90),
    (q_id, 'آمور', 10, 100);

-- 7. أكثر 10 دول سكاناً في العالم
INSERT INTO public.top_questions (topic_ar) VALUES ('أكثر 10 دول سكاناً في العالم') RETURNING id INTO q_id;
INSERT INTO public.top_answers (question_id, answer_ar, rank, points) VALUES
    (q_id, 'الهند', 1, 10),
    (q_id, 'الصين', 2, 20),
    (q_id, 'الولايات المتحدة', 3, 30),
    (q_id, 'إندونيسيا', 4, 40),
    (q_id, 'باكستان', 5, 50),
    (q_id, 'نيجيريا', 6, 60),
    (q_id, 'البرازيل', 7, 70),
    (q_id, 'بنغلاديش', 8, 80),
    (q_id, 'روسيا', 9, 90),
    (q_id, 'المكسيك', 10, 100);

-- 8. أكثر 10 لاعبين فوزاً بالكرة الذهبية
INSERT INTO public.top_questions (topic_ar) VALUES ('أكثر اللاعبين فوزاً بالكرة الذهبية Ballon dOr') RETURNING id INTO q_id;
INSERT INTO public.top_answers (question_id, answer_ar, rank, points) VALUES
    (q_id, 'ليونيل ميسي', 1, 10),
    (q_id, 'كريستيانو رونالدو', 2, 20),
    (q_id, 'ميشيل بلاتيني', 3, 30),
    (q_id, 'يوهان كرويف', 4, 40),
    (q_id, 'ماركو فان باستن', 5, 50),
    (q_id, 'رونالدو النازاريو', 6, 60),
    (q_id, 'فرانتس بكنباور', 7, 70),
    (q_id, 'كيفن كيغان', 8, 80),
    (q_id, 'كارل هاينز رومينيغه', 9, 90),
    (q_id, 'زين الدين زيدان', 10, 100);

-- 9. الأندية الأكثر فوزاً بدوري أبطال أوروبا
INSERT INTO public.top_questions (topic_ar) VALUES ('الأندية الأكثر فوزاً بدوري أبطال أوروبا') RETURNING id INTO q_id;
INSERT INTO public.top_answers (question_id, answer_ar, rank, points) VALUES
    (q_id, 'ريال مدريد', 1, 10),
    (q_id, 'ميلان', 2, 20),
    (q_id, 'بايرن ميونخ', 3, 30),
    (q_id, 'ليفربول', 4, 40),
    (q_id, 'برشلونة', 5, 50),
    (q_id, 'أياكس', 6, 60),
    (q_id, 'مانشستر يونايتد', 7, 70),
    (q_id, 'إنتر ميلان', 8, 80),
    (q_id, 'بنفيكا', 9, 90),
    (q_id, 'تشيلسي', 10, 100);

-- 10. العناصر الكيميائية الـ 10 الأولى
INSERT INTO public.top_questions (topic_ar) VALUES ('أول 10 عناصر في الجدول الدوري') RETURNING id INTO q_id;
INSERT INTO public.top_answers (question_id, answer_ar, rank, points) VALUES
    (q_id, 'هيدروجين', 1, 10),
    (q_id, 'هيليوم', 2, 20),
    (q_id, 'ليثيوم', 3, 30),
    (q_id, 'بريليوم', 4, 40),
    (q_id, 'بورون', 5, 50),
    (q_id, 'كربون', 6, 60),
    (q_id, 'نيتروجين', 7, 70),
    (q_id, 'أكسجين', 8, 80),
    (q_id, 'فلور', 9, 90),
    (q_id, 'نيون', 10, 100);

-- 11. أكبر 10 شركات تقنية في العالم
INSERT INTO public.top_questions (topic_ar) VALUES ('أكبر 10 شركات تقنية في العالم 2024') RETURNING id INTO q_id;
INSERT INTO public.top_answers (question_id, answer_ar, rank, points) VALUES
    (q_id, 'مايكروسوفت', 1, 10),
    (q_id, 'أبل', 2, 20),
    (q_id, 'إنفيديا', 3, 30),
    (q_id, 'ألفابت جوجل', 4, 40),
    (q_id, 'أمازون', 5, 50),
    (q_id, 'ميتا فيسبوك', 6, 60),
    (q_id, 'Taiwan Semiconductor TSMC', 7, 70),
    (q_id, 'تيسلا', 8, 80),
    (q_id, 'برودكوم', 9, 90),
    (q_id, 'سامسونج', 10, 100);

-- 12. أول 10 دول استضافت كأس العالم
INSERT INTO public.top_questions (topic_ar) VALUES ('أول 10 دول استضافت بطولة كأس العالم') RETURNING id INTO q_id;
INSERT INTO public.top_answers (question_id, answer_ar, rank, points) VALUES
    (q_id, 'أوروغواي', 1, 10),
    (q_id, 'إيطاليا', 2, 20),
    (q_id, 'فرنسا', 3, 30),
    (q_id, 'البرازيل', 4, 40),
    (q_id, 'سويسرا', 5, 50),
    (q_id, 'السويد', 6, 60),
    (q_id, 'تشيلي', 7, 70),
    (q_id, 'إنجلترا', 8, 80),
    (q_id, 'المكسيك', 9, 90),
    (q_id, 'ألمانيا الغربية', 10, 100);

END $$;
