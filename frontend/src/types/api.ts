// ============================================================
// API Response Types — matches backend response shapes exactly
// ============================================================

// --- Auth ---
export interface AuthUser {
    id: string;
    full_name: string;
    email: string;
    role: string;
    avatar_url: string | null;
    created_at: string;
    phone?: string;
    bio?: string;
}

export interface AuthResponse {
    user: AuthUser;
}

// --- Courses (Catalog) ---
export interface CatalogCourse {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
    instructor: string;
    duration: string;
    students: number;
}

// --- Course Detail ---
export interface CourseDetailLesson {
    id: string;
    title: string;
    duration: string;
    locked: boolean;
}

export interface CourseDetailSection {
    id: string;
    title: string;
    lessons: CourseDetailLesson[];
}

export interface CourseDetailInfo {
    id: string;
    title: string;
    description: string;
    price: string;
    original_price: string | null;
    image: string;
    instructor: string;
    duration: string;
    students: number;
    lessons_count: number;
    rating: number;
    rating_count: number;
    level: string;
    language: string;
    what_you_learn: string[];
}

export interface CourseDetailResponse {
    course: CourseDetailInfo;
    sections: CourseDetailSection[];
    enrolled: boolean;
    progress: number;
}

// --- Course Learning Content ---
export interface LearningLesson {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    locked: boolean;
}

export interface LearningSection {
    id: string;
    title: string;
    progress: number;
    lessons: LearningLesson[];
}

export interface CourseContentResponse {
    course: {
        id: string;
        title: string;
        instructor: string;
        image: string;
    };
    sections: LearningSection[];
    overall_progress: number;
    completed_lessons: number;
    total_lessons: number;
}

// --- Lesson Detail ---
export interface LessonDetail {
    id: string;
    title: string;
    duration: string;
    video_url: string | null;
    description: string | null; // ✅ added
    locked: boolean;
    completed: boolean;
}

// --- Enrollments ---
export interface DashboardStats {
    enrolled_courses: number;
    completion_percentage: number;
    certificates: number;
    completed_lessons: number;
}

export interface EnrolledCourse {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
    instructor: string;
    duration: string;
    students: number;
    enrolled: boolean;
    progress: number;
}

export interface MyCoursesResponse {
    stats: DashboardStats;
    courses: EnrolledCourse[];
}

// --- Admin ---
export interface AdminCourse {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail_url: string;
    price: number;
    instructor_name: string;
    duration_hours: number;
    level: "Beginner" | "Intermediate" | "Advanced";
    students_count: number;
    is_published: boolean;
}

export interface AdminDashboardStat {
    label: string;
    value: string;
    change: string;
}

export interface AdminDashboardResponse {
    stats: AdminDashboardStat[];
}

// --- Profile ---
export interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    bio: string;
    avatar_url: string | null;
    role: string;
    created_at?: string;
}