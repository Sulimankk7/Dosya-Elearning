import pool from '../config/database';

export interface ActivationCodeRow {
    id: string;
    code: string;
    course_id: string;
    max_uses: number;
    used_count: number;
    expires_at: Date | null;
}

export const activationCodesRepository = {
    async findByCode(code: string): Promise<ActivationCodeRow | null> {
        const result = await pool.query(
            `SELECT * FROM activation_codes WHERE code = $1`,
            [code]
        );
        return result.rows[0] || null;
    },

    async create(data: {
        code: string;
        course_id: string;
        max_uses?: number;
        expires_at?: Date;
    }): Promise<ActivationCodeRow> {
        const result = await pool.query(
            `INSERT INTO activation_codes (code, course_id, max_uses, expires_at)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [data.code, data.course_id, data.max_uses || 1, data.expires_at || null]
        );
        return result.rows[0];
    },

    async incrementUsedCount(id: string): Promise<void> {
        await pool.query(
            `UPDATE activation_codes SET used_count = used_count + 1 WHERE id = $1`,
            [id]
        );
    },

    async findAll(): Promise<ActivationCodeRow[]> {
        const result = await pool.query(
            `SELECT * FROM activation_codes ORDER BY code ASC`
        );
        return result.rows;
    },
};
