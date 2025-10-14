import { Router } from 'express';
import { bidController } from './bid.controller';
import { validate } from '../../middleware/validator';
import { createBidValidator, updateBidValidator } from './bid.validators';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/tender/:tenderId', bidController.getTenderBids);
router.get('/business/:businessId', bidController.getBusinessBids);
router.get('/:id', bidController.getBidById);

// Protected routes
router.post('/tender/:tenderId', authenticate, validate(createBidValidator), bidController.createBid);
router.get('/my/bids', authenticate, bidController.getMyBids);
router.put('/:id', authenticate, validate(updateBidValidator), bidController.updateBid);
router.post('/:id/withdraw', authenticate, bidController.withdrawBid);

export default router;
