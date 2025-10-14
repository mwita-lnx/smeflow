import { body } from 'express-validator';
import { VERIFICATION_LEVELS, BUSINESS_STATUS, REVIEW_STATUS } from '../../config/constants';

export const verifyBusinessValidator = [
  body('verificationLevel')
    .optional()
    .isIn(Object.values(VERIFICATION_LEVELS))
    .withMessage('Invalid verification level'),
  body('status')
    .optional()
    .isIn(Object.values(BUSINESS_STATUS))
    .withMessage('Invalid business status'),
];

export const moderateReviewValidator = [
  body('status')
    .isIn(Object.values(REVIEW_STATUS))
    .withMessage('Invalid review status'),
];
