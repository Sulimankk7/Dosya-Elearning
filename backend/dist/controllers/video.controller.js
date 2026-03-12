"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoController = void 0;
const lessons_repository_1 = require("../repositories/lessons.repository");
const enrollments_repository_1 = require("../repositories/enrollments.repository");
const azure_sas_1 = require("../utils/azure-sas");
exports.videoController = {
    async getSas(req, res) {
        try {
            const lessonId = req.params.lessonId;
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const lesson = await lessons_repository_1.lessonsRepository.findById(lessonId);
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
                const courseId = await lessons_repository_1.lessonsRepository.getCourseIdByLessonId(lessonId);
                if (!courseId) {
                    res.status(404).json({ error: 'Course not found for this lesson' });
                    return;
                }
                const enrollment = await enrollments_repository_1.enrollmentsRepository.findByUserAndCourse(userId, courseId);
                if (!enrollment) {
                    res.status(403).json({ error: 'Not enrolled in this course' });
                    return;
                }
            }
            console.log(`[VIDEO ACCESS] User ${userId} requested SAS for lesson ${lessonId} (${lesson.video_url})`);
            // Use the lesson's duration (default to 60 if null) to calculate expiring SAS
            const durationMinutes = lesson.duration_minutes || 60;
            // Generate the SAS URL dynamically
            const sasUrl = (0, azure_sas_1.generateVideoSas)(lesson.video_url, durationMinutes);
            res.json({ url: sasUrl });
        }
        catch (error) {
            console.error('[VIDEO CONTROLLER] Error generating SAS:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
//# sourceMappingURL=video.controller.js.map