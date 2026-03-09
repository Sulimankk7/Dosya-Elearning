import { activationCodesRepository } from '../repositories/activation-codes.repository';
import { enrollmentsRepository } from '../repositories/enrollments.repository';
import { BadRequestError, NotFoundError } from '../utils/errors';

export const activationCodesService = {
    async redeem(userId: string, code: string) {
        if (!code) throw new BadRequestError('Activation code is required');

        const activationCode = await activationCodesRepository.findByCode(code);
        if (!activationCode) throw new NotFoundError('Invalid activation code');

        if (activationCode.used_count >= activationCode.max_uses) {
            throw new BadRequestError('Activation code has been fully used');
        }

        if (activationCode.expires_at && new Date(activationCode.expires_at) < new Date()) {
            throw new BadRequestError('Activation code has expired');
        }

        // Enroll user
        await enrollmentsRepository.create(userId, activationCode.course_id);
        await activationCodesRepository.incrementUsedCount(activationCode.id);

        return {
            message: 'Successfully enrolled using activation code',
            course_id: activationCode.course_id,
        };
    },
};
