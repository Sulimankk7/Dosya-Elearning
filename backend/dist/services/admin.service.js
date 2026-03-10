"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const courses_repository_1 = require("../repositories/courses.repository");
const sections_repository_1 = require("../repositories/sections.repository");
const lessons_repository_1 = require("../repositories/lessons.repository");
const activation_codes_repository_1 = require("../repositories/activation-codes.repository");
const users_repository_1 = require("../repositories/users.repository");
const errors_1 = require("../utils/errors");
const uuid_1 = require("uuid");
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() + '-' + (0, uuid_1.v4)().slice(0, 8);
}
function formatLessonDuration(minutes) {
    if (!minutes)
        return '';
    return `${minutes} دقيقة`;
}
exports.adminService = {
    /** GET /api/admin/dashboard — matching AdminDashboard stats */
    async getDashboardStats() {
        const totalCourses = await courses_repository_1.coursesRepository.countAll();
        const totalStudents = await users_repository_1.usersRepository.countAll();
        const totalRevenue = await courses_repository_1.coursesRepository.totalRevenue();
        return {
            stats: [
                { label: 'إجمالي الكورسات', value: String(totalCourses) },
                { label: 'إجمالي الطلاب', value: totalStudents.toLocaleString() },
                { label: 'الإيرادات', value: `${totalRevenue.toLocaleString()} دينار` },
                { label: 'معدل النمو', value: '--%' }, // changing later
            ],
        };
    },
    /** GET /api/admin/courses — matching AdminCourses table */
    async listAllCourses() {
        const courses = await courses_repository_1.coursesRepository.findAll();
        return courses.map((c) => ({
            id: c.id,
            title: c.title, // ✅ was "name"
            slug: c.slug,
            description: c.description,
            thumbnail_url: c.thumbnail_url,
            price: c.price, // ✅ return raw number, not formatted string
            instructor_name: c.instructor_name,
            duration_hours: c.duration_hours,
            level: c.level,
            students_count: parseInt(String(c.student_count || c.students_count || 0), 10), // ✅ was "students"
            is_published: Boolean(c.is_published), // ✅ was "status" string
        }));
    },
    async createCourse(data) {
        if (!data.title)
            throw new errors_1.BadRequestError('Course title is required');
        // Generate slug server-side always — ignore any slug from frontend
        const slug = slugify(data.title);
        // Sanitize types to prevent SQL type mismatch errors
        const safeData = {
            title: data.title.trim(),
            description: data.description || undefined,
            thumbnail_url: data.thumbnail_url || undefined,
            price: Number(data.price) || 0,
            instructor_name: data.instructor_name || undefined,
            duration_hours: Number(data.duration_hours) || 0,
            level: data.level || 'Beginner',
            is_published: data.is_published === true || data.is_published === 'true',
            slug,
        };
        return courses_repository_1.coursesRepository.create(safeData);
    },
    async updateCourse(id, data) {
        const course = await courses_repository_1.coursesRepository.findById(id);
        if (!course)
            throw new errors_1.NotFoundError('Course not found');
        return courses_repository_1.coursesRepository.update(id, data);
    },
    async deleteCourse(id) {
        const course = await courses_repository_1.coursesRepository.findById(id);
        if (!course)
            throw new errors_1.NotFoundError('Course not found');
        await courses_repository_1.coursesRepository.delete(id);
        return { message: 'Course deleted successfully' };
    },
    async createSection(courseId, title) {
        if (!title)
            throw new errors_1.BadRequestError('Section title is required');
        const course = await courses_repository_1.coursesRepository.findById(courseId);
        if (!course)
            throw new errors_1.NotFoundError('Course not found');
        return sections_repository_1.sectionsRepository.create(courseId, title);
    },
    async createLesson(sectionId, data) {
        if (!data.title)
            throw new errors_1.BadRequestError('Lesson title is required');
        return lessons_repository_1.lessonsRepository.create({ section_id: sectionId, ...data });
    },
    async updateLesson(id, data) {
        const lesson = await lessons_repository_1.lessonsRepository.findById(id);
        if (!lesson)
            throw new errors_1.NotFoundError('Lesson not found');
        return lessons_repository_1.lessonsRepository.update(id, data);
    },
    async deleteLesson(id) {
        const lesson = await lessons_repository_1.lessonsRepository.findById(id);
        if (!lesson)
            throw new errors_1.NotFoundError('Lesson not found');
        await lessons_repository_1.lessonsRepository.delete(id);
        return { message: 'Lesson deleted successfully' };
    },
    async getLessonsByCourse(courseId) {
        const sections = await sections_repository_1.sectionsRepository.findByCourseId(courseId);
        const result = await Promise.all(sections.map(async (section) => {
            const lessons = await lessons_repository_1.lessonsRepository.findBySectionId(section.id);
            return {
                section_id: section.id,
                section_title: section.title,
                lessons: lessons.map((l) => ({
                    id: l.id,
                    section_id: l.section_id, // ✅ needed for drag/edit
                    title: l.title,
                    description: l.description || '',
                    video_url: l.video_url || '',
                    duration_minutes: l.duration_minutes || 0, // ✅ was formatted string
                    order_index: l.order_index || 0, // ✅ was missing
                    is_preview: Boolean(l.is_preview), // ✅ was missing
                })),
            };
        }));
        return result;
    },
    async createActivationCode(courseId, maxUses, expiresAt) {
        const course = await courses_repository_1.coursesRepository.findById(courseId);
        if (!course)
            throw new errors_1.NotFoundError('Course not found');
        const code = `DOSYA-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
        return activation_codes_repository_1.activationCodesRepository.create({
            code,
            course_id: courseId,
            max_uses: maxUses,
            expires_at: expiresAt,
        });
    },
};
//# sourceMappingURL=admin.service.js.map