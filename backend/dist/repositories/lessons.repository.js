"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonsRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.lessonsRepository = {
    async findBySectionId(sectionId) {
        const result = await database_1.default.query(`SELECT * FROM lessons WHERE section_id = $1 ORDER BY order_index ASC`, [sectionId]);
        return result.rows;
    },
    async findByCourseId(courseId) {
        const result = await database_1.default.query(`SELECT l.* FROM lessons l
       JOIN course_sections cs ON cs.id = l.section_id
       WHERE cs.course_id = $1
       ORDER BY cs.order_index ASC, l.order_index ASC`, [courseId]);
        return result.rows;
    },
    async findById(id) {
        const result = await database_1.default.query(`SELECT * FROM lessons WHERE id = $1`, [id]);
        return result.rows[0] || null;
    },
    async create(data) {
        const order = data.order_index ?? (await this.getNextOrderIndex(data.section_id));
        const result = await database_1.default.query(`INSERT INTO lessons (section_id, title, duration_minutes, video_url, is_preview, order_index)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [data.section_id, data.title, data.duration_minutes || null, data.video_url || null,
            data.is_preview || false, order]);
        return result.rows[0];
    },
    async update(id, data) {
        const fields = [];
        const values = [];
        let idx = 1;
        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = $${idx++}`);
            values.push(value);
        }
        if (fields.length === 0)
            return this.findById(id);
        values.push(id);
        await database_1.default.query(`UPDATE lessons SET ${fields.join(', ')} WHERE id = $${idx}`, values);
        return this.findById(id);
    },
    async delete(id) {
        await database_1.default.query(`DELETE FROM lessons WHERE id = $1`, [id]);
    },
    async countByCourseId(courseId) {
        const result = await database_1.default.query(`SELECT COUNT(*) FROM lessons l
       JOIN course_sections cs ON cs.id = l.section_id
       WHERE cs.course_id = $1`, [courseId]);
        return parseInt(result.rows[0].count, 10);
    },
    async getNextOrderIndex(sectionId) {
        const result = await database_1.default.query(`SELECT COALESCE(MAX(order_index), -1) + 1 as next_order
       FROM lessons WHERE section_id = $1`, [sectionId]);
        return result.rows[0].next_order;
    },
    async getCourseIdByLessonId(lessonId) {
        const result = await database_1.default.query(`SELECT cs.course_id FROM lessons l
       JOIN course_sections cs ON cs.id = l.section_id
       WHERE l.id = $1`, [lessonId]);
        return result.rows[0]?.course_id || null;
    },
    async getLessonDetailWithContext(lessonId, userId) {
        let query = `
            SELECT 
                l.id, l.title, l.duration_minutes, l.video_url, l.description, l.is_preview,
                cs.course_id
            FROM lessons l
            JOIN course_sections cs ON cs.id = l.section_id
            WHERE l.id = $1
        `;
        let params = [lessonId];
        if (userId) {
            query = `
                SELECT 
                    l.id, l.title, l.duration_minutes, l.video_url, l.description, l.is_preview,
                    cs.course_id,
                    (SELECT COUNT(*) > 0 FROM enrollments e WHERE e.user_id = $2 AND e.course_id = cs.course_id) as is_enrolled,
                    (SELECT lp.is_completed FROM lesson_progress lp WHERE lp.user_id = $2 AND lp.lesson_id = l.id LIMIT 1) as is_completed
                FROM lessons l
                JOIN course_sections cs ON cs.id = l.section_id
                WHERE l.id = $1
            `;
            params.push(userId);
        }
        const result = await database_1.default.query(query, params);
        return result.rows[0] || null;
    }
};
//# sourceMappingURL=lessons.repository.js.map