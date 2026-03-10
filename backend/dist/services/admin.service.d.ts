export declare const adminService: {
    /** GET /api/admin/dashboard — matching AdminDashboard stats */
    getDashboardStats(): Promise<{
        stats: {
            label: string;
            value: string;
        }[];
    }>;
    /** GET /api/admin/courses — matching AdminCourses table */
    listAllCourses(): Promise<{
        id: string;
        title: string;
        slug: string;
        description: string | null;
        thumbnail_url: string | null;
        price: number;
        instructor_name: string | null;
        duration_hours: number;
        level: string | null;
        students_count: number;
        is_published: boolean;
    }[]>;
    createCourse(data: {
        title: string;
        description?: string;
        price?: number;
        thumbnail_url?: string;
        instructor_name?: string;
        duration_hours?: number;
        level?: string;
        is_published?: boolean;
        slug?: string;
    }): Promise<import("../repositories/courses.repository").CourseRow>;
    updateCourse(id: string, data: any): Promise<import("../repositories/courses.repository").CourseRow | null>;
    deleteCourse(id: string): Promise<{
        message: string;
    }>;
    createSection(courseId: string, title: string): Promise<import("../repositories/sections.repository").SectionRow>;
    createLesson(sectionId: string, data: {
        title: string;
        duration_minutes?: number;
        video_url?: string;
        is_preview?: boolean;
    }): Promise<import("../repositories/lessons.repository").LessonRow>;
    updateLesson(id: string, data: Partial<{
        title: string;
        duration_minutes: number;
        video_url: string;
        is_preview: boolean;
    }>): Promise<import("../repositories/lessons.repository").LessonRow | null>;
    deleteLesson(id: string): Promise<{
        message: string;
    }>;
    getLessonsByCourse(courseId: string): Promise<{
        section_id: string;
        section_title: string;
        lessons: {
            id: string;
            section_id: string;
            title: string;
            description: string;
            video_url: string;
            duration_minutes: number;
            order_index: number;
            is_preview: boolean;
        }[];
    }[]>;
    createActivationCode(courseId: string, maxUses?: number, expiresAt?: Date): Promise<import("../repositories/activation-codes.repository").ActivationCodeRow>;
};
//# sourceMappingURL=admin.service.d.ts.map