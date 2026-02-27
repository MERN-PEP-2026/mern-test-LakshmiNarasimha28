import { signupController, verifyOtpController, loginController, logoutController, getUserProfileController, updateUserProfileController, deleteUserProfileController } from "../controllers/authcontroller.js";
import express from 'express';
import { authMiddleware } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post('/signup', signupController);
router.post('/verify-otp', verifyOtpController);
router.post('/login', loginController);
router.post('/logout', authMiddleware, logoutController);
router.get('/profile', authMiddleware, getUserProfileController);
router.put('/profile', authMiddleware, updateUserProfileController);
router.delete('/profile', authMiddleware, deleteUserProfileController);

export default router;