"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentsRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.enrollmentsRepository = {
    async findByUserAndCourse(userId, courseId) {
        const result = await database_1.default.query(`SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`, [userId, courseId]);
        return result.rows[0] || null;
    },
    async findByUserId(userId) {
        const result = await database_1.default.query(`SELECT * FROM enrollments WHERE user_id = $1 ORDER BY enrolled_at DESC`, [userId]);
        return result.rows;
    },
    async create(userId, courseId) {
        // Check if already enrolled (no unique constraint in DB)
        const existing = await this.findByUserAndCourse(userId, courseId);
        if (existing)
            return existing;
        const result = await database_1.default.query(`INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)
       RETURNING *`, [userId, courseId]);
        return result.rows[0];
    },
    async countByCourseId(courseId) {
        const result = await database_1.default.query(`SELECT COUNT(*) FROM enrollments WHERE course_id = $1`, [courseId]);
        return parseInt(result.rows[0].count, 10);
    },
    async countByUserId(userId) {
        const result = await database_1.default.query(`SELECT COUNT(*) FROM enrollments WHERE user_id = $1`, [userId]);
        return parseInt(result.rows[0].count, 10);
    },
};
//# sourceMappingURL=enrollments.repository.js.map