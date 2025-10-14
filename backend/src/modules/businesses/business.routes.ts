import { Router } from 'express';
import { businessController } from './business.controller';
import { validate } from '../../middleware/validator';
import {
  createBusinessValidator,
  updateBusinessValidator,
  searchBusinessValidator,
} from './business.validators';
import { authenticate, isBusinessOwner } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';
import { uploadLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Public routes - specific routes first
router.get('/search', validate(searchBusinessValidator), businessController.searchBusinesses);
router.get('/nearby', businessController.getNearbyBusinesses);

// Protected routes - require authentication
router.post(
  '/',
  authenticate,
  isBusinessOwner,
  validate(createBusinessValidator),
  businessController.createBusiness
);

router.put(
  '/:id',
  authenticate,
  isBusinessOwner,
  validate(updateBusinessValidator),
  businessController.updateBusiness
);

router.post(
  '/:id/images',
  authenticate,
  isBusinessOwner,
  uploadLimiter,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  businessController.uploadImages
);

router.delete('/:id', authenticate, isBusinessOwner, businessController.deleteBusiness);

// Public routes with params - must be last to avoid conflicts
router.get('/slug/:slug', businessController.getBusinessBySlug);
router.post('/:id/view', businessController.incrementView);
router.get('/:id', businessController.getBusinessById);

// Default route for listing all businesses (fallback to search)
router.get('/', validate(searchBusinessValidator), businessController.searchBusinesses);

export default router;
