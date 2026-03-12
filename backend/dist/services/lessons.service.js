"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonsService = void 0;
const lessons_repository_1 = require("../repositories/lessons.repository");
const lesson_progress_repository_1 = require("../repositories/lesson-progress.repository");
const enrollments_repository_1 = require("../repositories/enrollments.repository");
const errors_1 = require("../utils/errors");
function formatLessonDuration(minutes) {
    if (!minutes)
        return '';
    return `${minutes} دقيقة`;
}
// Removed automatic SAS signing from lesson fetch; will be handled via dedicated endpoint
exports.lessonsService = {
    async getLessonDetail(lessonId, userId) {
        const lesson = await lessons_repository_1.lessonsRepository.getLessonDetailWithContext(lessonId, userId);
        if (!lesson)
            throw new errors_1.NotFoundError('Lesson not found');
        let locked = !lesson.is_preview;
        let completed = false;
        if (userId && lesson.is_enrolled) {
            locked = false;
            completed = !!lesson.is_completed;
        }
        if (locked) {
            return {
                id: lesson.id,
                title: lesson.title,
                duration: formatLessonDuration(lesson.duration_minutes),
                locked: true,
                completed: false,
                video_url: null, // never expose URL for locked lessons
                description: null,
            };
        }
        return {
            id: lesson.id,
            title: lesson.title,
            duration: formatLessonDuration(lesson.duration_minutes),
            video_url: lesson.video_url, // Will be requested via /api/video/:id instead of full SAS here
            description: lesson.description ?? null,
            locked: false,
            completed,
        };
    },
    async updateProgress(lessonId, userId, data) {
        const lesson = await lessons_repository_1.lessonsRepository.findById(lessonId);
        if (!lesson)
            throw new errors_1.NotFoundError('Lesson not found');
        const courseId = await lessons_repository_1.lessonsRepository.getCourseIdByLessonId(lessonId);
        if (courseId) {
            const enrollment = await enrollments_repository_1.enrollmentsRepository.findByUserAndCourse(userId, courseId);
            if (!enrollment) {
                throw new errors_1.ForbiddenError('Not enrolled in this course');
            }
        }
        const progress = await lesson_progress_repository_1.lessonProgressRepository.upsert(userId, lessonId, {
            is_completed: data.completed,
            watched_seconds: data.watched_seconds,
        });
        return {
            lesson_id: progress.lesson_id,
            completed: progress.is_completed,
            watched_time: progress.watched_seconds,
        };
    },
};
//# sourceMappingURL=lessons.service.js.map