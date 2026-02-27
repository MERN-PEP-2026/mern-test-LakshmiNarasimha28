import Course from '../models/course.js';

export const createCourse = async (courseName, courseDescription, instructor, userId) => {
    if (!courseName || !courseDescription || !instructor) {
        throw new Error('All fields are required');
    }

    const course = await Course.create({
        courseName,
        courseDescription,
        instructor,
        createdBy: userId,
    });

    return course;
};

export const getCourses = async (search, instructor, createdBy, sortBy) => {
    let filter = {};

    if (search) {
        filter.courseName = { $regex: search, $options: 'i' };
    }

    if (instructor) {
        filter.instructor = { $regex: instructor, $options: 'i' };
    }

    if (createdBy) {
        filter.createdBy = createdBy;
    }

    let query = Course.find(filter).populate('createdBy', 'name email');

    if (sortBy === 'latest') {
        query = query.sort({ createdAt: -1 });
    } else if (sortBy === 'oldest') {
        query = query.sort({ createdAt: 1 });
    }

    const courses = await query;
    return courses;
};

export const updateCourse = async (courseId, userId, courseName, courseDescription, instructor) => {
    const course = await Course.findById(courseId);

    if (!course) {
        throw new Error('Course not found');
    }

    if (course.createdBy.toString() !== userId) {
        throw new Error('Unauthorized - Only creator can edit');
    }

    if (!courseName && !courseDescription && !instructor) {
        throw new Error('At least one field must be updated');
    }

    if (courseName) course.courseName = courseName;
    if (courseDescription) course.courseDescription = courseDescription;
    if (instructor) course.instructor = instructor;

    await course.save();
    return course;
};

export const deleteCourse = async (courseId, userId) => {
    const course = await Course.findById(courseId);

    if (!course) {
        throw new Error('Course not found');
    }

    if (course.createdBy.toString() !== userId) {
        throw new Error('Unauthorized - Only creator can delete');
    }

    await Course.findByIdAndDelete(courseId);
    return { success: true };
};
