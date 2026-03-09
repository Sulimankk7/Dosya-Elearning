import { Request, Response, NextFunction } from 'express';
import { activationCodesService } from '../services/activation-codes.service';

export const activationCodesController = {
    async redeem(req: Request, res: Response, next: NextFunction) {
        try {
            const { code } = req.body;
            const result = await activationCodesService.redeem(req.user!.userId, code);
            res.json(result);
        } catch (error) { next(error); }
    },
};
