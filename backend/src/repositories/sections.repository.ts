import pool from '../config/database';

export interface SectionRow {
    id: string;
    course_id: string;
    title: string;
    order_index: number;
}

export const sectionsRepository = {
    async findByCourseId(courseId: string): Promise<SectionRow[]> {
        const result = await pool.query(
            `SELECT * FROM course_sections WHERE course_id = $1 ORDER BY order_index ASC`,
            [courseId]
        );
        return result.rows;
    },

    async create(courseId: string, title: string, orderIndex?: number): Promise<SectionRow> {
        const order = orderIndex ?? (await this.getNextOrderIndex(courseId));
        const result = await pool.query(
            `INSERT INTO course_sections (course_id, title, order_index)
       VALUES ($1, $2, $3) RETURNING *`,
            [courseId, title, order]
        );
        return result.rows[0];
    },

    async update(id: string, title: string): Promise<SectionRow | null> {
        const result = await pool.query(
            `UPDATE course_sections SET title = $1 WHERE id = $2 RETURNING *`,
            [title, id]
        );
        return result.rows[0] || null;
    },

    async delete(id: string): Promise<void> {
        await pool.query(`DELETE FROM course_sections WHERE id = $1`, [id]);
    },

    async getNextOrderIndex(courseId: string): Promise<number> {
        const result = await pool.query(
            `SELECT COALESCE(MAX(order_index), -1) + 1 as next_order
       FROM course_sections WHERE course_id = $1`,
            [courseId]
        );
        return result.rows[0].next_order;
    },
};
