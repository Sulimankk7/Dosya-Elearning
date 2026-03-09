import { Request, Response, NextFunction } from 'express';
import { lessonsService } from '../services/lessons.service';

export const lessonsController = {
    async getDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const result = await lessonsService.getLessonDetail(id, userId);
            res.json(result);
        } catch (error) { next(error); }
    },

    async updateProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { completed, watched_time } = req.body;
            const result = await lessonsService.updateProgress(id, req.user!.userId, { completed, watched_seconds: watched_time });
            res.json(result);
        } catch (error) { next(error); }
    },
};
