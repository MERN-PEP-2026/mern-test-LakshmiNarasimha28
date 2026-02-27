import { createCourse, getCourses, updateCourse, deleteCourse, enrollCourse, unenrollCourse } from '../services/courseservice.js';

export const createCourseController = async (req, res) => {
  try {
    const { courseName, courseDescription, instructor, dateOfCourse } = req.body;
    const userId = req.user.userId;

    const course = await createCourse(courseName, courseDescription, instructor, dateOfCourse, userId);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCoursesController = async (req, res) => {
  try {
    const { search, instructor, sortBy } = req.query;

    const courses = await getCourses(search, instructor, null, sortBy);

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCourseController = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName, courseDescription, instructor, dateOfCourse } = req.body;
    const userId = req.user.userId;

    const course = await updateCourse(id, userId, req.user.role, courseName, courseDescription, instructor, dateOfCourse);

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCourseController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await deleteCourse(id, userId, req.user.role);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const enrollCourseController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await enrollCourse(id, userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Enroll error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to enroll',
    });
  }
};

export const unenrollCourseController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await unenrollCourse(id, userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};