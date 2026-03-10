"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const admin_service_1 = require("../services/admin.service");
exports.adminController = {
    async dashboard(req, res, next) {
        try {
            const result = await admin_service_1.adminService.getDashboardStats();
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async listCourses(req, res, next) {
        try {
            const result = await admin_service_1.adminService.listAllCourses();
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async createCourse(req, res, next) {
        try {
            const result = await admin_service_1.adminService.createCourse(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async updateCourse(req, res, next) {
        try {
            const result = await admin_service_1.adminService.updateCourse(req.params.id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async deleteCourse(req, res, next) {
        try {
            const result = await admin_service_1.adminService.deleteCourse(req.params.id);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async createSection(req, res, next) {
        try {
            const { course_id, title } = req.body;
            const result = await admin_service_1.adminService.createSection(course_id, title);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async createLesson(req, res, next) {
        try {
            const { section_id, ...data } = req.body;
            const result = await admin_service_1.adminService.createLesson(section_id, data);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async updateLesson(req, res, next) {
        try {
            const result = await admin_service_1.adminService.updateLesson(req.params.id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async deleteLesson(req, res, next) {
        try {
            const result = await admin_service_1.adminService.deleteLesson(req.params.id);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async getLessonsByCourse(req, res, next) {
        try {
            const result = await admin_service_1.adminService.getLessonsByCourse(req.params.courseId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async createActivationCode(req, res, next) {
        try {
            const { course_id, max_uses, expires_at } = req.body;
            const result = await admin_service_1.adminService.createActivationCode(course_id, max_uses, expires_at ? new Date(expires_at) : undefined);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=admin.controller.js.map