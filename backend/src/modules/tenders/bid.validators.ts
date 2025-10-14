import { body } from 'express-validator';

export const createBidValidator = [
  body('businessId').trim().notEmpty().withMessage('Business ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Bid amount must be a positive number'),
  body('proposal').trim().notEmpty().withMessage('Proposal is required'),
  body('deliveryTime').isInt({ min: 1 }).withMessage('Delivery time must be at least 1 day'),
];

export const updateBidValidator = [
  body('amount').optional().isFloat({ min: 0 }).withMessage('Bid amount must be a positive number'),
  body('proposal').optional().trim().notEmpty().withMessage('Proposal cannot be empty'),
  body('deliveryTime').optional().isInt({ min: 1 }).withMessage('Delivery time must be at least 1 day'),
];
