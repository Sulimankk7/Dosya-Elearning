import { lessonsRepository } from '../repositories/lessons.repository';
import { lessonProgressRepository } from '../repositories/lesson-progress.repository';
import { enrollmentsRepository } from '../repositories/enrollments.repository';
import { NotFoundError, ForbiddenError } from '../utils/errors';

function formatLessonDuration(minutes: number | null): string {
    if (!minutes) return '';
    return `${minutes} دقيقة`;
}

// Removed automatic SAS signing from lesson fetch; will be handled via dedicated endpoint

export const lessonsService = {
    async getLessonDetail(lessonId: string, userId?: string) {
        const lesson = await lessonsRepository.findById(lessonId);
        if (!lesson) throw new NotFoundError('Lesson not found');

        const courseId = await lessonsRepository.getCourseIdByLessonId(lessonId);
        let locked = !lesson.is_preview;
        let completed = false;

        if (userId && courseId) {
            const enrollment = await enrollmentsRepository.findByUserAndCourse(userId, courseId);
            if (enrollment) {
                locked = false;
                const progress = await lessonProgressRepository.findByUserAndLesson(userId, lessonId);
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
                video_url: null,   // never expose URL for locked lessons
                description: null,
            };
        }

        return {
            id: lesson.id,
            title: lesson.title,
            duration: formatLessonDuration(lesson.duration_minutes),
            video_url: lesson.video_url,  // Will be requested via /api/video/:id instead of full SAS here
            description: lesson.description ?? null,
            locked: false,
            completed,
        };
    },

    async updateProgress(lessonId: string, userId: string, data: {
        completed?: boolean;
        watched_seconds?: number;
    }) {
        const lesson = await lessonsRepository.findById(lessonId);
        if (!lesson) throw new NotFoundError('Lesson not found');

        const courseId = await lessonsRepository.getCourseIdByLessonId(lessonId);
        if (courseId) {
            const enrollment = await enrollmentsRepository.findByUserAndCourse(userId, courseId);
            if (!enrollment) {
                throw new ForbiddenError('Not enrolled in this course');
            }
        }

        const progress = await lessonProgressRepository.upsert(userId, lessonId, {
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