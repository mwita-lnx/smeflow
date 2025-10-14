import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validator';
import {
  registerValidator,
  loginValidator,
  verifyEmailValidator,
  verifyPhoneValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  refreshTokenValidator,
} from './auth.validators';
import { authenticate } from '../../middleware/auth.middleware';
import {
  authLimiter,
  registrationLimiter,
  resetPasswordLimiter,
} from '../../middleware/rateLimiter';

const router = Router();

router.post('/register', registrationLimiter, validate(registerValidator), authController.register);
router.post('/login', authLimiter, validate(loginValidator), authController.login);
router.post('/verify-email', validate(verifyEmailValidator), authController.verifyEmail);
router.post('/verify-phone', authenticate, validate(verifyPhoneValidator), authController.verifyPhone);
router.post('/resend-otp', authenticate, authController.resendPhoneOTP);
router.post('/forgot-password', resetPasswordLimiter, validate(forgotPasswordValidator), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordValidator), authController.resetPassword);
router.post('/refresh-token', validate(refreshTokenValidator), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;
