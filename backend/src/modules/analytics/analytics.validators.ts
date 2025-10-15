import { body, param, query } from 'express-validator';

export const analyticsValidators = {
  trackEvent: [
    body('businessId')
      .notEmpty()
      .withMessage('Business ID is required')
      .isMongoId()
      .withMessage('Invalid business ID'),
    body('eventType')
      .notEmpty()
      .withMessage('Event type is required')
      .isIn(['VIEW', 'CLICK', 'CONTACT_CLICK', 'PRODUCT_VIEW', 'SHARE'])
      .withMessage('Invalid event type'),
    body('userId')
      .optional()
      .isMongoId()
      .withMessage('Invalid user ID'),
    body('userRole')
      .optional()
      .isIn(['CONSUMER', 'SME', 'BROKER', 'ADMIN'])
      .withMessage('Invalid user role'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be an object'),
    body('sessionId')
      .optional()
      .isString()
      .withMessage('Session ID must be a string'),
  ],

  getBusinessAnalytics: [
    param('businessId')
      .notEmpty()
      .withMessage('Business ID is required')
      .isMongoId()
      .withMessage('Invalid business ID'),
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid start date format'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid end date format'),
  ],

  getTimeBasedAnalytics: [
    param('businessId')
      .notEmpty()
      .withMessage('Business ID is required')
      .isMongoId()
      .withMessage('Invalid business ID'),
    query('period')
      .optional()
      .isIn(['day', 'week', 'month', 'year'])
      .withMessage('Period must be one of: day, week, month, year'),
  ],

  getPopularProducts: [
    param('businessId')
      .notEmpty()
      .withMessage('Business ID is required')
      .isMongoId()
      .withMessage('Invalid business ID'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
  ],
};
