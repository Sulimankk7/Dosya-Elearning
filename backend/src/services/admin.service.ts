import { coursesRepository } from '../repositories/courses.repository';
import { sectionsRepository } from '../repositories/sections.repository';
import { lessonsRepository } from '../repositories/lessons.repository';
import { activationCodesRepository } from '../repositories/activation-codes.repository';
import { usersRepository } from '../repositories/users.repository';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() + '-' + uuidv4().slice(0, 8);
}

function formatLessonDuration(minutes: number | null): string {
    if (!minutes) return '';
    return `${minutes} دقيقة`;
}

export const adminService = {
    /** GET /api/admin/dashboard — matching AdminDashboard stats */
    async getDashboardStats() {
        const totalCourses = await coursesRepository.countAll();
        const totalStudents = await usersRepository.countAll();
        const totalRevenue = await coursesRepository.totalRevenue();

        return {
            stats: [
                { label: 'إجمالي الكورسات', value: String(totalCourses)},
                { label: 'إجمالي الطلاب', value: totalStudents.toLocaleString() },
                { label: 'الإيرادات', value: `${totalRevenue.toLocaleString()} دينار` },
                { label: 'معدل النمو', value: '--%' }, // changing later
            ],
        };
    },

    /** GET /api/admin/courses — matching AdminCourses table */
  async listAllCourses() {
    const courses = await coursesRepository.findAll();
    return courses.map((c) => ({
        id:             c.id,
        title:          c.title,           // ✅ was "name"
        slug:           c.slug,
        description:    c.description,
        thumbnail_url:  c.thumbnail_url,
        price:          c.price,           // ✅ return raw number, not formatted string
        instructor_name: c.instructor_name,
        duration_hours: c.duration_hours,
        level:          c.level,
        students_count: parseInt(String(c.student_count || c.students_count || 0), 10), // ✅ was "students"
        is_published:   Boolean(c.is_published), // ✅ was "status" string
    }));
},

async createCourse(data: {
    title: string;
    description?: string;
    price?: number;
    thumbnail_url?: string;
    instructor_name?: string;
    duration_hours?: number;
    level?: string;
    is_published?: boolean;
    slug?: string; // may arrive from frontend, we ignore it
}) {
    if (!data.title) throw new BadRequestError('Course title is required');

    // Generate slug server-side always — ignore any slug from frontend
    const slug = slugify(data.title);

    // Sanitize types to prevent SQL type mismatch errors
    const safeData = {
    title:           data.title.trim(),
    description:     data.description || undefined,
    thumbnail_url:   data.thumbnail_url || undefined,
    price:           Number(data.price) || 0,
    instructor_name: data.instructor_name || undefined,
    duration_hours:  Number(data.duration_hours) || 0,
    level:           data.level || 'Beginner',
    is_published:    data.is_published === true || (data.is_published as any) === 'true',
    slug,
};

    return coursesRepository.create(safeData);
},

    async updateCourse(id: string, data: any) {
        const course = await coursesRepository.findById(id);
        if (!course) throw new NotFoundError('Course not found');
        return coursesRepository.update(id, data);
    },

    async deleteCourse(id: string) {
        const course = await coursesRepository.findById(id);
        if (!course) throw new NotFoundError('Course not found');
        await coursesRepository.delete(id);
        return { message: 'Course deleted successfully' };
    },

    async createSection(courseId: string, title: string) {
        if (!title) throw new BadRequestError('Section title is required');
        const course = await coursesRepository.findById(courseId);
        if (!course) throw new NotFoundError('Course not found');
        return sectionsRepository.create(courseId, title);
    },

    async createLesson(sectionId: string, data: {
        title: string; duration_minutes?: number; video_url?: string; is_preview?: boolean;
    }) {
        if (!data.title) throw new BadRequestError('Lesson title is required');
        return lessonsRepository.create({ section_id: sectionId, ...data });
    },

    async updateLesson(id: string, data: Partial<{
        title: string; duration_minutes: number; video_url: string; is_preview: boolean;
    }>) {
        const lesson = await lessonsRepository.findById(id);
        if (!lesson) throw new NotFoundError('Lesson not found');
        return lessonsRepository.update(id, data);
    },

    async deleteLesson(id: string) {
        const lesson = await lessonsRepository.findById(id);
        if (!lesson) throw new NotFoundError('Lesson not found');
        await lessonsRepository.delete(id);
        return { message: 'Lesson deleted successfully' };
    },

 async getLessonsByCourse(courseId: string) {
    const sections = await sectionsRepository.findByCourseId(courseId);
    const result = await Promise.all(
        sections.map(async (section) => {
            const lessons = await lessonsRepository.findBySectionId(section.id);
            return {
                section_id:    section.id,
                section_title: section.title,
                lessons: lessons.map((l) => ({
                    id:               l.id,
                    section_id:       l.section_id,   // ✅ needed for drag/edit
                    title:            l.title,
                    description:      l.description || '',
                    video_url:        l.video_url || '',
                    duration_minutes: l.duration_minutes || 0, // ✅ was formatted string
                    order_index:      l.order_index || 0,       // ✅ was missing
                    is_preview:       Boolean(l.is_preview),    // ✅ was missing
                })),
            };
        })
    );
    return result;
},

    async createActivationCode(courseId: string, maxUses?: number, expiresAt?: Date) {
        const course = await coursesRepository.findById(courseId);
        if (!course) throw new NotFoundError('Course not found');

        const code = `DOSYA-${uuidv4().slice(0, 8).toUpperCase()}`;
        return activationCodesRepository.create({
            code,
            course_id: courseId,
            max_uses: maxUses,
            expires_at: expiresAt,
        });
    },
};
