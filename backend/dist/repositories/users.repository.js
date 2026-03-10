"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.usersRepository = {
    async findByEmail(email) {
        const result = await database_1.default.query(`SELECT u.*, r.name as role_name FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       WHERE u.email = $1`, [email]);
        return result.rows[0] || null;
    },
    async findById(id) {
        const result = await database_1.default.query(`SELECT u.*, r.name as role_name FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1`, [id]);
        return result.rows[0] || null;
    },
    async create(fullName, email, hashedPassword) {
        // Get the student role id (default for new users)
        const roleResult = await database_1.default.query(`SELECT id FROM roles WHERE name = 'student' LIMIT 1`);
        const studentRoleId = roleResult.rows[0]?.id || null;
        const result = await database_1.default.query(`INSERT INTO users (name, email, password_hash, role_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [fullName, email, hashedPassword, studentRoleId]);
        const user = result.rows[0];
        // Fetch with role name
        return (await this.findById(user.id));
    },
    async updateProfile(id, data) {
        const fields = [];
        const values = [];
        let idx = 1;
        if (data.full_name !== undefined) {
            fields.push(`name = $${idx++}`);
            values.push(data.full_name);
        }
        if (fields.length === 0)
            return this.findById(id);
        values.push(id);
        await database_1.default.query(`UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}`, values);
        return this.findById(id);
    },
    async updatePassword(id, hashedPassword) {
        await database_1.default.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [hashedPassword, id]);
    },
    async countAll() {
        const result = await database_1.default.query(`SELECT COUNT(*) FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name = 'student'`);
        return parseInt(result.rows[0].count, 10);
    },
};
//# sourceMappingURL=users.repository.js.map