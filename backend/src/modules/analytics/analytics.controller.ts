import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AuthRequest } from '../../shared/interfaces';
import { AppError } from '../../middleware/errorHandler';
import { Business } from '../../models/Business.model';

export class AnalyticsController {
  // Track an analytics event (public endpoint)
  trackEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await analyticsService.trackEvent({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    ApiResponse.created(res, event, 'Event tracked successfully');
  });

  // Get business analytics overview (business owner only)
  getBusinessOverview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { businessId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify business ownership
    const business = await Business.findById(businessId);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    if (business.owner.toString() !== req.user!._id.toString()) {
      throw new AppError('You do not have permission to view this analytics', 403);
    }

    const analytics = await analyticsService.getBusinessOverview({
      businessId,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    ApiResponse.success(res, analytics);
  });

  // Get customer demographics
  getCustomerDemographics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { businessId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify business ownership
    const business = await Business.findById(businessId);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    if (business.owner.toString() !== req.user!._id.toString()) {
      throw new AppError('You do not have permission to view this analytics', 403);
    }

    const demographics = await analyticsService.getCustomerDemographics({
      businessId,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    ApiResponse.success(res, demographics);
  });

  // Get popular products
  getPopularProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { businessId } = req.params;
    const { limit } = req.query;

    // Verify business ownership
    const business = await Business.findById(businessId);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    if (business.owner.toString() !== req.user!._id.toString()) {
      throw new AppError('You do not have permission to view this analytics', 403);
    }

    const products = await analyticsService.getPopularProducts(
      businessId,
      limit ? parseInt(limit as string) : 10
    );

    ApiResponse.success(res, products);
  });

  // Get time-based analytics
  getTimeBasedAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { businessId } = req.params;
    const { period } = req.query;

    // Verify business ownership
    const business = await Business.findById(businessId);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    if (business.owner.toString() !== req.user!._id.toString()) {
      throw new AppError('You do not have permission to view this analytics', 403);
    }

    const analytics = await analyticsService.getTimeBasedAnalytics({
      businessId,
      period: (period as 'day' | 'week' | 'month' | 'year') || 'week',
    });

    ApiResponse.success(res, analytics);
  });

  // Get engagement metrics
  getEngagementMetrics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { businessId } = req.params;

    // Verify business ownership
    const business = await Business.findById(businessId);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    if (business.owner.toString() !== req.user!._id.toString()) {
      throw new AppError('You do not have permission to view this analytics', 403);
    }

    const metrics = await analyticsService.getEngagementMetrics(businessId);

    ApiResponse.success(res, metrics);
  });

  // Get all analytics for user's businesses
  getAllBusinessesAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { _id } = req.user!;

    // Get all businesses owned by user
    const businesses = await Business.find({ owner: _id }).select('_id businessName logo');

    const analyticsPromises = businesses.map(async (business) => {
      const overview = await analyticsService.getBusinessOverview({
        businessId: business._id.toString(),
      });

      return {
        business: {
          id: business._id,
          name: business.businessName,
          logo: business.logo,
        },
        analytics: overview.overview,
      };
    });

    const allAnalytics = await Promise.all(analyticsPromises);

    ApiResponse.success(res, allAnalytics);
  });
}

export const analyticsController = new AnalyticsController();
