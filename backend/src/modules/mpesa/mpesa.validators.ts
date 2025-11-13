import { body } from 'express-validator';

export const mpesaValidators = {
  initiatePayment: [
    body('phoneNumber')
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^(\+?254|0)[17]\d{8}$/)
      .withMessage('Invalid Kenyan phone number format'),
    body('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isFloat({ min: 1 })
      .withMessage('Amount must be at least 1'),
    body('accountReference')
      .notEmpty()
      .withMessage('Account reference is required')
      .trim(),
    body('transactionDesc')
      .notEmpty()
      .withMessage('Transaction description is required')
      .trim(),
    body('businessId').optional().isMongoId().withMessage('Invalid business ID'),
    body('orderId').optional().isMongoId().withMessage('Invalid order ID'),
    body('tenderId').optional().isMongoId().withMessage('Invalid tender ID'),
  ],
};
