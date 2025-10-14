import { Router } from 'express';
import { adminController } from './admin.controller';
import { validate } from '../../middleware/validator';
import { verifyBusinessValidator, moderateReviewValidator } from './admin.validators';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { USER_ROLES } from '../../config/constants';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN));

// Business management
router.get('/businesses/pending', adminController.getPendingBusinesses);
router.put('/businesses/:id/verify', validate(verifyBusinessValidator), adminController.verifyBusiness);
router.put('/businesses/:id/reject', adminController.rejectBusiness);
router.put('/businesses/:id/suspend', adminController.suspendBusiness);
router.put('/businesses/:id/activate', adminController.activateBusiness);

// Review moderation
router.get('/reviews/flagged', adminController.getFlaggedReviews);
router.put('/reviews/:id/moderate', validate(moderateReviewValidator), adminController.moderateReview);

// User management
router.get('/users', adminController.getAllUsers);

// Statistics
router.get('/stats', adminController.getStats);

export default router;
