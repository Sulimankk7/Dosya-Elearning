"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const users_repository_1 = require("../repositories/users.repository");
const password_1 = require("../utils/password");
const errors_1 = require("../utils/errors");
exports.authService = {
    async register(fullName, email, password) {
        if (!fullName || !email || !password) {
            throw new errors_1.BadRequestError('Full name, email, and password are required');
        }
        const existing = await users_repository_1.usersRepository.findByEmail(email);
        if (existing)
            throw new errors_1.ConflictError('Email already registered');
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const user = await users_repository_1.usersRepository.create(fullName, email, hashedPassword);
        return {
            user: {
                id: user.id,
                full_name: user.name,
                email: user.email,
                role: user.role_name ?? 'student',
                avatar_url: user.avatar_url,
            },
        };
    },
    async login(email, password) {
        if (!email || !password) {
            throw new errors_1.BadRequestError('Email and password are required');
        }
        const user = await users_repository_1.usersRepository.findByEmail(email);
        if (!user)
            throw new errors_1.UnauthorizedError('Invalid email or password');
        const valid = await (0, password_1.comparePassword)(password, user.password_hash);
        if (!valid)
            throw new errors_1.UnauthorizedError('Invalid email or password');
        return {
            user: {
                id: user.id,
                full_name: user.name,
                email: user.email,
                role: user.role_name ?? 'student',
                avatar_url: user.avatar_url,
            },
        };
    },
    async getCurrentUser(userId) {
        const user = await users_repository_1.usersRepository.findById(userId);
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        return {
            id: user.id,
            full_name: user.name,
            email: user.email,
            role: user.role_name ?? 'student',
            avatar_url: user.avatar_url,
        };
    },
};
//# sourceMappingURL=auth.service.js.map