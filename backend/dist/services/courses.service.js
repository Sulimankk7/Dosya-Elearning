"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coursesService = void 0;
const courses_repository_1 = require("../repositories/courses.repository");
const sections_repository_1 = require("../repositories/sections.repository");
const lessons_repository_1 = require("../repositories/lessons.repository");
const enrollments_repository_1 = require("../repositories/enrollments.repository");
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
function formatLessonDuration(minutes) {
    if (!minutes)
        return '';
    return `${minutes} دقيقة`;
}
exports.coursesService = {
    /** GET /api/courses — matching CourseCatalog page shape */
    async listCourses() {
        const courses = await courses_repository_1.coursesRepository.findAll(true);
        return courses.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description || '',
            price: formatPrice(c.price),
            image: c.thumbnail_url || '',
            instructor: c.instructor_name || '',
            duration: formatDuration(c.duration_hours),
            students: parseInt(String(c.student_count || c.students_count || 0), 10),
        }));
    },
    /** GET /api/courses/:id — matching CourseDetails page shape */
    async getCourseDetail(courseId, userId) {
        const course = await courses_repository_1.coursesRepository.findById(courseId);
        if (!course)
            throw new errors_1.NotFoundError('Course not found');
        const sections = await sections_repository_1.sectionsRepository.findByCourseId(courseId);
        const totalLessons = await lessons_repository_1.lessonsRepository.countByCourseId(courseId);
        // Check enrollment
        let enrolled = false;
        let progress = 0;
        if (userId) {
            const enrollment = await enrollments_repository_1.enrollmentsRepository.findByUserAndCourse(userId, courseId);
            enrolled = !!enrollment;
            if (enrolled) {
                const completed = await lesson_progress_repository_1.lessonProgressRepository.countCompletedByUserAndCourse(userId, courseId);
                progress = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
            }
        }
        // Fetch all lessons for the entire course in one query, instead of looping over sections
        const allLessons = await lessons_repository_1.lessonsRepository.findByCourseId(courseId);
        // Build sections with lessons
        const sectionsWithLessons = sections.map((section) => {
            const sectionLessons = allLessons.filter(l => l.section_id === section.id);
            return {
                id: section.id,
                title: section.title,
                lessons: sectionLessons.map((l) => ({
                    id: l.id,
                    title: l.title,
                    duration: formatLessonDuration(l.duration_minutes),
                    locked: enrolled ? false : !l.is_preview,
                })),
            };
        });
        return {
            course: {
                id: course.id,
                title: course.title,
                description: course.description || '',
                price: formatPrice(course.price),
                original_price: null,
                image: course.thumbnail_url || '',
                instructor: course.instructor_name || '',
                duration: formatDuration(course.duration_hours),
                students: parseInt(String(course.student_count || course.students_count || 0), 10),
                lessons_count: totalLessons,
                rating: course.rating, // ✅ real value from DB
                rating_count: course.rating_count, // ✅ real value from DB
                level: course.level,
                language: 'العربية',
                what_you_learn: course.what_you_learn, // ✅ real array from DB
            },
            sections: sectionsWithLessons,
            enrolled,
            progress,
        };
    },
    /** GET /api/courses/:id/content — matching CourseLearningPage shape (enrolled users only) */
    async getCourseContent(courseId, userId) {
        const course = await courses_repository_1.coursesRepository.findById(courseId);
        if (!course)
            throw new errors_1.NotFoundError('Course not found');
        const sections = await sections_repository_1.sectionsRepository.findByCourseId(courseId);
        const totalLessons = await lessons_repository_1.lessonsRepository.countByCourseId(courseId);
        const completedTotal = await lesson_progress_repository_1.lessonProgressRepository.countCompletedByUserAndCourse(userId, courseId);
        // Optimization: Fetch all lessons and progress in bulk
        const allLessons = await lessons_repository_1.lessonsRepository.findByCourseId(courseId);
        const allProgress = await lesson_progress_repository_1.lessonProgressRepository.findByUserAndCourse(userId, courseId);
        // Create a fast lookup map for progress
        const progressMap = new Map(allProgress.map(p => [p.lesson_id, p]));
        const sectionsWithLessons = sections.map((section) => {
            const sectionLessons = allLessons.filter(l => l.section_id === section.id);
            const sectionLessonCount = sectionLessons.length;
            let sectionCompletedCount = 0;
            const lessonsWithProgress = sectionLessons.map((l) => {
                const prog = progressMap.get(l.id);
                const isCompleted = prog?.is_completed || false;
                if (isCompleted) {
                    sectionCompletedCount++;
                }
                return {
                    id: l.id,
                    title: l.title,
                    duration: formatLessonDuration(l.duration_minutes),
                    completed: isCompleted,
                    locked: false, // implicitly unlocked since user is enrolled
                };
            });
            return {
                id: section.id,
                title: section.title,
                progress: sectionLessonCount > 0
                    ? Math.round((sectionCompletedCount / sectionLessonCount) * 100)
                    : 0,
                lessons: lessonsWithProgress,
            };
        });
        return {
            course: {
                id: course.id,
                title: course.title,
                instructor: course.instructor_name || '',
                image: course.thumbnail_url || '',
            },
            sections: sectionsWithLessons,
            overall_progress: totalLessons > 0 ? Math.round((completedTotal / totalLessons) * 100) : 0,
            completed_lessons: completedTotal,
            total_lessons: totalLessons,
        };
    },
};
//# sourceMappingURL=courses.service.js.map