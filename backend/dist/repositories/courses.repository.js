"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coursesRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.coursesRepository = {
    async findAll(publishedOnly) {
        let query = `
      SELECT
        c.id,
        c.title,
        c.description,
        c.price,
        c.thumbnail_url,
        c.instructor_name,
        c.duration_hours,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as student_count
      FROM courses c
    `;
        if (publishedOnly) {
            query += ` WHERE c.is_published = true`;
        }
        query += ` ORDER BY c.title ASC`;
        const result = await database_1.default.query(query);
        return result.rows.map(normalizeRow);
    },
    async findById(id) {
        const result = await database_1.default.query(`SELECT c.*,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as student_count
       FROM courses c WHERE c.id = $1`, [id]);
        if (!result.rows[0])
            return null;
        return normalizeRow(result.rows[0]);
    },
    async findBySlug(slug) {
        const result = await database_1.default.query(`SELECT c.*,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as student_count
       FROM courses c WHERE c.slug = $1`, [slug]);
        if (!result.rows[0])
            return null;
        return normalizeRow(result.rows[0]);
    },
    async create(data) {
        const result = await database_1.default.query(`INSERT INTO courses (title, slug, description, price, thumbnail_url,
        instructor_name, duration_hours, level, is_published,
        rating, rating_count, what_you_learn)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`, [
            data.title,
            data.slug,
            data.description ?? null,
            data.price ?? 0,
            data.thumbnail_url ?? null,
            data.instructor_name ?? null,
            data.duration_hours ?? 0,
            data.level ?? 'Beginner',
            data.is_published ?? false,
            data.rating ?? 0,
            data.rating_count ?? 0,
            JSON.stringify(data.what_you_learn ?? []),
        ]);
        return normalizeRow(result.rows[0]);
    },
    async update(id, data) {
        const fields = [];
        const values = [];
        let idx = 1;
        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = $${idx++}`);
            // Serialize what_you_learn array to JSON for the DB
            values.push(key === 'what_you_learn' ? JSON.stringify(value) : value);
        }
        if (fields.length === 0)
            return this.findById(id);
        values.push(id);
        await database_1.default.query(`UPDATE courses SET ${fields.join(', ')} WHERE id = $${idx}`, values);
        return this.findById(id);
    },
    async delete(id) {
        await database_1.default.query(`DELETE FROM courses WHERE id = $1`, [id]);
    },
    async countAll() {
        const result = await database_1.default.query(`SELECT COUNT(*) FROM courses`);
        return parseInt(result.rows[0].count, 10);
    },
    async totalRevenue() {
        const result = await database_1.default.query(`SELECT COALESCE(SUM(c.price), 0) as total
       FROM enrollments e JOIN courses c ON c.id = e.course_id`);
        return parseFloat(result.rows[0].total);
    },
};
// ── Normalize raw DB row ──────────────────────────────────────
// what_you_learn is stored as jsonb — pg returns it already parsed,
// but guard against null / plain string just in case.
function normalizeRow(row) {
    let what_you_learn = [];
    if (Array.isArray(row.what_you_learn)) {
        what_you_learn = row.what_you_learn;
    }
    else if (typeof row.what_you_learn === 'string') {
        try {
            what_you_learn = JSON.parse(row.what_you_learn);
        }
        catch {
            what_you_learn = [];
        }
    }
    return {
        ...row,
        rating: parseFloat(String(row.rating ?? 0)),
        rating_count: parseInt(String(row.rating_count ?? 0), 10),
        what_you_learn,
    };
}
//# sourceMappingURL=courses.repository.js.map