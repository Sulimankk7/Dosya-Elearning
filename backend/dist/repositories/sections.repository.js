"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionsRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.sectionsRepository = {
    async findByCourseId(courseId) {
        const result = await database_1.default.query(`SELECT * FROM course_sections WHERE course_id = $1 ORDER BY order_index ASC`, [courseId]);
        return result.rows;
    },
    async create(courseId, title, orderIndex) {
        const order = orderIndex ?? (await this.getNextOrderIndex(courseId));
        const result = await database_1.default.query(`INSERT INTO course_sections (course_id, title, order_index)
       VALUES ($1, $2, $3) RETURNING *`, [courseId, title, order]);
        return result.rows[0];
    },
    async update(id, title) {
        const result = await database_1.default.query(`UPDATE course_sections SET title = $1 WHERE id = $2 RETURNING *`, [title, id]);
        return result.rows[0] || null;
    },
    async delete(id) {
        await database_1.default.query(`DELETE FROM course_sections WHERE id = $1`, [id]);
    },
    async getNextOrderIndex(courseId) {
        const result = await database_1.default.query(`SELECT COALESCE(MAX(order_index), -1) + 1 as next_order
       FROM course_sections WHERE course_id = $1`, [courseId]);
        return result.rows[0].next_order;
    },
};
//# sourceMappingURL=sections.repository.js.map