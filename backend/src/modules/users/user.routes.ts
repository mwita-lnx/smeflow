import { Router } from 'express';
import { userController } from './user.controller';
import { validate } from '../../middleware/validator';
import {
  updateProfileValidator,
  changePasswordValidator,
  deleteAccountValidator,
} from './user.validators';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.put('/profile', validate(updateProfileValidator), userController.updateProfile);
router.put('/change-password', validate(changePasswordValidator), userController.changePassword);
router.get('/businesses', userController.getUserBusinesses);
router.get('/reviews', userController.getUserReviews);
router.get('/:userId/businesses', userController.getUserBusinesses);
router.get('/:userId/reviews', userController.getUserReviews);
router.delete('/account', validate(deleteAccountValidator), userController.deleteAccount);

export default router;
