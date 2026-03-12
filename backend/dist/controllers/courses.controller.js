"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coursesController = void 0;
const courses_service_1 = require("../services/courses.service");
exports.coursesController = {
    async listCourses(req, res, next) {
        try {
            const courses = await courses_service_1.coursesService.listCourses();
            res.setHeader('Cache-Control', 'public, max-age=300');
            res.json(courses);
        }
        catch (error) {
            next(error);
        }
    },
    async getDetail(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const result = await courses_service_1.coursesService.getCourseDetail(id, userId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async getContent(req, res, next) {
        try {
            const { id } = req.params;
            const result = await courses_service_1.coursesService.getCourseContent(id, req.user.userId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=courses.controller.js.map