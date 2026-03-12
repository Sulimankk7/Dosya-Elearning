import { Request, Response, NextFunction } from 'express';
import { coursesService } from '../services/courses.service';

export const coursesController = {
    async listCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const courses = await coursesService.listCourses();
            res.setHeader('Cache-Control', 'public, max-age=300');
            res.json(courses);
        } catch (error) { next(error); }
    },

    async getDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const result = await coursesService.getCourseDetail(id, userId);
            res.json(result);
        } catch (error) { next(error); }
    },

    async getContent(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await coursesService.getCourseContent(id, req.user!.userId);
            res.json(result);
        } catch (error) { next(error); }
    },
};
