import { Request, Response, NextFunction } from 'express';
import { enrollmentsService } from '../services/enrollments.service';

export const enrollmentsController = {
    async enroll(req: Request, res: Response, next: NextFunction) {
        try {
            const { course_id } = req.body;
            const result = await enrollmentsService.enroll(req.user!.userId, course_id);
            res.status(201).json(result);
        } catch (error) { next(error); }
    },

    async myCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await enrollmentsService.getMyCourses(req.user!.userId);
            res.json(result);
        } catch (error) { next(error); }
    },
};
