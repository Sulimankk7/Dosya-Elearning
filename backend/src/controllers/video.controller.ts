import { Request, Response } from 'express';
import { lessonsRepository } from '../repositories/lessons.repository';
import { enrollmentsRepository } from '../repositories/enrollments.repository';
import { generateVideoSas } from '../utils/azure-sas';

export const videoController = {
    async getSas(req: Request, res: Response): Promise<void> {
        try {
            const lessonId = req.params.lessonId;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const lesson = await lessonsRepository.findById(lessonId);
            if (!lesson) {
                res.status(404).json({ error: 'Lesson not found' });
                return;
            }

            if (!lesson.video_url) {
                res.status(404).json({ error: 'No video associated with this lesson' });
                return;
            }

            // If it's not a preview, check enrollment
            if (!lesson.is_preview) {
                const courseId = await lessonsRepository.getCourseIdByLessonId(lessonId);
                if (!courseId) {
                    res.status(404).json({ error: 'Course not found for this lesson' });
                    return;
                }

                const enrollment = await enrollmentsRepository.findByUserAndCourse(userId, courseId);
                if (!enrollment) {
                    res.status(403).json({ error: 'Not enrolled in this course' });
                    return;
                }
            }

            console.log(`[VIDEO ACCESS] User ${userId} requested SAS for lesson ${lessonId} (${lesson.video_url})`);

            // Use the lesson's duration (default to 60 if null) to calculate expiring SAS
            const durationMinutes = lesson.duration_minutes || 60;

            // Generate the SAS URL dynamically
            const sasUrl = generateVideoSas(lesson.video_url, durationMinutes);

            res.json({ url: sasUrl });
        } catch (error: any) {
            console.error('[VIDEO CONTROLLER] Error generating SAS:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
