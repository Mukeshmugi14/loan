import { Router } from 'express';
import { 
  sendOtpController, 
  verifyOtpController, 
  signupController, 
  loginController, 
  googleAuthController,
  resetPasswordController,
  logoutController,
  getMeController,
  healthController
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/send-otp', authLimiter, sendOtpController);
router.post('/verify-otp', authLimiter, verifyOtpController);
router.post('/signup', authLimiter, signupController);
router.post('/login', authLimiter, loginController);
router.post('/google', authLimiter, googleAuthController);
// Forgot password triggers the same OTP send, but we use 'forgot' type in body
router.post('/forgot-password', authLimiter, sendOtpController);
router.post('/reset-password', authLimiter, resetPasswordController);
router.post('/logout', authenticateToken, logoutController);
router.get('/me', authenticateToken, getMeController);
router.get('/health', healthController);

export default router;
