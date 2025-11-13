import { Router } from 'express';
import { mpesaController } from './mpesa.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { mpesaValidators } from './mpesa.validators';

const router = Router();

// Initiate STK Push
router.post(
  '/stk-push',
  authenticate,
  mpesaValidators.initiatePayment,
  mpesaController.initiatePayment
);

// Query transaction status
router.get(
  '/query/:checkoutRequestID',
  authenticate,
  mpesaController.queryStatus
);

// M-Pesa callback (webhook - no authentication)
router.post('/callback', mpesaController.callback);

// Get user transactions
router.get('/transactions', authenticate, mpesaController.getUserTransactions);

// Get business transactions
router.get(
  '/business/:businessId/transactions',
  authenticate,
  mpesaController.getBusinessTransactions
);

export default router;
