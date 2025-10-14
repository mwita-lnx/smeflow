import { Request, Response } from 'express';
import { Bid } from '../../models/Bid.model';
import { Tender } from '../../models/Tender.model';
import { Business } from '../../models/Business.model';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AuthRequest } from '../../shared/interfaces';
import { AppError } from '../../middleware/errorHandler';

export class BidController {
  // Create bid (SME only)
  createBid = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { tenderId } = req.params;
    const { businessId } = req.body;
    const { _id, role } = req.user!;

    console.log('=== CREATE BID DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Tender ID:', tenderId);
    console.log('Business ID from body:', businessId);
    console.log('User ID:', _id);
    console.log('User role:', role);

    if (role !== 'SME') {
      throw new AppError('Only SMEs can create bids', 403);
    }

    // Check if tender exists and is open
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    if (tender.status !== 'OPEN') {
      throw new AppError('Tender is not open for bidding', 400);
    }

    if (new Date() > tender.deadline) {
      throw new AppError('Tender deadline has passed', 400);
    }

    // Check if business belongs to user
    const business = await Business.findById(businessId);
    if (!business) {
      throw new AppError('Business not found', 404);
    }

    console.log('Business found:', {
      id: business._id,
      name: business.businessName,
      owner: business.owner,
    });
    console.log('Ownership check:');
    console.log('  business.owner:', business.owner);
    console.log('  business.owner.toString():', business.owner.toString());
    console.log('  user._id:', _id);
    console.log('  user._id.toString():', _id.toString());
    console.log('  Match:', business.owner.toString() === _id.toString());

    if (business.owner.toString() !== _id.toString()) {
      throw new AppError('You do not own this business', 403);
    }

    // Check if already bid
    const existingBid = await Bid.findOne({ tender: tenderId, business: businessId });
    if (existingBid) {
      throw new AppError('You have already placed a bid on this tender', 400);
    }

    const bid = await Bid.create({
      ...req.body,
      tender: tenderId,
      business: businessId,
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('business', 'businessName logo')
      .populate('tender', 'title');

    ApiResponse.created(res, populatedBid, 'Bid created successfully');
  });

  // Get all bids for a tender
  getTenderBids = asyncHandler(async (req: Request, res: Response) => {
    const { tenderId } = req.params;
    const { status } = req.query;

    const query: any = { tender: tenderId };
    if (status) query.status = status;

    const bids = await Bid.find(query)
      .populate('business', 'businessName logo averageRating totalReviews')
      .sort({ createdAt: -1 });

    ApiResponse.success(res, bids);
  });

  // Get bids by business
  getBusinessBids = asyncHandler(async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const { status, page = '1', limit = '20' } = req.query;

    const query: any = { business: businessId };
    if (status) query.status = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [bids, total] = await Promise.all([
      Bid.find(query)
        .populate('tender', 'title deadline status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Bid.countDocuments(query),
    ]);

    ApiResponse.success(res, {
      results: bids,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  });

  // Get my bids (current user's businesses)
  getMyBids = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { _id } = req.user!;
    const { status, page = '1', limit = '20' } = req.query;

    // Get businesses owned by user
    const businesses = await Business.find({ owner: _id }).select('_id');
    const businessIds = businesses.map((b) => b._id);

    const query: any = { business: { $in: businessIds } };
    if (status) query.status = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [bids, total] = await Promise.all([
      Bid.find(query)
        .populate('business', 'businessName logo')
        .populate('tender', 'title deadline status postedBy')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Bid.countDocuments(query),
    ]);

    ApiResponse.success(res, {
      results: bids,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  });

  // Get bid by ID
  getBidById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const bid = await Bid.findById(id)
      .populate('business', 'businessName logo averageRating totalReviews')
      .populate('tender', 'title description budget deadline postedBy');

    if (!bid) {
      throw new AppError('Bid not found', 404);
    }

    ApiResponse.success(res, bid);
  });

  // Update bid
  updateBid = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { _id } = req.user!;

    const bid = await Bid.findById(id).populate('business');
    if (!bid) {
      throw new AppError('Bid not found', 404);
    }

    const business = bid.business as any;
    if (business.owner.toString() !== _id) {
      throw new AppError('You do not have permission to update this bid', 403);
    }

    if (bid.status !== 'PENDING') {
      throw new AppError('Cannot update bid that is not pending', 400);
    }

    Object.assign(bid, req.body);
    await bid.save();

    ApiResponse.success(res, bid, 'Bid updated successfully');
  });

  // Withdraw bid
  withdrawBid = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { _id } = req.user!;

    const bid = await Bid.findById(id).populate('business');
    if (!bid) {
      throw new AppError('Bid not found', 404);
    }

    const business = bid.business as any;
    if (business.owner.toString() !== _id) {
      throw new AppError('You do not have permission to withdraw this bid', 403);
    }

    if (bid.status !== 'PENDING') {
      throw new AppError('Can only withdraw pending bids', 400);
    }

    bid.status = 'WITHDRAWN';
    await bid.save();

    ApiResponse.success(res, bid, 'Bid withdrawn successfully');
  });
}

export const bidController = new BidController();
