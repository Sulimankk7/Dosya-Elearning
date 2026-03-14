import pool from '../config/database';

export interface CourseRow {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    thumbnail_url: string | null;
    instructor_name: string | null;
    duration_hours: number;
    level: string | null;
    students_count: number;
    is_published: boolean;
    rating: number;
    rating_count: number;
    what_you_learn: string[];
    student_count?: number;
}

export const coursesRepository = {
    async findAll(publishedOnly?: boolean): Promise<CourseRow[]> {
        // FIX: Was using a correlated subquery (SELECT COUNT(*) FROM enrollments WHERE ...)
        // which PostgreSQL evaluates once per row — effectively N+1 at the SQL level.
        // Replaced with LEFT JOIN + GROUP BY: entire count resolved in one pass.
        let query = `
            SELECT
                c.id, c.title, c.slug, c.description, c.price, c.thumbnail_url,
                c.instructor_name, c.duration_hours, c.level, c.students_count,
                c.is_published, c.rating, c.rating_count, c.what_you_learn,
                COUNT(e.id)::int AS student_count
            FROM courses c
            LEFT JOIN enrollments e ON e.course_id = c.id
        `;
        if (publishedOnly) {
            query += ` WHERE c.is_published = true`;
        }
        query += ` GROUP BY c.id ORDER BY c.title ASC`;
        const result = await pool.query(query);
        return result.rows.map(normalizeRow);
    },

    async findById(id: string): Promise<CourseRow | null> {
        // FIX: Same correlated subquery → LEFT JOIN fix
        const result = await pool.query(
            `SELECT c.*, COUNT(e.id)::int AS student_count
             FROM courses c
             LEFT JOIN enrollments e ON e.course_id = c.id
             WHERE c.id = $1
             GROUP BY c.id`,
            [id]
        );
        if (!result.rows[0]) return null;
        return normalizeRow(result.rows[0]);
    },

    async findBySlug(slug: string): Promise<CourseRow | null> {
        const result = await pool.query(
            `SELECT c.*, COUNT(e.id)::int AS student_count
             FROM courses c
             LEFT JOIN enrollments e ON e.course_id = c.id
             WHERE c.slug = $1
             GROUP BY c.id`,
            [slug]
        );
        if (!result.rows[0]) return null;
        return normalizeRow(result.rows[0]);
    },

    async create(data: {
        title: string; slug: string; description?: string; price?: number;
        thumbnail_url?: string; instructor_name?: string; duration_hours?: number;
        level?: string; is_published?: boolean; rating?: number; rating_count?: number;
        what_you_learn?: string[];
    }): Promise<CourseRow> {
        const result = await pool.query(
            `INSERT INTO courses (title, slug, description, price, thumbnail_url,
                instructor_name, duration_hours, level, is_published,
                rating, rating_count, what_you_learn)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
             RETURNING *`,
            [
                data.title, data.slug, data.description ?? null, data.price ?? 0,
                data.thumbnail_url ?? null, data.instructor_name ?? null,
                data.duration_hours ?? 0, data.level ?? 'Beginner',
                data.is_published ?? false, data.rating ?? 0, data.rating_count ?? 0,
                JSON.stringify(data.what_you_learn ?? []),
            ]
        );
        return normalizeRow(result.rows[0]);
    },

    async update(id: string, data: Partial<{
        title: string; slug: string; description: string; price: number;
        thumbnail_url: string; instructor_name: string; duration_hours: number;
        level: string; is_published: boolean; rating: number; rating_count: number;
        what_you_learn: string[];
    }>): Promise<CourseRow | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        let idx = 1;
        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = $${idx++}`);
            values.push(key === 'what_you_learn' ? JSON.stringify(value) : value);
        }
        if (fields.length === 0) return this.findById(id);
        values.push(id);
        await pool.query(`UPDATE courses SET ${fields.join(', ')} WHERE id = $${idx}`, values);
        return this.findById(id);
    },

    async delete(id: string): Promise<void> {
        await pool.query(`DELETE FROM courses WHERE id = $1`, [id]);
    },

    async countAll(): Promise<number> {
        const result = await pool.query(`SELECT COUNT(*) FROM courses`);
        return parseInt(result.rows[0].count, 10);
    },

    async totalRevenue(): Promise<number> {
        const result = await pool.query(
            `SELECT COALESCE(SUM(c.price), 0) as total
             FROM enrollments e JOIN courses c ON c.id = e.course_id`
        );
        return parseFloat(result.rows[0].total);
    },
};

function normalizeRow(row: Record<string, unknown>): CourseRow {
    let what_you_learn: string[] = [];
    if (Array.isArray(row.what_you_learn)) {
        what_you_learn = row.what_you_learn as string[];
    } else if (typeof row.what_you_learn === 'string') {
        try { what_you_learn = JSON.parse(row.what_you_learn); } catch { what_you_learn = []; }
    }
    return {
        ...(row as unknown as CourseRow),
        rating: parseFloat(String(row.rating ?? 0)),
        rating_count: parseInt(String(row.rating_count ?? 0), 10),
        what_you_learn,
    };
}