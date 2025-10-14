import { Request, Response } from 'express';
import { Category } from '../../models/Category.model';
import { Business } from '../../models/Business.model';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AppError } from '../../middleware/errorHandler';

export class CategoryController {
  getAllCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    ApiResponse.success(res, categories);
  });

  getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true });
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    ApiResponse.success(res, category);
  });

  getBusinessesByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true });
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [businesses, total] = await Promise.all([
      Business.find({ category: category.name, status: 'ACTIVE' })
        .sort({ averageRating: -1, totalReviews: -1 })
        .skip(skip)
        .limit(limit),
      Business.countDocuments({ category: category.name, status: 'ACTIVE' }),
    ]);

    ApiResponse.success(res, {
      data: businesses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  });

  getSubCategories = asyncHandler(async (req: Request, res: Response) => {
    const { parentId } = req.params;

    const subCategories = await Category.find({
      parentCategory: parentId,
      isActive: true,
    }).sort({ name: 1 });

    ApiResponse.success(res, subCategories);
  });
}

export const categoryController = new CategoryController();
