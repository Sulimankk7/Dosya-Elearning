import { lessonsRepository } from '../repositories/lessons.repository';
import { lessonProgressRepository } from '../repositories/lesson-progress.repository';
import { enrollmentsRepository } from '../repositories/enrollments.repository';
import { NotFoundError, ForbiddenError } from '../utils/errors';

function formatLessonDuration(minutes: number | null): string {
    if (!minutes) return '';
    return `${minutes} دقيقة`;
}

export const lessonsService = {
    async getLessonDetail(lessonId: string, userId?: string) {
        const lesson = await lessonsRepository.getLessonDetailWithContext(lessonId, userId);
        if (!lesson) throw new NotFoundError('Lesson not found');

        let locked = !lesson.is_preview;
        let completed = false;

        if (userId && lesson.is_enrolled) {
            locked = false;
            completed = !!lesson.is_completed;
        }

        if (locked) {
            return {
                id:          lesson.id,
                title:       lesson.title,
                duration:    formatLessonDuration(lesson.duration_minutes),
                locked:      true,
                completed:   false,
                video_url:   null,
                description: null,
            };
        }

        return {
            id:          lesson.id,
            title:       lesson.title,
            duration:    formatLessonDuration(lesson.duration_minutes),
            video_url:   lesson.video_url,
            description: lesson.description ?? null,
            locked:      false,
            completed,
        };
    },

    async updateProgress(lessonId: string, userId: string, data: {
        completed?: boolean;
        watched_seconds?: number;
    }) {
        // FIX: The original ran 3 sequential awaits:
        //   1. lessonsRepository.findById(lessonId)
        //   2. lessonsRepository.getCourseIdByLessonId(lessonId)
        //   3. enrollmentsRepository.findByUserAndCourse(userId, courseId)  ← waited for #2
        //
        // Queries 1 and 2 are independent — run them in parallel.
        // Query 3 depends on 2's result, so it still runs after, but we've saved one
        // full round-trip on every progress update.
        const [lesson, courseId] = await Promise.all([
            lessonsRepository.findById(lessonId),
            lessonsRepository.getCourseIdByLessonId(lessonId),
        ]);

        if (!lesson) throw new NotFoundError('Lesson not found');

        if (courseId) {
            const enrollment = await enrollmentsRepository.findByUserAndCourse(userId, courseId);
            if (!enrollment) {
                throw new ForbiddenError('Not enrolled in this course');
            }
        }

        const progress = await lessonProgressRepository.upsert(userId, lessonId, {
            is_completed:   data.completed,
            watched_seconds: data.watched_seconds,
        });

        return {
            lesson_id:    progress.lesson_id,
            completed:    progress.is_completed,
            watched_time: progress.watched_seconds,
        };
    },
};