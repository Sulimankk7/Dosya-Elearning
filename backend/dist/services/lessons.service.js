"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonsService = void 0;
const lessons_repository_1 = require("../repositories/lessons.repository");
const lesson_progress_repository_1 = require("../repositories/lesson-progress.repository");
const enrollments_repository_1 = require("../repositories/enrollments.repository");
const errors_1 = require("../utils/errors");
const azure_sas_1 = require("../utils/azure-sas");
function formatLessonDuration(minutes) {
    if (!minutes)
        return '';
    return `${minutes} دقيقة`;
}
/**
 * Signs a video URL or filename with a SAS token.
 * Handles both formats stored in the DB:
 *   - Full URL: "https://dosyavideostorage.blob.core.windows.net/videos/file.mp4"
 *   - Filename only: "comments-in-cpp.mp4"
 * Returns null safely if no video_url is set.
 */
function signVideoUrl(videoUrl) {
    if (!videoUrl)
        return null;
    try {
        return (0, azure_sas_1.generateVideoSas)(videoUrl);
    }
    catch (err) {
        console.error('[SAS] Failed to sign video URL:', videoUrl, err);
        return null; // degrade gracefully — don't crash the lesson response
    }
}
exports.lessonsService = {
    async getLessonDetail(lessonId, userId) {
        const lesson = await lessons_repository_1.lessonsRepository.findById(lessonId);
        if (!lesson)
            throw new errors_1.NotFoundError('Lesson not found');
        const courseId = await lessons_repository_1.lessonsRepository.getCourseIdByLessonId(lessonId);
        let locked = !lesson.is_preview;
        let completed = false;
        if (userId && courseId) {
            const enrollment = await enrollments_repository_1.enrollmentsRepository.findByUserAndCourse(userId, courseId);
            if (enrollment) {
                locked = false;
                const progress = await lesson_progress_repository_1.lessonProgressRepository.findByUserAndLesson(userId, lessonId);
                completed = progress?.is_completed || false;
            }
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
            video_url: signVideoUrl(lesson.video_url), // ✅ SAS signed
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