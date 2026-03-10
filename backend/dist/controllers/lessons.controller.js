"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonsController = void 0;
const lessons_service_1 = require("../services/lessons.service");
exports.lessonsController = {
    async getDetail(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const result = await lessons_service_1.lessonsService.getLessonDetail(id, userId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async updateProgress(req, res, next) {
        try {
            const { id } = req.params;
            const { completed, watched_time } = req.body;
            const result = await lessons_service_1.lessonsService.updateProgress(id, req.user.userId, { completed, watched_seconds: watched_time });
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=lessons.controller.js.map