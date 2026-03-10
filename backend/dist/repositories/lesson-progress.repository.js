"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonProgressRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.lessonProgressRepository = {
    async findByUserAndLesson(userId, lessonId) {
        const result = await database_1.default.query(`SELECT * FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2`, [userId, lessonId]);
        return result.rows[0] || null;
    },
    async findByUserAndCourse(userId, courseId) {
        const result = await database_1.default.query(`SELECT lp.* FROM lesson_progress lp
       JOIN lessons l ON l.id = lp.lesson_id
       JOIN course_sections cs ON cs.id = l.section_id
       WHERE lp.user_id = $1 AND cs.course_id = $2`, [userId, courseId]);
        return result.rows;
    },
    async upsert(userId, lessonId, data) {
        // Check if record exists (no unique constraint in DB)
        const existing = await this.findByUserAndLesson(userId, lessonId);
        if (existing) {
            const result = await database_1.default.query(`UPDATE lesson_progress
         SET is_completed = COALESCE($1, is_completed),
             watched_seconds = COALESCE($2, watched_seconds)
         WHERE user_id = $3 AND lesson_id = $4
         RETURNING *`, [data.is_completed ?? existing.is_completed, data.watched_seconds ?? existing.watched_seconds,
                userId, lessonId]);
            return result.rows[0];
        }
        const result = await database_1.default.query(`INSERT INTO lesson_progress (user_id, lesson_id, is_completed, watched_seconds)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [userId, lessonId, data.is_completed ?? false, data.watched_seconds ?? 0]);
        return result.rows[0];
    },
    async countCompletedByUser(userId) {
        const result = await database_1.default.query(`SELECT COUNT(*) FROM lesson_progress WHERE user_id = $1 AND is_completed = true`, [userId]);
        return parseInt(result.rows[0].count, 10);
    },
    async countCompletedByUserAndCourse(userId, courseId) {
        const result = await database_1.default.query(`SELECT COUNT(*) FROM lesson_progress lp
       JOIN lessons l ON l.id = lp.lesson_id
       JOIN course_sections cs ON cs.id = l.section_id
       WHERE lp.user_id = $1 AND cs.course_id = $2 AND lp.is_completed = true`, [userId, courseId]);
        return parseInt(result.rows[0].count, 10);
    },
    async countCompletedByUserAndSection(userId, sectionId) {
        const result = await database_1.default.query(`SELECT COUNT(*) FROM lesson_progress lp
       JOIN lessons l ON l.id = lp.lesson_id
       WHERE lp.user_id = $1 AND l.section_id = $2 AND lp.is_completed = true`, [userId, sectionId]);
        return parseInt(result.rows[0].count, 10);
    },
};
//# sourceMappingURL=lesson-progress.repository.js.map