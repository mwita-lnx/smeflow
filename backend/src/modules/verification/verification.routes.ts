import { Router } from 'express';
import { verificationController } from './verification.controller';
import { authenticate, optionalAuth } from '../../middleware/auth.middleware';
import { verificationValidators } from './verification.validators';

const router = Router();

// Create product verification
router.post(
  '/',
  authenticate,
  verificationValidators.createVerification,
  verificationController.createVerification
);

// Bulk create verifications
router.post(
  '/bulk',
  authenticate,
  verificationValidators.bulkCreate,
  verificationController.bulkCreate
);

// Verify product by QR code (public endpoint with optional auth)
router.post(
  '/verify/:qrCode',
  optionalAuth,
  verificationController.verifyProduct
);

// Get verification by serial number
router.get('/serial/:serialNumber', verificationController.getBySerialNumber);

// Get product verifications
router.get('/product/:productId', verificationController.getProductVerifications);

// Get business verifications
router.get(
  '/business/:businessId',
  authenticate,
  verificationController.getBusinessVerifications
);

// Get scan history
router.get('/scan-history/:qrCode', verificationController.getScanHistory);

// Mark as counterfeit
router.patch(
  '/:verificationId/counterfeit',
  authenticate,
  verificationController.markAsCounterfeit
);

// Deactivate verification
router.patch(
  '/:verificationId/deactivate',
  authenticate,
  verificationController.deactivateVerification
);

export default router;
