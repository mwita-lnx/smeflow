import { body } from 'express-validator';
import { RATING_RANGE } from '../../config/constants';

export const createRatingValidator = [
  body('business')
    .notEmpty()
    .withMessage('Business ID is required')
    .isMongoId()
    .withMessage('Invalid business ID'),
  body('rating')
    .isFloat({ min: RATING_RANGE.MIN, max: RATING_RANGE.MAX })
    .withMessage(`Rating must be between ${RATING_RANGE.MIN} and ${RATING_RANGE.MAX}`),
  body('reviewTitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Review title cannot exceed 100 characters'),
  body('reviewText')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Review text cannot exceed 2000 characters'),
  body('qualityRating')
    .optional()
    .isFloat({ min: RATING_RANGE.MIN, max: RATING_RANGE.MAX })
    .withMessage(`Quality rating must be between ${RATING_RANGE.MIN} and ${RATING_RANGE.MAX}`),
  body('serviceRating')
    .optional()
    .isFloat({ min: RATING_RANGE.MIN, max: RATING_RANGE.MAX })
    .withMessage(`Service rating must be between ${RATING_RANGE.MIN} and ${RATING_RANGE.MAX}`),
  body('valueRating')
    .optional()
    .isFloat({ min: RATING_RANGE.MIN, max: RATING_RANGE.MAX })
    .withMessage(`Value rating must be between ${RATING_RANGE.MIN} and ${RATING_RANGE.MAX}`),
];

export const updateRatingValidator = [
  body('rating')
    .optional()
    .isFloat({ min: RATING_RANGE.MIN, max: RATING_RANGE.MAX })
    .withMessage(`Rating must be between ${RATING_RANGE.MIN} and ${RATING_RANGE.MAX}`),
  body('reviewTitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Review title cannot exceed 100 characters'),
  body('reviewText')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Review text cannot exceed 2000 characters'),
  body('qualityRating')
    .optional()
    .isFloat({ min: RATING_RANGE.MIN, max: RATING_RANGE.MAX })
    .withMessage(`Quality rating must be between ${RATING_RANGE.MIN} and ${RATING_RANGE.MAX}`),
  body('serviceRating')
    .optional()
    .isFloat({ min: RATING_RANGE.MIN, max: RATING_RANGE.MAX })
    .withMessage(`Service rating must be between ${RATING_RANGE.MIN} and ${RATING_RANGE.MAX}`),
  body('valueRating')
    .optional()
    .isFloat({ min: RATING_RANGE.MIN, max: RATING_RANGE.MAX })
    .withMessage(`Value rating must be between ${RATING_RANGE.MIN} and ${RATING_RANGE.MAX}`),
];

export const respondToRatingValidator = [
  body('response')
    .trim()
    .notEmpty()
    .withMessage('Response is required')
    .isLength({ max: 1000 })
    .withMessage('Response cannot exceed 1000 characters'),
];
