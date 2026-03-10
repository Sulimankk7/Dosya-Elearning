"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activationCodesRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.activationCodesRepository = {
    async findByCode(code) {
        const result = await database_1.default.query(`SELECT * FROM activation_codes WHERE code = $1`, [code]);
        return result.rows[0] || null;
    },
    async create(data) {
        const result = await database_1.default.query(`INSERT INTO activation_codes (code, course_id, max_uses, expires_at)
       VALUES ($1, $2, $3, $4) RETURNING *`, [data.code, data.course_id, data.max_uses || 1, data.expires_at || null]);
        return result.rows[0];
    },
    async incrementUsedCount(id) {
        await database_1.default.query(`UPDATE activation_codes SET used_count = used_count + 1 WHERE id = $1`, [id]);
    },
    async findAll() {
        const result = await database_1.default.query(`SELECT * FROM activation_codes ORDER BY code ASC`);
        return result.rows;
    },
};
//# sourceMappingURL=activation-codes.repository.js.map