import { usersRepository } from '../repositories/users.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { BadRequestError, ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';

export const authService = {
    async register(fullName: string, email: string, password: string) {
        if (!fullName || !email || !password) {
            throw new BadRequestError('Full name, email, and password are required');
        }

        const existing = await usersRepository.findByEmail(email);
        if (existing) throw new ConflictError('Email already registered');

        const hashedPassword = await hashPassword(password);
        const user = await usersRepository.create(fullName, email, hashedPassword);

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

    async login(email: string, password: string) {
        if (!email || !password) {
            throw new BadRequestError('Email and password are required');
        }

        const user = await usersRepository.findByEmail(email);
        if (!user) throw new UnauthorizedError('Invalid email or password');

        const valid = await comparePassword(password, user.password_hash);
        if (!valid) throw new UnauthorizedError('Invalid email or password');

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

    async getCurrentUser(userId: string) {
        const user = await usersRepository.findById(userId);
        if (!user) throw new NotFoundError('User not found');

        return {
            id: user.id,
            full_name: user.name,
            email: user.email,
            role: user.role_name ?? 'student',
            avatar_url: user.avatar_url,
        };
    },
};