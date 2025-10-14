import { Router } from 'express';
import { locationController } from './location.controller';

const router = Router();

router.get('/counties', locationController.getAllCounties);
router.get('/counties/:county/subcounties', locationController.getSubCounties);
router.get('/counties/:county/businesses', locationController.getBusinessesByCounty);

export default router;
