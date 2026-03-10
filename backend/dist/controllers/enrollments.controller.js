"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentsController = void 0;
const enrollments_service_1 = require("../services/enrollments.service");
exports.enrollmentsController = {
    async enroll(req, res, next) {
        try {
            const { course_id } = req.body;
            const result = await enrollments_service_1.enrollmentsService.enroll(req.user.userId, course_id);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async myCourses(req, res, next) {
        try {
            const result = await enrollments_service_1.enrollmentsService.getMyCourses(req.user.userId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=enrollments.controller.js.map