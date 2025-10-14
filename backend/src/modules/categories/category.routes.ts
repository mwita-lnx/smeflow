import { Router } from 'express';
import { categoryController } from './category.controller';

const router = Router();

router.get('/', categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategoryBySlug);
router.get('/:slug/businesses', categoryController.getBusinessesByCategory);
router.get('/:parentId/subcategories', categoryController.getSubCategories);

export default router;
