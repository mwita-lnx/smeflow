import { Router } from 'express';
import { productController } from './product.controller';
import { validate } from '../../middleware/validator';
import { createProductValidator, updateProductValidator } from './product.validators';
import { authenticate, isBusinessOwner } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/', productController.getAllProducts); // Get all products with optional filters
router.get('/business/:businessId', productController.getProductsByBusiness);
router.get('/:id', productController.getProductById);

// Protected routes
router.post(
  '/business/:businessId',
  authenticate,
  isBusinessOwner,
  validate(createProductValidator),
  productController.createProduct
);

router.post(
  '/:id/images',
  authenticate,
  isBusinessOwner,
  upload.array('images', 5),
  productController.uploadProductImages
);

router.put(
  '/:id',
  authenticate,
  isBusinessOwner,
  validate(updateProductValidator),
  productController.updateProduct
);

router.delete('/:id', authenticate, isBusinessOwner, productController.deleteProduct);

export default router;
