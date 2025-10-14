import { body } from 'express-validator';

export const createTenderValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('budget.min').isFloat({ min: 0 }).withMessage('Minimum budget must be a positive number'),
  body('budget.max').isFloat({ min: 0 }).withMessage('Maximum budget must be a positive number'),
  body('deadline').isISO8601().withMessage('Invalid deadline date'),
  body('location.county').trim().notEmpty().withMessage('County is required'),
];

export const updateTenderValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('budget.min').optional().isFloat({ min: 0 }).withMessage('Minimum budget must be a positive number'),
  body('budget.max').optional().isFloat({ min: 0 }).withMessage('Maximum budget must be a positive number'),
];

export const awardTenderValidator = [
  body('bidId').trim().notEmpty().withMessage('Bid ID is required'),
];
