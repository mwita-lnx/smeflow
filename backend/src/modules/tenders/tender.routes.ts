import { Router } from 'express';
import { tenderController } from './tender.controller';
import { validate } from '../../middleware/validator';
import { createTenderValidator, updateTenderValidator, awardTenderValidator } from './tender.validators';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', tenderController.getAllTenders);
router.get('/:id', tenderController.getTenderById);

// Protected routes
router.post('/', authenticate, validate(createTenderValidator), tenderController.createTender);
router.get('/my/tenders', authenticate, tenderController.getMyTenders);
router.put('/:id', authenticate, validate(updateTenderValidator), tenderController.updateTender);
router.post('/:id/close', authenticate, tenderController.closeTender);
router.post('/:id/award', authenticate, validate(awardTenderValidator), tenderController.awardTender);
router.delete('/:id', authenticate, tenderController.deleteTender);

export default router;
