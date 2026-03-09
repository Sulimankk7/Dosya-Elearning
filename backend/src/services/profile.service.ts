import { usersRepository } from '../repositories/users.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../utils/errors';

export const profileService = {
    async getProfile(userId: string) {
        const user = await usersRepository.findById(userId);
        if (!user) throw new NotFoundError('User not found');

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

    async updateProfile(userId: string, data: { full_name?: string }) {
        const user = await usersRepository.updateProfile(userId, data);
        if (!user) throw new NotFoundError('User not found');

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

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        if (!currentPassword || !newPassword) {
            throw new BadRequestError('Current and new passwords are required');
        }

        const user = await usersRepository.findById(userId);
        if (!user) throw new NotFoundError('User not found');

        const valid = await comparePassword(currentPassword, user.password_hash);
        if (!valid) throw new UnauthorizedError('Current password is incorrect');

        const hashed = await hashPassword(newPassword);
        await usersRepository.updatePassword(userId, hashed);

        return { message: 'Password updated successfully' };
    },
};
