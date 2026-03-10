"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentsService = void 0;
const enrollments_repository_1 = require("../repositories/enrollments.repository");
const courses_repository_1 = require("../repositories/courses.repository");
const lessons_repository_1 = require("../repositories/lessons.repository");
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
        const enrollments = await enrollments_repository_1.enrollmentsRepository.findByUserId(userId);
        const totalCompletedLessons = await lesson_progress_repository_1.lessonProgressRepository.countCompletedByUser(userId);
        const courses = await Promise.all(enrollments.map(async (enrollment) => {
            const course = await courses_repository_1.coursesRepository.findById(enrollment.course_id);
            if (!course)
                return null;
            const totalLessons = await lessons_repository_1.lessonsRepository.countByCourseId(course.id);
            const completedLessons = await lesson_progress_repository_1.lessonProgressRepository.countCompletedByUserAndCourse(userId, course.id);
            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
            return {
                id: course.id,
                title: course.title,
                description: course.description || '',
                price: formatPrice(course.price),
                image: course.thumbnail_url || '',
                instructor: course.instructor_name || '',
                duration: formatDuration(course.duration_hours),
                students: parseInt(String(course.student_count || course.students_count || 0), 10),
                enrolled: true,
                progress,
            };
        }));
        const validCourses = courses.filter(Boolean);
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