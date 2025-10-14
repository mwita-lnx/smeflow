import { Request, Response } from 'express';
import { Product } from '../../models/Product.model';
import { Business } from '../../models/Business.model';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AuthRequest } from '../../shared/interfaces';
import { AppError } from '../../middleware/errorHandler';
import { cloudinaryService } from '../../services/cloudinary.service';

export class ProductController {
  createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { businessId } = req.params;

    const business = await Business.findById(businessId);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    if (business.owner.toString() !== req.user!._id) {
      throw new AppError('You do not have permission to add products to this business', 403);
    }

    const product = await Product.create({
      ...req.body,
      business: businessId,
    });

    ApiResponse.created(res, product, 'Product created successfully');
  });

  uploadProductImages = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id).populate('business');
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const business = product.business as any;
    if (business.owner.toString() !== req.user!._id) {
      throw new AppError('You do not have permission to update this product', 403);
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new AppError('No images uploaded', 400);
    }

    const imageUrls = await cloudinaryService.uploadMultipleImages(files, 'products');
    product.images.push(...imageUrls);
    await product.save();

    ApiResponse.success(res, product, 'Images uploaded successfully');
  });

  getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const { q, category, page = '1', limit = '20' } = req.query;

    const query: any = { isAvailable: true };

    // Search filter
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('business', 'businessName slug logo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    ApiResponse.success(res, {
      results: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  });

  getProductsByBusiness = asyncHandler(async (req: Request, res: Response) => {
    const { businessId } = req.params;

    const products = await Product.find({ business: businessId, isAvailable: true }).sort({
      createdAt: -1,
    });

    ApiResponse.success(res, products);
  });

  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id).populate('business', 'businessName slug logo');
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    ApiResponse.success(res, product);
  });

  updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id).populate('business');
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const business = product.business as any;
    if (business.owner.toString() !== req.user!._id) {
      throw new AppError('You do not have permission to update this product', 403);
    }

    Object.assign(product, req.body);
    await product.save();

    ApiResponse.success(res, product, 'Product updated successfully');
  });

  deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id).populate('business');
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const business = product.business as any;
    if (business.owner.toString() !== req.user!._id) {
      throw new AppError('You do not have permission to delete this product', 403);
    }

    // Delete associated images
    for (const imageUrl of product.images) {
      await cloudinaryService.deleteImage(imageUrl).catch(() => {});
    }

    await Product.findByIdAndDelete(id);

    ApiResponse.success(res, null, 'Product deleted successfully');
  });
}

export const productController = new ProductController();
