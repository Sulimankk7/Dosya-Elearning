import type {
    AuthResponse, AuthUser,
    CatalogCourse, CourseDetailResponse, CourseContentResponse,
    LessonDetail, MyCoursesResponse,
    AdminCourse, AdminDashboardResponse,
    UserProfile,
} from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ---- Generic fetch helper ----
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {})
    };

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: 'include',  // sends session cookie automatically
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        const message =
            body?.message ||
            body?.error ||
            (res.status === 400 ? "البيانات غير صحيحة" :
                res.status === 401 ? "البريد أو كلمة المرور غير صحيحة" :
                    res.status === 404 ? "المورد غير موجود" :
                        res.status === 500 ? "حدث خطأ في الخادم" :
                            "حدث خطأ غير متوقع");

        throw new Error(message);
    }

    return res.json();
}

// ============================================================
// Auth API
// ============================================================
export const authApi = {
    async register(full_name: string, email: string, password: string): Promise<AuthResponse> {
        return apiFetch<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ full_name, email, password }),
        });
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        return apiFetch<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    async me(): Promise<AuthUser> {
        return apiFetch<AuthUser>('/auth/me');
    },

    async forgotPassword(email: string): Promise<{ message: string }> {
        return apiFetch('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        return apiFetch('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
        });
    },

    async logout(): Promise<void> {
        await apiFetch('/auth/logout', { method: 'POST' });
    },
};

// ============================================================
// Courses API
// ============================================================
export const coursesApi = {
    async list(): Promise<CatalogCourse[]> {
        return apiFetch<CatalogCourse[]>('/courses');
    },

    async getDetail(id: string): Promise<CourseDetailResponse> {
        return apiFetch<CourseDetailResponse>(`/courses/${id}`);
    },

    async getContent(id: string): Promise<CourseContentResponse> {
        return apiFetch<CourseContentResponse>(`/courses/${id}/content`);
    },
};

// ============================================================
// Lessons API
// ============================================================
export const lessonsApi = {
    async getDetail(id: string): Promise<LessonDetail> {
        return apiFetch<LessonDetail>(`/lessons/${id}`);
    },

    async updateProgress(id: string, data: { completed?: boolean; watched_time?: number }): Promise<any> {
        return apiFetch(`/lessons/${id}/progress`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// ============================================================
// Enrollments API
// ============================================================
export const enrollmentsApi = {
    async enroll(course_id: string): Promise<any> {
        return apiFetch('/enrollments/enroll', {
            method: 'POST',
            body: JSON.stringify({ course_id }),
        });
    },

    async myCourses(): Promise<MyCoursesResponse> {
        return apiFetch<MyCoursesResponse>('/enrollments/my-courses');
    },
};

// ============================================================
// Activation Codes API
// ============================================================
export const activationCodesApi = {
    async redeem(code: string): Promise<{ message: string; course_id: string }> {
        return apiFetch('/activation-codes/redeem', {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
    },
};

// ============================================================
// Profile API
// ============================================================
export const profileApi = {
    async get(): Promise<UserProfile> {
        return apiFetch<UserProfile>('/profile');
    },

    async update(data: { full_name?: string; phone?: string; bio?: string }): Promise<UserProfile> {
        return apiFetch<UserProfile>('/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async changePassword(current_password: string, new_password: string): Promise<{ message: string }> {
        return apiFetch('/profile/password', {
            method: 'PUT',
            body: JSON.stringify({ current_password, new_password }),
        });
    },
};

// ============================================================
// Admin API
// ============================================================
export const adminApi = {
    async dashboard(): Promise<AdminDashboardResponse> {
        return apiFetch<AdminDashboardResponse>('/admin/dashboard');
    },

    async listCourses(): Promise<AdminCourse[]> {
        return apiFetch<AdminCourse[]>('/admin/courses');
    },

    async createCourse(data: any): Promise<any> {
        return apiFetch('/admin/courses', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async updateCourse(id: string, data: any): Promise<any> {
        return apiFetch(`/admin/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async deleteCourse(id: string): Promise<any> {
        return apiFetch(`/admin/courses/${id}`, { method: 'DELETE' });
    },

    async createSection(course_id: string, title: string): Promise<any> {
        return apiFetch('/admin/sections', {
            method: 'POST',
            body: JSON.stringify({ course_id, title }),
        });
    },

    async createLesson(section_id: string, data: any): Promise<any> {
        return apiFetch('/admin/lessons', {
            method: 'POST',
            body: JSON.stringify({ section_id, ...data }),
        });
    },

    async updateLesson(id: string, data: any): Promise<any> {
        return apiFetch(`/admin/lessons/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },



    async deleteLesson(id: string): Promise<any> {
        return apiFetch(`/admin/lessons/${id}`, { method: 'DELETE' });
    },

    async getLessonsByCourse(courseId: string): Promise<any> {
        return apiFetch(`/admin/courses/${courseId}/lessons`);
    },

    async createActivationCode(course_id: string, max_uses?: number, expires_at?: string): Promise<any> {
        return apiFetch('/admin/activation-codes', {
            method: 'POST',
            body: JSON.stringify({ course_id, max_uses, expires_at }),
        });
    },
};
