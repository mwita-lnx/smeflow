import { Router } from 'express';
import { ratingController } from './rating.controller';
import { validate } from '../../middleware/validator';
import {
  createRatingValidator,
  updateRatingValidator,
  respondToRatingValidator,
} from './rating.validators';
import { authenticate, isBusinessOwner } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/business/:businessId', ratingController.getBusinessRatings);
router.get('/:id', ratingController.getRatingById);

// Protected routes
router.post('/', authenticate, validate(createRatingValidator), ratingController.createRating);

router.post(
  '/:id/images',
  authenticate,
  upload.array('images', 5),
  ratingController.uploadRatingImages
);

router.put('/:id', authenticate, validate(updateRatingValidator), ratingController.updateRating);

router.delete('/:id', authenticate, ratingController.deleteRating);

router.post('/:id/helpful', ratingController.markHelpful);

router.post(
  '/:id/respond',
  authenticate,
  isBusinessOwner,
  validate(respondToRatingValidator),
  ratingController.respondToRating
);

router.post('/:id/flag', authenticate, ratingController.flagRating);

export default router;
