import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { KENYAN_COUNTIES } from '../../config/constants';
import { Business } from '../../models/Business.model';

// This would typically come from a database, but we're using constants for now
const KENYAN_SUBCOUNTIES: Record<string, string[]> = {
  'Nairobi': [
    'Westlands',
    'Dagoretti North',
    'Dagoretti South',
    'Langata',
    'Kibra',
    'Roysambu',
    'Kasarani',
    'Ruaraka',
    'Embakasi South',
    'Embakasi North',
    'Embakasi Central',
    'Embakasi East',
    'Embakasi West',
    'Makadara',
    'Kamukunji',
    'Starehe',
    'Mathare',
  ],
  'Mombasa': ['Changamwe', 'Jomvu', 'Kisauni', 'Likoni', 'Mvita', 'Nyali'],
  'Kiambu': [
    'Gatundu North',
    'Gatundu South',
    'Githunguri',
    'Juja',
    'Kabete',
    'Kiambaa',
    'Kiambu',
    'Kikuyu',
    'Limuru',
    'Ruiru',
    'Thika Town',
  ],
  'Nakuru': [
    'Gilgil',
    'Kuresoi North',
    'Kuresoi South',
    'Molo',
    'Naivasha',
    'Nakuru Town East',
    'Nakuru Town West',
    'Njoro',
    'Rongai',
    'Subukia',
  ],
  'Kisumu': ['Kisumu Central', 'Kisumu East', 'Kisumu West', 'Muhoroni', 'Nyakach', 'Nyando', 'Seme'],
};

export class LocationController {
  getAllCounties = asyncHandler(async (_req: Request, res: Response) => {
    const counties = KENYAN_COUNTIES.map(county => ({ name: county }));
    ApiResponse.success(res, counties);
  });

  getSubCounties = asyncHandler(async (req: Request, res: Response) => {
    const { county } = req.params;

    const subCounties = KENYAN_SUBCOUNTIES[county] || [];
    const data = subCounties.map(subCounty => ({ name: subCounty }));

    ApiResponse.success(res, data);
  });

  getBusinessesByCounty = asyncHandler(async (req: Request, res: Response) => {
    const { county } = req.params;

    if (!KENYAN_COUNTIES.includes(county as any)) {
      ApiResponse.error(res, 'Invalid county', 400);
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [businesses, total] = await Promise.all([
      Business.find({ county, status: 'ACTIVE' })
        .sort({ averageRating: -1, totalReviews: -1 })
        .skip(skip)
        .limit(limit),
      Business.countDocuments({ county, status: 'ACTIVE' }),
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
}

export const locationController = new LocationController();
