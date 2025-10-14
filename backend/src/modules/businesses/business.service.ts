import { Business, IBusiness } from '../../models/Business.model';
import { AppError } from '../../middleware/errorHandler';
import { IPaginationQuery, IPaginationResult } from '../../shared/interfaces';
import { DEFAULT_PAGINATION } from '../../config/constants';
import { cloudinaryService } from '../../services/cloudinary.service';

interface CreateBusinessDTO {
  businessName: string;
  category: string;
  subCategory?: string;
  description: string;
  county: string;
  subCounty?: string;
  address?: string;
  location?: {
    coordinates: [number, number];
  };
  phone: string;
  email?: string;
  whatsapp?: string;
  mpesaPaybill?: string;
  mpesaTill?: string;
  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

interface SearchBusinessQuery extends IPaginationQuery {
  q?: string;
  category?: string;
  county?: string;
  minRating?: number;
  verified?: boolean;
}

export class BusinessService {
  async createBusiness(ownerId: string, data: CreateBusinessDTO): Promise<IBusiness> {
    const business = await Business.create({
      ...data,
      owner: ownerId,
      location: data.location ? {
        type: 'Point',
        coordinates: data.location.coordinates,
      } : undefined,
    });

    return business;
  }

  async updateBusiness(businessId: string, ownerId: string, data: Partial<CreateBusinessDTO>): Promise<IBusiness> {
    const business = await Business.findById(businessId);

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    if (business.owner.toString() !== ownerId) {
      throw new AppError('You do not have permission to update this business', 403);
    }

    Object.assign(business, data);

    if (data.location) {
      business.location = {
        type: 'Point',
        coordinates: data.location.coordinates,
      };
    }

    await business.save();
    return business;
  }

  async uploadBusinessImages(
    businessId: string,
    ownerId: string,
    files: { logo?: Express.Multer.File[]; coverImage?: Express.Multer.File[] }
  ): Promise<IBusiness> {
    const business = await Business.findById(businessId);

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    if (business.owner.toString() !== ownerId) {
      throw new AppError('You do not have permission to update this business', 403);
    }

    if (files.logo && files.logo[0]) {
      const logoUrl = await cloudinaryService.uploadImage(files.logo[0], 'business-logos');
      if (business.logo) {
        await cloudinaryService.deleteImage(business.logo).catch(() => {});
      }
      business.logo = logoUrl;
    }

    if (files.coverImage && files.coverImage[0]) {
      const coverUrl = await cloudinaryService.uploadImage(files.coverImage[0], 'business-covers');
      if (business.coverImage) {
        await cloudinaryService.deleteImage(business.coverImage).catch(() => {});
      }
      business.coverImage = coverUrl;
    }

    await business.save();
    return business;
  }

  async getBusinessById(businessId: string): Promise<IBusiness> {
    const business = await Business.findById(businessId).populate('owner', 'firstName lastName email phone');

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    return business;
  }

  async getBusinessBySlug(slug: string): Promise<IBusiness> {
    const business = await Business.findOne({ slug }).populate('owner', 'firstName lastName');

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    return business;
  }

  async incrementViewCount(businessId: string): Promise<void> {
    await Business.findByIdAndUpdate(businessId, { $inc: { viewCount: 1 } });
  }

  async searchBusinesses(query: SearchBusinessQuery): Promise<IPaginationResult<IBusiness>> {
    const page = query.page || DEFAULT_PAGINATION.PAGE;
    const limit = Math.min(query.limit || DEFAULT_PAGINATION.LIMIT, DEFAULT_PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const filter: any = { status: 'ACTIVE' };

    if (query.q) {
      filter.$text = { $search: query.q };
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.county) {
      filter.county = query.county;
    }

    if (query.minRating) {
      filter.averageRating = { $gte: query.minRating };
    }

    if (query.verified === true) {
      filter.isVerified = true;
    }

    let sortOption: any = { createdAt: -1 };

    if (query.sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (query.sort === 'rating') {
      sortOption = { averageRating: -1, totalReviews: -1 };
    } else if (query.sort === 'popular') {
      sortOption = { viewCount: -1, averageRating: -1 };
    }

    const [businesses, total] = await Promise.all([
      Business.find(filter).sort(sortOption).skip(skip).limit(limit),
      Business.countDocuments(filter),
    ]);

    return {
      data: businesses,
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

  async deleteBusiness(businessId: string, ownerId: string): Promise<void> {
    const business = await Business.findById(businessId);

    if (!business) {
      throw new AppError('Business not found', 404);
    }

    if (business.owner.toString() !== ownerId) {
      throw new AppError('You do not have permission to delete this business', 403);
    }

    // Delete associated images
    if (business.logo) {
      await cloudinaryService.deleteImage(business.logo).catch(() => {});
    }
    if (business.coverImage) {
      await cloudinaryService.deleteImage(business.coverImage).catch(() => {});
    }

    await Business.findByIdAndDelete(businessId);
  }

  async getNearbyBusinesses(
    longitude: number,
    latitude: number,
    maxDistance = 5000
  ): Promise<IBusiness[]> {
    const businesses = await Business.find({
      status: 'ACTIVE',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    }).limit(20);

    return businesses;
  }
}

export const businessService = new BusinessService();
