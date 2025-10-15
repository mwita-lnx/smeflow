import { Analytics, IAnalytics } from '../../models/Analytics.model';
import { Business } from '../../models/Business.model';
import { Product } from '../../models/Product.model';
import { AppError } from '../../middleware/errorHandler';

interface TrackEventDTO {
  businessId: string;
  eventType: 'VIEW' | 'CLICK' | 'CONTACT_CLICK' | 'PRODUCT_VIEW' | 'SHARE';
  userId?: string;
  userRole?: 'CONSUMER' | 'SME' | 'BROKER' | 'ADMIN';
  metadata?: {
    productId?: string;
    source?: string;
    deviceType?: string;
    location?: {
      county?: string;
      coordinates?: [number, number];
    };
  };
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface AnalyticsQuery {
  businessId: string;
  startDate?: Date;
  endDate?: Date;
  period?: 'day' | 'week' | 'month' | 'year';
}

export class AnalyticsService {
  // Track an analytics event
  async trackEvent(data: TrackEventDTO): Promise<IAnalytics> {
    const analytics = await Analytics.create(data);

    // Also increment the viewCount on Business model for quick access
    if (data.eventType === 'VIEW') {
      await Business.findByIdAndUpdate(data.businessId, { $inc: { viewCount: 1 } });
    }

    return analytics;
  }

  // Get overview stats for a business
  async getBusinessOverview(query: AnalyticsQuery) {
    const { businessId, startDate, endDate } = query;

    // Verify business ownership would be done in controller
    const business = await Business.findById(businessId);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    const dateFilter: any = { business: businessId };
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = startDate;
      if (endDate) dateFilter.createdAt.$lte = endDate;
    }

    // Get total counts by event type
    const eventCounts = await Analytics.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get unique visitors
    const uniqueVisitors = await Analytics.distinct('userId', {
      ...dateFilter,
      userId: { $exists: true },
    });

    // Get views trend (last 30 days by day)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const viewsTrend = await Analytics.aggregate([
      {
        $match: {
          business: business._id,
          eventType: 'VIEW',
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top sources
    const topSources = await Analytics.aggregate([
      { $match: { ...dateFilter, 'metadata.source': { $exists: true } } },
      {
        $group: {
          _id: '$metadata.source',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Format event counts
    const stats: any = {
      totalViews: 0,
      totalClicks: 0,
      contactClicks: 0,
      productViews: 0,
      shares: 0,
    };

    eventCounts.forEach((event) => {
      switch (event._id) {
        case 'VIEW':
          stats.totalViews = event.count;
          break;
        case 'CLICK':
          stats.totalClicks = event.count;
          break;
        case 'CONTACT_CLICK':
          stats.contactClicks = event.count;
          break;
        case 'PRODUCT_VIEW':
          stats.productViews = event.count;
          break;
        case 'SHARE':
          stats.shares = event.count;
          break;
      }
    });

    return {
      overview: {
        ...stats,
        uniqueVisitors: uniqueVisitors.length,
        clickThroughRate: stats.totalViews > 0
          ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(2)
          : '0.00',
      },
      viewsTrend,
      topSources: topSources.map((s) => ({ source: s._id, count: s.count })),
    };
  }

  // Get customer demographics
  async getCustomerDemographics(query: AnalyticsQuery) {
    const { businessId, startDate, endDate } = query;

    const dateFilter: any = { business: businessId };
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = startDate;
      if (endDate) dateFilter.createdAt.$lte = endDate;
    }

    // Get user roles distribution
    const roleDistribution = await Analytics.aggregate([
      { $match: { ...dateFilter, userRole: { $exists: true } } },
      {
        $group: {
          _id: '$userRole',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get location distribution
    const locationDistribution = await Analytics.aggregate([
      { $match: { ...dateFilter, 'metadata.location.county': { $exists: true } } },
      {
        $group: {
          _id: '$metadata.location.county',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return {
      roleDistribution: roleDistribution.map((r) => ({ role: r._id, count: r.count })),
      locationDistribution: locationDistribution.map((l) => ({ county: l._id, count: l.count })),
    };
  }

  // Get popular products for a business
  async getPopularProducts(businessId: string, limit: number = 10) {
    const popularProducts = await Analytics.aggregate([
      {
        $match: {
          business: businessId,
          eventType: 'PRODUCT_VIEW',
          'metadata.productId': { $exists: true },
        },
      },
      {
        $group: {
          _id: '$metadata.productId',
          views: { $sum: 1 },
        },
      },
      { $sort: { views: -1 } },
      { $limit: limit },
    ]);

    // Populate product details
    const productIds = popularProducts.map((p) => p._id);
    const products = await Product.find({ _id: { $in: productIds } }).select(
      'name price images category'
    );

    const productsMap = new Map(products.map((p) => [p._id.toString(), p]));

    return popularProducts.map((p) => ({
      product: productsMap.get(p._id),
      views: p.views,
    }));
  }

  // Get time-based analytics
  async getTimeBasedAnalytics(query: AnalyticsQuery) {
    const { businessId, period = 'day' } = query;

    let groupFormat: string;
    let startDate = new Date();

    switch (period) {
      case 'day':
        groupFormat = '%Y-%m-%d %H:00';
        startDate.setDate(startDate.getDate() - 1); // Last 24 hours
        break;
      case 'week':
        groupFormat = '%Y-%m-%d';
        startDate.setDate(startDate.getDate() - 7); // Last 7 days
        break;
      case 'month':
        groupFormat = '%Y-%m-%d';
        startDate.setDate(startDate.getDate() - 30); // Last 30 days
        break;
      case 'year':
        groupFormat = '%Y-%m';
        startDate.setFullYear(startDate.getFullYear() - 1); // Last 12 months
        break;
      default:
        groupFormat = '%Y-%m-%d';
    }

    const timeBasedData = await Analytics.aggregate([
      {
        $match: {
          business: businessId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            period: { $dateToString: { format: groupFormat, date: '$createdAt' } },
            eventType: '$eventType',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.period': 1 } },
    ]);

    return timeBasedData;
  }

  // Get engagement metrics
  async getEngagementMetrics(businessId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [currentPeriod, previousPeriod] = await Promise.all([
      Analytics.countDocuments({
        business: businessId,
        createdAt: { $gte: thirtyDaysAgo },
      }),
      Analytics.countDocuments({
        business: businessId,
        createdAt: {
          $gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
          $lt: thirtyDaysAgo,
        },
      }),
    ]);

    const growth = previousPeriod > 0
      ? (((currentPeriod - previousPeriod) / previousPeriod) * 100).toFixed(2)
      : '0.00';

    return {
      currentPeriodEvents: currentPeriod,
      previousPeriodEvents: previousPeriod,
      growthPercentage: growth,
    };
  }
}

export const analyticsService = new AnalyticsService();
