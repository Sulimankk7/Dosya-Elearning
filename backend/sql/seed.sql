-- DOSYA E-Learning Platform — Seed Data
-- Matches the mock data from the frontend exactly

-- Roles
INSERT INTO roles (id, name) VALUES
  (1, 'super_admin'),
  (2, 'admin'),
  (3, 'student')
ON CONFLICT (name) DO NOTHING;

-- Admin user (password: admin123)
INSERT INTO users (id, full_name, email, password, role_id) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'مدير النظام', 'admin@dosya.com',
   '$2b$10$K7L1OJ45/4Y2nIhQL0yO.ONfLijUmwbmkUJRAJXE5I8BfPrDPrtHe', 2)
ON CONFLICT (email) DO NOTHING;

-- Student user (password: student123)
INSERT INTO users (id, full_name, email, password, role_id) VALUES
  ('s0000000-0000-0000-0000-000000000001', 'أحمد محمد', 'ahmed@example.com',
   '$2b$10$K7L1OJ45/4Y2nIhQL0yO.ONfLijUmwbmkUJRAJXE5I8BfPrDPrtHe', 3)
ON CONFLICT (email) DO NOTHING;

-- Courses (matching CourseCatalog mock data)
INSERT INTO courses (id, title, slug, description, price, original_price, image_url,
  instructor_name, duration, rating, rating_count, what_you_learn) VALUES
  ('c0000000-0000-0000-0000-000000000001',
   'تطوير المواقع الإلكترونية',
   'web-development',
   'تعلم تطوير المواقع من الصفر باستخدام HTML, CSS, و JavaScript. كورس شامل للمبتدئين يغطي جميع الأساسيات والمفاهيم المتقدمة في تطوير الويب.',
   0, 499,
   'https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGluZyUyMHByb2dyYW1taW5nfGVufDF8fHx8MTc3MTcwODIyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
   'أحمد السعيد', '12 ساعة', 4.80, 1250,
   ARRAY['أساسيات HTML و CSS', 'تصميم واجهات مستخدم احترافية', 'JavaScript من الصفر', 'التعامل مع DOM', 'بناء مشاريع عملية', 'أفضل الممارسات في البرمجة']),

  ('c0000000-0000-0000-0000-000000000002',
   'التصميم الجرافيكي',
   'graphic-design',
   'احترف التصميم الجرافيكي باستخدام Adobe Photoshop و Illustrator',
   299, NULL,
   'https://images.unsplash.com/photo-1512645592367-97ba8a9d4035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwY3JlYXRpdmUlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzcxNzE1MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
   'فاطمة محمد', '18 ساعة', 4.50, 890, NULL),

  ('c0000000-0000-0000-0000-000000000003',
   'التسويق الرقمي',
   'digital-marketing',
   'استراتيجيات التسويق الرقمي والإعلانات عبر الإنترنت',
   399, NULL,
   'https://images.unsplash.com/photo-1769798643630-194a0fcfa367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwc3RyYXRlZ3klMjBidXNpbmVzc3xlbnwxfHx8fDE3NzE3OTUxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
   'خالد عبدالله', '10 ساعات', 4.60, 2100, NULL),

  ('c0000000-0000-0000-0000-000000000004',
   'علم البيانات والتحليل',
   'data-science',
   'تعلم تحليل البيانات باستخدام Python و Pandas',
   499, NULL,
   'https://images.unsplash.com/photo-1718241905916-1f9786324de9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMGFuYWx5dGljcyUyMGNvbXB1dGVyfGVufDF8fHx8MTc3MTc5NTE0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
   'سارة أحمد', '20 ساعة', 4.30, 750, NULL),

  ('c0000000-0000-0000-0000-000000000005',
   'تطوير تطبيقات الموبايل',
   'mobile-app-dev',
   'تعلم تطوير تطبيقات iOS و Android باستخدام React Native',
   599, NULL,
   'https://images.unsplash.com/photo-1646737554389-49329965ef01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXZlbG9wbWVudCUyMHNtYXJ0cGhvbmV8ZW58MXx8fHwxNzcxNzkwNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
   'محمد علي', '25 ساعة', 4.70, 620, NULL),

  ('c0000000-0000-0000-0000-000000000006',
   'التعلم الآلي وتعلم الألة',
   'machine-learning',
   'مقدمة في الذكاء الاصطناعي والتعلم الآلي',
   799, NULL,
   'https://images.unsplash.com/photo-1762330910399-95caa55acf04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGNvbXB1dGVyJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3MTc5NTE0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
   'نور الدين', '30 ساعة', 4.20, 450, NULL)
ON CONFLICT DO NOTHING;

-- Course Sections for Web Development course
INSERT INTO course_sections (id, course_id, title, sort_order) VALUES
  ('s0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'المقدمة', 0),
  ('s0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'الأساسيات', 1),
  ('s0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'المستوى المتقدم', 2)
ON CONFLICT DO NOTHING;

-- Lessons for Web Development course (matching CourseDetails mock data)
INSERT INTO lessons (id, section_id, title, duration, is_preview, sort_order) VALUES
  -- Section 1: المقدمة (preview lessons)
  ('l0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 'مرحباً بك في الكورس', '5 دقائق', true, 0),
  ('l0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000001', 'ما ستتعلمه في هذا الكورس', '8 دقائق', true, 1),
  ('l0000000-0000-0000-0000-000000000003', 's0000000-0000-0000-0000-000000000001', 'إعداد بيئة العمل', '12 دقيقة', true, 2),
  -- Section 2: الأساسيات
  ('l0000000-0000-0000-0000-000000000004', 's0000000-0000-0000-0000-000000000002', 'مقدمة في HTML', '15 دقيقة', false, 0),
  ('l0000000-0000-0000-0000-000000000005', 's0000000-0000-0000-0000-000000000002', 'العناصر الأساسية', '20 دقيقة', false, 1),
  ('l0000000-0000-0000-0000-000000000006', 's0000000-0000-0000-0000-000000000002', 'تنسيق النصوص', '18 دقيقة', false, 2),
  -- Section 3: المستوى المتقدم
  ('l0000000-0000-0000-0000-000000000007', 's0000000-0000-0000-0000-000000000003', 'CSS Grid و Flexbox', '25 دقيقة', false, 0),
  ('l0000000-0000-0000-0000-000000000008', 's0000000-0000-0000-0000-000000000003', 'JavaScript الحديث', '30 دقيقة', false, 1),
  ('l0000000-0000-0000-0000-000000000009', 's0000000-0000-0000-0000-000000000003', 'بناء مشروع عملي', '45 دقيقة', false, 2)
ON CONFLICT DO NOTHING;

-- Enroll student in some courses (matching StudentDashboard mock data)
INSERT INTO enrollments (user_id, course_id) VALUES
  ('s0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001'),
  ('s0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002'),
  ('s0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003'),
  ('s0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;

-- Lesson progress for the student (to simulate progress data)
INSERT INTO lesson_progress (user_id, lesson_id, completed, watched_time, completed_at) VALUES
  ('s0000000-0000-0000-0000-000000000001', 'l0000000-0000-0000-0000-000000000001', true, 300, NOW()),
  ('s0000000-0000-0000-0000-000000000001', 'l0000000-0000-0000-0000-000000000002', true, 480, NOW()),
  ('s0000000-0000-0000-0000-000000000001', 'l0000000-0000-0000-0000-000000000003', true, 720, NOW()),
  ('s0000000-0000-0000-0000-000000000001', 'l0000000-0000-0000-0000-000000000004', false, 200, NULL)
ON CONFLICT DO NOTHING;

-- Activation code sample
INSERT INTO activation_codes (code, course_id, max_uses) VALUES
  ('DOSYA-FREE2024', 'c0000000-0000-0000-0000-000000000001', 100)
ON CONFLICT DO NOTHING;
