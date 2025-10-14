import { Request, Response } from 'express';
import { Tender } from '../../models/Tender.model';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AuthRequest } from '../../shared/interfaces';
import { AppError } from '../../middleware/errorHandler';

export class TenderController {
  // Create tender (CONSUMER or BROKER only)
  createTender = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { role, _id } = req.user!;

    if (role !== 'CONSUMER' && role !== 'BROKER') {
      throw new AppError('Only consumers and brokers can create tenders', 403);
    }

    const tender = await Tender.create({
      ...req.body,
      postedBy: _id,
      postedByRole: role,
    });

    ApiResponse.created(res, tender, 'Tender created successfully');
  });

  // Get all tenders with filters
  getAllTenders = asyncHandler(async (req: Request, res: Response) => {
    const { status, category, county, page = '1', limit = '20', q } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (county) query['location.county'] = county;

    // Search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    // Only show open tenders by default if no status filter
    if (!status) {
      query.status = 'OPEN';
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [tenders, total] = await Promise.all([
      Tender.find(query)
        .populate('postedBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Tender.countDocuments(query),
    ]);

    ApiResponse.success(res, {
      results: tenders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  });

  // Get tender by ID
  getTenderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const tender = await Tender.findById(id)
      .populate('postedBy', 'firstName lastName email phone')
      .populate({
        path: 'bids',
        populate: {
          path: 'business',
          select: 'businessName logo averageRating',
        },
      });

    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    ApiResponse.success(res, tender);
  });

  // Get tenders posted by current user
  getMyTenders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { _id } = req.user!;
    const { status, page = '1', limit = '20' } = req.query;

    const query: any = { postedBy: _id };
    if (status) query.status = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [tenders, total] = await Promise.all([
      Tender.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Tender.countDocuments(query),
    ]);

    ApiResponse.success(res, {
      results: tenders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  });

  // Update tender
  updateTender = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { _id } = req.user!;

    const tender = await Tender.findById(id);
    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    if (tender.postedBy.toString() !== _id) {
      throw new AppError('You do not have permission to update this tender', 403);
    }

    if (tender.status !== 'OPEN') {
      throw new AppError('Cannot update tender that is not open', 400);
    }

    Object.assign(tender, req.body);
    await tender.save();

    ApiResponse.success(res, tender, 'Tender updated successfully');
  });

  // Close tender
  closeTender = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { _id } = req.user!;

    const tender = await Tender.findById(id);
    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    if (tender.postedBy.toString() !== _id) {
      throw new AppError('You do not have permission to close this tender', 403);
    }

    tender.status = 'CLOSED';
    await tender.save();

    ApiResponse.success(res, tender, 'Tender closed successfully');
  });

  // Award tender to a bid
  awardTender = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { bidId } = req.body;
    const { _id } = req.user!;

    const tender = await Tender.findById(id);
    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    if (tender.postedBy.toString() !== _id) {
      throw new AppError('You do not have permission to award this tender', 403);
    }

    const Bid = (await import('../../models/Bid.model')).Bid;
    const bid = await Bid.findById(bidId);
    if (!bid) {
      throw new AppError('Bid not found', 404);
    }

    if (bid.tender.toString() !== id) {
      throw new AppError('Bid does not belong to this tender', 400);
    }

    tender.status = 'AWARDED';
    tender.awardedTo = bid.business;
    await tender.save();

    bid.status = 'ACCEPTED';
    await bid.save();

    // Reject other bids
    await Bid.updateMany(
      { tender: id, _id: { $ne: bidId } },
      { status: 'REJECTED' }
    );

    ApiResponse.success(res, tender, 'Tender awarded successfully');
  });

  // Delete tender
  deleteTender = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { _id } = req.user!;

    const tender = await Tender.findById(id);
    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    if (tender.postedBy.toString() !== _id) {
      throw new AppError('You do not have permission to delete this tender', 403);
    }

    if (tender.bidsCount > 0) {
      throw new AppError('Cannot delete tender with bids', 400);
    }

    await Tender.findByIdAndDelete(id);

    ApiResponse.success(res, null, 'Tender deleted successfully');
  });
}

export const tenderController = new TenderController();
