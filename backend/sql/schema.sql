-- DOSYA E-Learning Platform — PostgreSQL Schema
-- Run this SQL against your PostgreSQL database to create all tables.

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50) UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name    VARCHAR(255) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  password     VARCHAR(255) NOT NULL,
  phone        VARCHAR(50),
  bio          TEXT,
  avatar_url   VARCHAR(500),
  role_id      INT REFERENCES roles(id) DEFAULT 3,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) UNIQUE NOT NULL,
  description     TEXT,
  price           DECIMAL(10,2) DEFAULT 0,
  original_price  DECIMAL(10,2),
  image_url       VARCHAR(500),
  instructor_name VARCHAR(255),
  duration        VARCHAR(50),
  level           VARCHAR(50) DEFAULT 'مبتدئ',
  language        VARCHAR(50) DEFAULT 'العربية',
  status          VARCHAR(20) DEFAULT 'active',
  rating          DECIMAL(3,2) DEFAULT 0,
  rating_count    INT DEFAULT 0,
  what_you_learn  TEXT[],
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Course Sections table
CREATE TABLE IF NOT EXISTS course_sections (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  UUID REFERENCES courses(id) ON DELETE CASCADE,
  title      VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id  UUID REFERENCES course_sections(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  duration    VARCHAR(50),
  video_url   VARCHAR(500),
  is_preview  BOOLEAN DEFAULT false,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id    UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Lesson Progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id     UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed     BOOLEAN DEFAULT false,
  watched_time  INT DEFAULT 0,
  completed_at  TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- Activation Codes table
CREATE TABLE IF NOT EXISTS activation_codes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR(50) UNIQUE NOT NULL,
  course_id   UUID REFERENCES courses(id) ON DELETE CASCADE,
  max_uses    INT DEFAULT 1,
  used_count  INT DEFAULT 0,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_sections_course ON course_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_section ON lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_activation_code ON activation_codes(code);
