import express from 'express';
import { createCourseController, getCoursesController, updateCourseController, deleteCourseController, enrollCourseController, unenrollCourseController } from '../controllers/coursecontroller.js';
import { authMiddleware, authorizeRoles } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('instructor', 'admin'), createCourseController);
router.get('/', getCoursesController);
router.put('/:id', authMiddleware, authorizeRoles('instructor', 'admin'), updateCourseController);
router.delete('/:id', authMiddleware, authorizeRoles('instructor', 'admin'), deleteCourseController);
router.post('/:id/enroll', authMiddleware, authorizeRoles('student'), enrollCourseController);
router.post('/:id/unenroll', authMiddleware, authorizeRoles('student'), unenrollCourseController);

export default router;