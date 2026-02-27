import { signup, verifyOtp, login, getUserProfile, updateUserProfile, deleteUserProfile } from "../services/authservice.js";

export const signupController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Name, email, and password are required" 
            });
        }
        
        const result = await signup(name, email, password, role);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message || 'Server error' 
        });
    }
};

export const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and OTP are required' 
            });
        }
        
        const result = await verifyOtp(email, otp); 
        res.status(201).json({ success: true, ...result });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message || 'Server error' 
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        const result = await login(email, password);
        
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: error.message || 'Invalid credentials' 
        });
    }
};

export const getUserProfileController = async (req, res) => {
    try {
        const result = await getUserProfile(req.user.userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ 
            success: false, 
            message: error.message || 'Server error' 
        });
    }
};

export const updateUserProfileController = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        if (!name && !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'At least one field (name or email) must be provided' 
            });
        }
        
        const result = await updateUserProfile(req.user.userId, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message || 'Server error' 
        });
    }
};

export const deleteUserProfileController = async (req, res) => {
    try {
        const result = await deleteUserProfile(req.user.userId);
        
        res.clearCookie('token');
        
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ 
            success: false, 
            message: error.message || 'Server error' 
        });
    }
};

export const logoutController = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};


