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
        // Check if already enrolled (no unique constraint in DB)
        const existing = await this.findByUserAndCourse(userId, courseId);
        if (existing) return existing;

        const result = await pool.query(
            `INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)
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
};
