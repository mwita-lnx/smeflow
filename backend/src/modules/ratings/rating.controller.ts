import { Request, Response } from 'express';
import { ratingService } from './rating.service';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AuthRequest } from '../../shared/interfaces';
import { cloudinaryService } from '../../services/cloudinary.service';
import { Rating } from '../../models/Rating.model';
import { AppError } from '../../middleware/errorHandler';

export class RatingController {
  createRating = asyncHandler(async (req: AuthRequest, res: Response) => {
    const rating = await ratingService.createRating(req.user!._id, req.body);
    ApiResponse.created(res, rating, 'Rating created successfully');
  });

  uploadRatingImages = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const rating = await Rating.findById(id);
    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    if (rating.user.toString() !== req.user!._id) {
      throw new AppError('You do not have permission to update this rating', 403);
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new AppError('No images uploaded', 400);
    }

    const imageUrls = await cloudinaryService.uploadMultipleImages(files, 'reviews');
    rating.images.push(...imageUrls);
    await rating.save();

    ApiResponse.success(res, rating, 'Images uploaded successfully');
  });

  updateRating = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const rating = await ratingService.updateRating(id, req.user!._id, req.body);
    ApiResponse.success(res, rating, 'Rating updated successfully');
  });

  deleteRating = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await ratingService.deleteRating(id, req.user!._id);
    ApiResponse.success(res, null, 'Rating deleted successfully');
  });

  getBusinessRatings = asyncHandler(async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const result = await ratingService.getBusinessRatings(businessId, req.query);
    ApiResponse.success(res, result);
  });

  getRatingById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const rating = await ratingService.getRatingById(id);
    ApiResponse.success(res, rating);
  });

  markHelpful = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const rating = await ratingService.markHelpful(id);
    ApiResponse.success(res, rating);
  });

  respondToRating = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { response } = req.body;
    const rating = await ratingService.respondToRating(id, req.user!._id, response);
    ApiResponse.success(res, rating, 'Response added successfully');
  });

  flagRating = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const rating = await ratingService.flagRating(id);
    ApiResponse.success(res, rating, 'Rating flagged for review');
  });
}

export const ratingController = new RatingController();
