import { body } from 'express-validator';

export const verificationValidators = {
  createVerification: [
    body('productId')
      .notEmpty()
      .withMessage('Product ID is required')
      .isMongoId()
      .withMessage('Invalid product ID'),
    body('businessId')
      .notEmpty()
      .withMessage('Business ID is required')
      .isMongoId()
      .withMessage('Invalid business ID'),
    body('batchNumber').optional().trim(),
    body('manufacturingDate').optional().isISO8601().withMessage('Invalid manufacturing date'),
    body('expiryDate').optional().isISO8601().withMessage('Invalid expiry date'),
    body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  ],

  bulkCreate: [
    body('productId')
      .notEmpty()
      .withMessage('Product ID is required')
      .isMongoId()
      .withMessage('Invalid product ID'),
    body('businessId')
      .notEmpty()
      .withMessage('Business ID is required')
      .isMongoId()
      .withMessage('Invalid business ID'),
    body('quantity')
      .notEmpty()
      .withMessage('Quantity is required')
      .isInt({ min: 1, max: 1000 })
      .withMessage('Quantity must be between 1 and 1000'),
    body('batchNumber').optional().trim(),
    body('manufacturingDate').optional().isISO8601().withMessage('Invalid manufacturing date'),
    body('expiryDate').optional().isISO8601().withMessage('Invalid expiry date'),
    body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  ],
};
