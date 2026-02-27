import Course from '../models/course.js';
import User from '../models/user.js';

export const createCourse = async (courseName, courseDescription, instructor, dateOfCourse, userId) => {
    if (!courseName || !courseDescription || !instructor || !dateOfCourse) {
        throw new Error('All fields are required');
    }

    const parsedDate = new Date(dateOfCourse);
    if (Number.isNaN(parsedDate.getTime())) {
        throw new Error('Invalid course date');
    }

    const course = await Course.create({
        courseName,
        courseDescription,
        instructor,
        dateOfCourse: parsedDate,
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

export const updateCourse = async (courseId, userId, role, courseName, courseDescription, instructor, dateOfCourse) => {
    const course = await Course.findById(courseId);

    if (!course) {
        throw new Error('Course not found');
    }

    if (role !== 'admin' && course.createdBy.toString() !== userId) {
        throw new Error('Unauthorized - Only creator can edit');
    }

    if (!courseName && !courseDescription && !instructor && !dateOfCourse) {
        throw new Error('At least one field must be updated');
    }

    if (courseName) course.courseName = courseName;
    if (courseDescription) course.courseDescription = courseDescription;
    if (instructor) course.instructor = instructor;
    if (dateOfCourse) {
        const parsedDate = new Date(dateOfCourse);
        if (Number.isNaN(parsedDate.getTime())) {
            throw new Error('Invalid course date');
        }
        course.dateOfCourse = parsedDate;
    }

    await course.save();
    return course;
};

export const deleteCourse = async (courseId, userId, role) => {
    const course = await Course.findById(courseId);

    if (!course) {
        throw new Error('Course not found');
    }

    if (role !== 'admin' && course.createdBy.toString() !== userId) {
        throw new Error('Unauthorized - Only creator can delete');
    }

    await Course.findByIdAndDelete(courseId);
    return { success: true };
};

export const enrollCourse = async (courseId, userId) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw new Error('Course not found');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const alreadyEnrolled = user.enrolledCourses.some(
        (enrolledId) => enrolledId.toString() === courseId
    );

    if (alreadyEnrolled) {
        return { message: 'Already enrolled in this course' };
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    return { message: 'Course enrolled successfully' };
};

export const unenrollCourse = async (courseId, userId) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw new Error('Course not found');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const isEnrolled = user.enrolledCourses.some(
        (enrolledId) => enrolledId.toString() === courseId
    );

    if (!isEnrolled) {
        return { message: 'Not enrolled in this course' };
    }

    user.enrolledCourses = user.enrolledCourses.filter(
        (enrolledId) => enrolledId.toString() !== courseId
    );
    await user.save();

    return { message: 'Course unenrolled successfully' };
};
