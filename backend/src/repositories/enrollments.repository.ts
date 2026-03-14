import pool from '../config/database';

export interface EnrollmentRow {
    id: string;
    user_id: string;
    course_id: string;
    enrolled_at: Date;
    progress_percent: number;
}

export const enrollmentsRepository = {
    async findByUserAndCourse(userId: string, courseId: string): Promise<EnrollmentRow | null> {
        const result = await pool.query(
            `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
            [userId, courseId]
        );
        return result.rows[0] || null;
    },

    async findByUserId(userId: string): Promise<EnrollmentRow[]> {
        const result = await pool.query(
            `SELECT * FROM enrollments WHERE user_id = $1 ORDER BY enrolled_at DESC`,
            [userId]
        );
        return result.rows;
    },

    async create(userId: string, courseId: string): Promise<EnrollmentRow> {
        // FIX: The original did SELECT then INSERT — 2 round trips.
        // INSERT ON CONFLICT handles duplicates atomically in 1 round trip.
        //
        // REQUIRED: Add this unique constraint to your database once:
        //   ALTER TABLE enrollments
        //     ADD CONSTRAINT enrollments_user_course_unique UNIQUE (user_id, course_id);
        const result = await pool.query(
            `INSERT INTO enrollments (user_id, course_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, course_id) DO UPDATE SET enrolled_at = enrollments.enrolled_at
             RETURNING *`,
            [userId, courseId]
        );
        return result.rows[0];
    },

    async countByCourseId(courseId: string): Promise<number> {
        const result = await pool.query(
            `SELECT COUNT(*) FROM enrollments WHERE course_id = $1`,
            [courseId]
        );
        return parseInt(result.rows[0].count, 10);
    },

    async countByUserId(userId: string): Promise<number> {
        const result = await pool.query(
            `SELECT COUNT(*) FROM enrollments WHERE user_id = $1`,
            [userId]
        );
        return parseInt(result.rows[0].count, 10);
    },

    async getMyCoursesWithStats(userId: string): Promise<any[]> {
        // FIX: The original used 3 correlated subqueries per row:
        //   (SELECT COUNT(*) FROM enrollments e2 WHERE e2.course_id = c.id)
        //   (SELECT COUNT(*) FROM lessons l JOIN ... WHERE cs.course_id = c.id)
        //   (SELECT COUNT(*) FROM lesson_progress lp JOIN ... WHERE lp.user_id = $1 ...)
        //
        // Each subquery ran once per enrolled course — so for a student with 5 courses,
        // that was 15 hidden sub-executions inside 1 SQL call.
        //
        // Replaced with explicit LEFT JOINs and conditional aggregation.
        // The entire result is now computed in a single database pass.
        const query = `
            SELECT
                c.id, c.title, c.description, c.price, c.thumbnail_url,
                c.instructor_name, c.duration_hours,
                COUNT(DISTINCT e2.id)::int                                          AS student_count,
                COUNT(DISTINCT l.id)::int                                           AS total_lessons,
                COUNT(DISTINCT CASE WHEN lp.is_completed = true THEN lp.id END)::int AS completed_lessons
            FROM enrollments e
            JOIN courses c ON c.id = e.course_id
            LEFT JOIN enrollments e2 ON e2.course_id = c.id
            LEFT JOIN course_sections cs ON cs.course_id = c.id
            LEFT JOIN lessons l ON l.section_id = cs.id
            LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1
            WHERE e.user_id = $1
            GROUP BY c.id, e.enrolled_at
            ORDER BY e.enrolled_at DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    },
};