import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';

export const adminController = {
    async dashboard(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.getDashboardStats();
            res.json(result);
        } catch (error) { next(error); }
    },

    async listCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.listAllCourses();
            res.json(result);
        } catch (error) { next(error); }
    },

    async createCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.createCourse(req.body);
            res.status(201).json(result);
        } catch (error) { next(error); }
    },

    async updateCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.updateCourse(req.params.id, req.body);
            res.json(result);
        } catch (error) { next(error); }
    },

    async deleteCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.deleteCourse(req.params.id);
            res.json(result);
        } catch (error) { next(error); }
    },

    async createSection(req: Request, res: Response, next: NextFunction) {
        try {
            const { course_id, title } = req.body;
            const result = await adminService.createSection(course_id, title);
            res.status(201).json(result);
        } catch (error) { next(error); }
    },

    async createLesson(req: Request, res: Response, next: NextFunction) {
        try {
            const { section_id, ...data } = req.body;
            const result = await adminService.createLesson(section_id, data);
            res.status(201).json(result);
        } catch (error) { next(error); }
    },

    async updateLesson(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.updateLesson(req.params.id, req.body);
            res.json(result);
        } catch (error) { next(error); }
    },

    async deleteLesson(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.deleteLesson(req.params.id);
            res.json(result);
        } catch (error) { next(error); }
    },

    async getLessonsByCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.getLessonsByCourse(req.params.courseId);
            res.json(result);
        } catch (error) { next(error); }
    },

    async createActivationCode(req: Request, res: Response, next: NextFunction) {
        try {
            const { course_id, max_uses, expires_at } = req.body;
            const result = await adminService.createActivationCode(
                course_id, max_uses, expires_at ? new Date(expires_at) : undefined
            );
            res.status(201).json(result);
        } catch (error) { next(error); }
    },
};
