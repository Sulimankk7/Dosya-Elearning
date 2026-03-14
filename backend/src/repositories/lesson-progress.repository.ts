import pool from '../config/database';

export interface LessonProgressRow {
    id: string;
    user_id: string;
    lesson_id: string;
    is_completed: boolean;
    watched_seconds: number;
}

export const lessonProgressRepository = {
    async findByUserAndLesson(userId: string, lessonId: string): Promise<LessonProgressRow | null> {
        const result = await pool.query(
            `SELECT * FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2`,
            [userId, lessonId]
        );
        return result.rows[0] || null;
    },

    async findByUserAndCourse(userId: string, courseId: string): Promise<LessonProgressRow[]> {
        const result = await pool.query(
            `SELECT lp.* FROM lesson_progress lp
             JOIN lessons l ON l.id = lp.lesson_id
             JOIN course_sections cs ON cs.id = l.section_id
             WHERE lp.user_id = $1 AND cs.course_id = $2`,
            [userId, courseId]
        );
        return result.rows;
    },

    async upsert(userId: string, lessonId: string, data: {
        is_completed?: boolean;
        watched_seconds?: number;
    }): Promise<LessonProgressRow> {
        // FIX: The original did SELECT then INSERT or UPDATE — 2 round trips minimum,
        // 3 when the record exists. Replaced with a true upsert using INSERT ON CONFLICT.
        //
        // REQUIRED: Add this unique constraint to your database once:
        //   ALTER TABLE lesson_progress
        //     ADD CONSTRAINT lesson_progress_user_lesson_unique UNIQUE (user_id, lesson_id);
        //
        // This makes the upsert atomic and reduces 2-3 queries → 1 query.
        const result = await pool.query(
            `INSERT INTO lesson_progress (user_id, lesson_id, is_completed, watched_seconds)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, lesson_id) DO UPDATE
               SET is_completed    = COALESCE(EXCLUDED.is_completed, lesson_progress.is_completed),
                   watched_seconds = COALESCE(EXCLUDED.watched_seconds, lesson_progress.watched_seconds)
             RETURNING *`,
            [userId, lessonId, data.is_completed ?? false, data.watched_seconds ?? 0]
        );
        return result.rows[0];
    },

    async countCompletedByUser(userId: string): Promise<number> {
        const result = await pool.query(
            `SELECT COUNT(*) FROM lesson_progress WHERE user_id = $1 AND is_completed = true`,
            [userId]
        );
        return parseInt(result.rows[0].count, 10);
    },

    async countCompletedByUserAndCourse(userId: string, courseId: string): Promise<number> {
        const result = await pool.query(
            `SELECT COUNT(*) FROM lesson_progress lp
             JOIN lessons l ON l.id = lp.lesson_id
             JOIN course_sections cs ON cs.id = l.section_id
             WHERE lp.user_id = $1 AND cs.course_id = $2 AND lp.is_completed = true`,
            [userId, courseId]
        );
        return parseInt(result.rows[0].count, 10);
    },

    async countCompletedByUserAndSection(userId: string, sectionId: string): Promise<number> {
        const result = await pool.query(
            `SELECT COUNT(*) FROM lesson_progress lp
             JOIN lessons l ON l.id = lp.lesson_id
             WHERE lp.user_id = $1 AND l.section_id = $2 AND lp.is_completed = true`,
            [userId, sectionId]
        );
        return parseInt(result.rows[0].count, 10);
    },
};