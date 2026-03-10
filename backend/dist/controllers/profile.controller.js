"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileController = void 0;
const profile_service_1 = require("../services/profile.service");
exports.profileController = {
    async getProfile(req, res, next) {
        try {
            const result = await profile_service_1.profileService.getProfile(req.user.userId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async updateProfile(req, res, next) {
        try {
            const { full_name } = req.body;
            const result = await profile_service_1.profileService.updateProfile(req.user.userId, { full_name });
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async changePassword(req, res, next) {
        try {
            const { current_password, new_password } = req.body;
            const result = await profile_service_1.profileService.changePassword(req.user.userId, current_password, new_password);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=profile.controller.js.map