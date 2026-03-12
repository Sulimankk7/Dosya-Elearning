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
    async getMyCoursesWithStats(userId) {
        const query = `
            SELECT 
                c.id, c.title, c.description, c.price, c.thumbnail_url, c.instructor_name, c.duration_hours,
                (SELECT COUNT(*) FROM enrollments e2 WHERE e2.course_id = c.id) as student_count,
                (SELECT COUNT(*) FROM lessons l JOIN course_sections cs ON cs.id = l.section_id WHERE cs.course_id = c.id) as total_lessons,
                (SELECT COUNT(*) FROM lesson_progress lp JOIN lessons l ON l.id = lp.lesson_id JOIN course_sections cs ON cs.id = l.section_id WHERE lp.user_id = $1 AND cs.course_id = c.id AND lp.is_completed = true) as completed_lessons
            FROM enrollments e
            JOIN courses c ON c.id = e.course_id
            WHERE e.user_id = $1
            ORDER BY e.enrolled_at DESC
        `;
        const result = await database_1.default.query(query, [userId]);
        return result.rows;
    }
};
//# sourceMappingURL=enrollments.repository.js.map