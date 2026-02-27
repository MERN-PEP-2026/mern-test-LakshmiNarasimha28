import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Otp from '../models/otp.js';
import { generateOtp } from '../utils/generateOtp.js';
import { sendOtpEmail, sendWelcomeEmail } from '../utils/emailService.js';

const pendingRegistrations = new Map();

export const signup = async (name, email, password, role = 'student') => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    
    pendingRegistrations.set(email, { name, password, role, timestamp: Date.now() });
    
    await Otp.deleteMany({ email });
    
    const otp = generateOtp();
    await new Otp({ email, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }).save();

    const emailResult = await sendOtpEmail(email, otp);
    if (!emailResult.success) {
        console.log(`OTP for ${email}: ${otp}`);
    }

    return { message: 'OTP sent to email', email };
};

export const verifyOtp = async (email, otp) => {
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
        throw new Error('OTP not found or expired');
    }
    
    if (otpRecord.expiresAt < new Date()) {
        await Otp.deleteOne({ email });
        throw new Error('OTP expired');
    }
    
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
        throw new Error('Invalid OTP');
    }
    
    const userData = pendingRegistrations.get(email);
    if (!userData) {
        throw new Error('Registration data not found. Please signup again.');
    }
    
    const newUser = new User({ 
        name: userData.name, 
        email, 
        password: userData.password, 
        role: userData.role 
    });
    await newUser.save();
    
    await Otp.deleteOne({ email });
    pendingRegistrations.delete(email);
    
    sendWelcomeEmail(email, userData.name);
    
    return { message: 'User registered successfully' };
};

export const login = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Invalid credentials');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
        { userId: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
    );
    
    return { 
        success: true,
        token, 
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
        } 
    };
};

export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return { success: true, user };
};

export const updateUserProfile = async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) {
        const existingUser = await User.findOne({ email: updateData.email });
        if (existingUser && existingUser._id.toString() !== userId) {
            throw new Error('Email already in use');
        }
        user.email = updateData.email;
    }
    
    await user.save();
    return { success: true, message: 'Profile updated successfully', user };
};

export const deleteUserProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    await User.deleteOne({ _id: userId });
    return { success: true, message: 'Profile deleted successfully' };
};

