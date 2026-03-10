"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activationCodesService = void 0;
const activation_codes_repository_1 = require("../repositories/activation-codes.repository");
const enrollments_repository_1 = require("../repositories/enrollments.repository");
const errors_1 = require("../utils/errors");
exports.activationCodesService = {
    async redeem(userId, code) {
        if (!code)
            throw new errors_1.BadRequestError('Activation code is required');
        const activationCode = await activation_codes_repository_1.activationCodesRepository.findByCode(code);
        if (!activationCode)
            throw new errors_1.NotFoundError('Invalid activation code');
        if (activationCode.used_count >= activationCode.max_uses) {
            throw new errors_1.BadRequestError('Activation code has been fully used');
        }
        if (activationCode.expires_at && new Date(activationCode.expires_at) < new Date()) {
            throw new errors_1.BadRequestError('Activation code has expired');
        }
        // Enroll user
        await enrollments_repository_1.enrollmentsRepository.create(userId, activationCode.course_id);
        await activation_codes_repository_1.activationCodesRepository.incrementUsedCount(activationCode.id);
        return {
            message: 'Successfully enrolled using activation code',
            course_id: activationCode.course_id,
        };
    },
};
//# sourceMappingURL=activation-codes.service.js.map