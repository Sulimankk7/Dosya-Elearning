"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentsService = void 0;
const enrollments_repository_1 = require("../repositories/enrollments.repository");
const courses_repository_1 = require("../repositories/courses.repository");
const lesson_progress_repository_1 = require("../repositories/lesson-progress.repository");
const errors_1 = require("../utils/errors");
function formatPrice(price) {
    if (price === 0)
        return 'مجاني';
    return `${price} دينار`;
}
function formatDuration(hours) {
    if (!hours)
        return '';
    if (hours === 1)
        return 'ساعة واحدة';
    return `${hours} ساعات`;
}
exports.enrollmentsService = {
    async enroll(userId, courseId) {
        const course = await courses_repository_1.coursesRepository.findById(courseId);
        if (!course)
            throw new errors_1.NotFoundError('Course not found');
        const enrollment = await enrollments_repository_1.enrollmentsRepository.create(userId, courseId);
        return { enrollment_id: enrollment.id, course_id: courseId, enrolled: true };
    },
    /** GET /api/enrollments/my-courses — matching StudentDashboard shape */
    async getMyCourses(userId) {
        const rawCourses = await enrollments_repository_1.enrollmentsRepository.getMyCoursesWithStats(userId);
        const totalCompletedLessons = await lesson_progress_repository_1.lessonProgressRepository.countCompletedByUser(userId);
        const validCourses = rawCourses.map((row) => {
            const totalLessons = parseInt(row.total_lessons || '0', 10);
            const completedLessons = parseInt(row.completed_lessons || '0', 10);
            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
            return {
                id: row.id,
                title: row.title,
                description: row.description || '',
                price: formatPrice(parseFloat(row.price || '0')),
                image: row.thumbnail_url || '',
                instructor: row.instructor_name || '',
                duration: formatDuration(parseFloat(row.duration_hours || '0')),
                students: parseInt(row.student_count || '0', 10),
                enrolled: true,
                progress,
            };
        });
        const totalCourses = validCourses.length;
        const completedCourses = validCourses.filter((c) => c.progress === 100).length;
        const avgProgress = totalCourses > 0
            ? Math.round(validCourses.reduce((acc, c) => acc + c.progress, 0) / totalCourses)
            : 0;
        return {
            stats: {
                enrolled_courses: totalCourses,
                completion_percentage: avgProgress,
                certificates: completedCourses,
                completed_lessons: totalCompletedLessons,
            },
            courses: validCourses,
        };
    },
};
//# sourceMappingURL=enrollments.service.js.map