import { body, query } from 'express-validator';
import { BUSINESS_CATEGORIES, KENYAN_COUNTIES } from '../../config/constants';

export const createBusinessValidator = [
  body('businessName')
    .trim()
    .notEmpty()
    .withMessage('Business name is required')
    .isLength({ max: 100 })
    .withMessage('Business name cannot exceed 100 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(BUSINESS_CATEGORIES)
    .withMessage('Invalid category'),
  body('subCategory')
    .optional()
    .trim(),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('county')
    .notEmpty()
    .withMessage('County is required')
    .isIn(KENYAN_COUNTIES)
    .withMessage('Invalid county'),
  body('subCounty')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim(),
  body('phone')
    .matches(/^\+254[0-9]{9}$/)
    .withMessage('Please provide a valid Kenyan phone number (+254...)'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('whatsapp')
    .optional()
    .matches(/^\+254[0-9]{9}$/)
    .withMessage('Please provide a valid Kenyan phone number (+254...)'),
  body('mpesaPaybill')
    .optional()
    .trim(),
  body('mpesaTill')
    .optional()
    .trim(),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('facebookUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('instagramUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('location')
    .optional()
    .isObject()
    .withMessage('Location must be an object with coordinates'),
  body('location.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]'),
];

export const updateBusinessValidator = [
  body('businessName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Business name cannot exceed 100 characters'),
  body('category')
    .optional()
    .isIn(BUSINESS_CATEGORIES)
    .withMessage('Invalid category'),
  body('subCategory')
    .optional()
    .trim(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('county')
    .optional()
    .isIn(KENYAN_COUNTIES)
    .withMessage('Invalid county'),
  body('subCounty')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim(),
  body('phone')
    .optional()
    .matches(/^\+254[0-9]{9}$/)
    .withMessage('Please provide a valid Kenyan phone number (+254...)'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('whatsapp')
    .optional()
    .matches(/^\+254[0-9]{9}$/)
    .withMessage('Please provide a valid Kenyan phone number (+254...)'),
  body('mpesaPaybill')
    .optional()
    .trim(),
  body('mpesaTill')
    .optional()
    .trim(),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('facebookUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('instagramUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
];

export const searchBusinessValidator = [
  query('q')
    .optional()
    .trim(),
  query('category')
    .optional()
    .isIn(BUSINESS_CATEGORIES)
    .withMessage('Invalid category'),
  query('county')
    .optional()
    .isIn(KENYAN_COUNTIES)
    .withMessage('Invalid county'),
  query('minRating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  query('verified')
    .optional()
    .isBoolean()
    .withMessage('Verified must be a boolean'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'rating', 'popular'])
    .withMessage('Invalid sort option'),
];
