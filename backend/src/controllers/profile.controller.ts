import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service';

export const profileController = {
    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await profileService.getProfile(req.user!.userId);
            res.json(result);
        } catch (error) { next(error); }
    },

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { full_name } = req.body;
            const result = await profileService.updateProfile(req.user!.userId, { full_name });
            res.json(result);
        } catch (error) { next(error); }
    },

    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { current_password, new_password } = req.body;
            const result = await profileService.changePassword(req.user!.userId, current_password, new_password);
            res.json(result);
        } catch (error) { next(error); }
    },
};
