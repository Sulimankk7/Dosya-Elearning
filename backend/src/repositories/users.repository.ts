import pool from '../config/database';

export interface UserRow {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    avatar_url: string | null;
    role_id: string | null;
    role_name?: string;
}

export const usersRepository = {
    async findByEmail(email: string): Promise<UserRow | null> {
        const result = await pool.query(
            `SELECT u.*, r.name as role_name FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       WHERE u.email = $1`,
            [email]
        );
        return result.rows[0] || null;
    },

    async findById(id: string): Promise<UserRow | null> {
        const result = await pool.query(
            `SELECT u.*, r.name as role_name FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1`,
            [id]
        );
        return result.rows[0] || null;
    },

    async create(fullName: string, email: string, hashedPassword: string): Promise<UserRow> {
        // Get the student role id (default for new users)
        const roleResult = await pool.query(
            `SELECT id FROM roles WHERE name = 'student' LIMIT 1`
        );
        const studentRoleId = roleResult.rows[0]?.id || null;

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [fullName, email, hashedPassword, studentRoleId]
        );
        const user = result.rows[0];
        // Fetch with role name
        return (await this.findById(user.id))!;
    },

    async updateProfile(id: string, data: { full_name?: string }): Promise<UserRow | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (data.full_name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.full_name); }

        if (fields.length === 0) return this.findById(id);

        values.push(id);

        await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}`,
            values
        );
        return this.findById(id);
    },

    async updatePassword(id: string, hashedPassword: string): Promise<void> {
        await pool.query(
            `UPDATE users SET password_hash = $1 WHERE id = $2`,
            [hashedPassword, id]
        );
    },

    async countAll(): Promise<number> {
        const result = await pool.query(
            `SELECT COUNT(*) FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name = 'student'`
        );
        return parseInt(result.rows[0].count, 10);
    },
};
