import { Request, Response, NextFunction } from 'express';
export declare const adminController: {
    dashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    listCourses(req: Request, res: Response, next: NextFunction): Promise<void>;
    createCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
    createSection(req: Request, res: Response, next: NextFunction): Promise<void>;
    createLesson(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateLesson(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteLesson(req: Request, res: Response, next: NextFunction): Promise<void>;
    getLessonsByCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
    createActivationCode(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=admin.controller.d.ts.map