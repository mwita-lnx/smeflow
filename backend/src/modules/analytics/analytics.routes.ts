import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { analyticsValidators } from './analytics.validators';
import { validate } from '../../middleware/validator';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Public endpoint for tracking events
router.post(
  '/track',
  validate(analyticsValidators.trackEvent),
  analyticsController.trackEvent
);

// Protected endpoints - require authentication
router.use(authenticate);

// Get all businesses analytics overview (for dashboard home)
router.get('/my-businesses', analyticsController.getAllBusinessesAnalytics);

// Get business analytics overview
router.get(
  '/business/:businessId/overview',
  validate(analyticsValidators.getBusinessAnalytics),
  analyticsController.getBusinessOverview
);

// Get customer demographics
router.get(
  '/business/:businessId/demographics',
  validate(analyticsValidators.getBusinessAnalytics),
  analyticsController.getCustomerDemographics
);

// Get popular products
router.get(
  '/business/:businessId/popular-products',
  validate(analyticsValidators.getPopularProducts),
  analyticsController.getPopularProducts
);

// Get time-based analytics
router.get(
  '/business/:businessId/time-based',
  validate(analyticsValidators.getTimeBasedAnalytics),
  analyticsController.getTimeBasedAnalytics
);

// Get engagement metrics
router.get(
  '/business/:businessId/engagement',
  validate(analyticsValidators.getBusinessAnalytics),
  analyticsController.getEngagementMetrics
);

export default router;
