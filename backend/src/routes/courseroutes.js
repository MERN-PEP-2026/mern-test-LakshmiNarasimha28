import express from 'express';
import { createCourseController, getCoursesController, updateCourseController, deleteCourseController } from '../controllers/coursecontroller.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createCourseController);
router.get('/', getCoursesController);
router.put('/:id', authMiddleware, updateCourseController);
router.delete('/:id', authMiddleware, deleteCourseController);

export default router;