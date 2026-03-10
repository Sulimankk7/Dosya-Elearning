"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileService = void 0;
const users_repository_1 = require("../repositories/users.repository");
const password_1 = require("../utils/password");
const errors_1 = require("../utils/errors");
exports.profileService = {
    async getProfile(userId) {
        const user = await users_repository_1.usersRepository.findById(userId);
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        return {
            id: user.id,
            full_name: user.name,
            email: user.email,
            phone: '',
            bio: '',
            avatar_url: user.avatar_url,
            role: user.role_name || 'student',
        };
    },
    async updateProfile(userId, data) {
        const user = await users_repository_1.usersRepository.updateProfile(userId, data);
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        return {
            id: user.id,
            full_name: user.name,
            email: user.email,
            phone: '',
            bio: '',
            avatar_url: user.avatar_url,
            role: user.role_name || 'student',
        };
    },
    async changePassword(userId, currentPassword, newPassword) {
        if (!currentPassword || !newPassword) {
            throw new errors_1.BadRequestError('Current and new passwords are required');
        }
        const user = await users_repository_1.usersRepository.findById(userId);
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        const valid = await (0, password_1.comparePassword)(currentPassword, user.password_hash);
        if (!valid)
            throw new errors_1.UnauthorizedError('Current password is incorrect');
        const hashed = await (0, password_1.hashPassword)(newPassword);
        await users_repository_1.usersRepository.updatePassword(userId, hashed);
        return { message: 'Password updated successfully' };
    },
};
//# sourceMappingURL=profile.service.js.map