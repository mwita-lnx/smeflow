import { Response } from 'express';
import { Business } from '../../models/Business.model';
import { Rating } from '../../models/Rating.model';
import { User } from '../../models/User.model';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AuthRequest } from '../../shared/interfaces';
import { AppError } from '../../middleware/errorHandler';
import { smsService } from '../../services/sms.service';

export class AdminController {
  getPendingBusinesses = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const businesses = await Business.find({ status: 'PENDING' })
      .populate('owner', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    ApiResponse.success(res, businesses);
  });

  verifyBusiness = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { verificationLevel, status } = req.body;

    const business = await Business.findById(id).populate('owner');
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    business.status = status || 'ACTIVE';
    business.isVerified = status === 'ACTIVE';
    business.verificationLevel = verificationLevel || 'VERIFIED';

    await business.save();

    // Send SMS notification
    if (status === 'ACTIVE') {
      const owner = business.owner as any;
      await smsService.sendBusinessVerificationSMS(owner.phone, business.businessName);
    }

    ApiResponse.success(res, business, 'Business verification updated');
  });

  rejectBusiness = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const business = await Business.findById(id);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    business.status = 'REJECTED';
    business.isVerified = false;

    await business.save();

    ApiResponse.success(res, business, 'Business rejected');
  });

  getFlaggedReviews = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const reviews = await Rating.find({ status: 'FLAGGED' })
      .populate('user', 'firstName lastName email')
      .populate('business', 'businessName slug')
      .sort({ createdAt: -1 });

    ApiResponse.success(res, reviews);
  });

  moderateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const review = await Rating.findById(id);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    review.status = status;
    await review.save();

    // If review is removed, update business ratings
    if (status === 'REMOVED') {
      const ratings = await Rating.find({ business: review.business, status: 'ACTIVE' });
      const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

      await Business.findByIdAndUpdate(review.business, {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: ratings.length,
      });
    }

    ApiResponse.success(res, review, 'Review moderation updated');
  });

  getStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const [
      totalUsers,
      totalBusinesses,
      activeBusinesses,
      pendingBusinesses,
      totalReviews,
      flaggedReviews,
    ] = await Promise.all([
      User.countDocuments(),
      Business.countDocuments(),
      Business.countDocuments({ status: 'ACTIVE' }),
      Business.countDocuments({ status: 'PENDING' }),
      Rating.countDocuments({ status: 'ACTIVE' }),
      Rating.countDocuments({ status: 'FLAGGED' }),
    ]);

    const stats = {
      totalUsers,
      totalBusinesses,
      activeBusinesses,
      pendingBusinesses,
      totalReviews,
      flaggedReviews,
    };

    ApiResponse.success(res, stats);
  });

  getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    ApiResponse.success(res, {
      data: users,
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

  suspendBusiness = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const business = await Business.findById(id);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    business.status = 'SUSPENDED';
    await business.save();

    ApiResponse.success(res, business, 'Business suspended');
  });

  activateBusiness = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const business = await Business.findById(id);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    business.status = 'ACTIVE';
    await business.save();

    ApiResponse.success(res, business, 'Business activated');
  });
}

export const adminController = new AdminController();
