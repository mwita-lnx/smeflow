import { Rating, IRating } from '../../models/Rating.model';
import { Business } from '../../models/Business.model';
import { AppError } from '../../middleware/errorHandler';
import { IPaginationQuery, IPaginationResult } from '../../shared/interfaces';
import { DEFAULT_PAGINATION } from '../../config/constants';

interface CreateRatingDTO {
  business: string;
  rating: number;
  reviewTitle?: string;
  reviewText?: string;
  qualityRating?: number;
  serviceRating?: number;
  valueRating?: number;
}

export class RatingService {
  async createRating(userId: string, data: CreateRatingDTO): Promise<IRating> {
    // Check if business exists
    const business = await Business.findById(data.business);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    // Check if user already rated this business
    const existingRating = await Rating.findOne({ business: data.business, user: userId });
    if (existingRating) {
      throw new AppError('You have already rated this business', 409);
    }

    // Create rating
    const rating = await Rating.create({
      ...data,
      user: userId,
    });

    // Update business average rating
    await this.updateBusinessRatings(data.business);

    return rating;
  }

  async updateRating(ratingId: string, userId: string, data: Partial<CreateRatingDTO>): Promise<IRating> {
    const rating = await Rating.findById(ratingId);

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    if (rating.user.toString() !== userId) {
      throw new AppError('You do not have permission to update this rating', 403);
    }

    Object.assign(rating, data);
    await rating.save();

    // Update business average rating
    await this.updateBusinessRatings(rating.business.toString());

    return rating;
  }

  async deleteRating(ratingId: string, userId: string): Promise<void> {
    const rating = await Rating.findById(ratingId);

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    if (rating.user.toString() !== userId) {
      throw new AppError('You do not have permission to delete this rating', 403);
    }

    const businessId = rating.business.toString();
    await Rating.findByIdAndDelete(ratingId);

    // Update business average rating
    await this.updateBusinessRatings(businessId);
  }

  async getBusinessRatings(
    businessId: string,
    query: IPaginationQuery
  ): Promise<IPaginationResult<IRating>> {
    const page = query.page || DEFAULT_PAGINATION.PAGE;
    const limit = Math.min(query.limit || DEFAULT_PAGINATION.LIMIT, DEFAULT_PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      Rating.find({ business: businessId, status: 'ACTIVE' })
        .populate('user', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Rating.countDocuments({ business: businessId, status: 'ACTIVE' }),
    ]);

    return {
      data: ratings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async getRatingById(ratingId: string): Promise<IRating> {
    const rating = await Rating.findById(ratingId)
      .populate('user', 'firstName lastName')
      .populate('business', 'businessName slug logo');

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    return rating;
  }

  async markHelpful(ratingId: string): Promise<IRating> {
    const rating = await Rating.findById(ratingId);

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    rating.helpfulCount += 1;
    await rating.save();

    return rating;
  }

  async respondToRating(ratingId: string, ownerId: string, response: string): Promise<IRating> {
    const rating = await Rating.findById(ratingId).populate('business');

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    const business = rating.business as any;
    if (business.owner.toString() !== ownerId) {
      throw new AppError('You do not have permission to respond to this rating', 403);
    }

    rating.businessResponse = response;
    rating.businessResponseDate = new Date();
    await rating.save();

    return rating;
  }

  async flagRating(ratingId: string): Promise<IRating> {
    const rating = await Rating.findById(ratingId);

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    rating.status = 'FLAGGED';
    await rating.save();

    return rating;
  }

  private async updateBusinessRatings(businessId: string): Promise<void> {
    const ratings = await Rating.find({ business: businessId, status: 'ACTIVE' });

    if (ratings.length === 0) {
      await Business.findByIdAndUpdate(businessId, {
        averageRating: 0,
        totalReviews: 0,
      });
      return;
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    await Business.findByIdAndUpdate(businessId, {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: ratings.length,
    });
  }
}

export const ratingService = new RatingService();
