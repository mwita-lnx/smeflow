import { Request, Response } from 'express';
import { businessService } from './business.service';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AuthRequest } from '../../shared/interfaces';

export class BusinessController {
  createBusiness = asyncHandler(async (req: AuthRequest, res: Response) => {
    const business = await businessService.createBusiness(req.user!._id, req.body);
    ApiResponse.created(res, business, 'Business created successfully');
  });

  updateBusiness = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const business = await businessService.updateBusiness(id, req.user!._id, req.body);
    ApiResponse.success(res, business, 'Business updated successfully');
  });

  uploadImages = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const files = req.files as { logo?: Express.Multer.File[]; coverImage?: Express.Multer.File[] };
    const business = await businessService.uploadBusinessImages(id, req.user!._id, files);
    ApiResponse.success(res, business, 'Images uploaded successfully');
  });

  getBusinessById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const business = await businessService.getBusinessById(id);
    ApiResponse.success(res, business);
  });

  getBusinessBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const business = await businessService.getBusinessBySlug(slug);
    ApiResponse.success(res, business);
  });

  incrementView = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await businessService.incrementViewCount(id);
    ApiResponse.success(res, null);
  });

  searchBusinesses = asyncHandler(async (req: Request, res: Response) => {
    const result = await businessService.searchBusinesses(req.query);
    ApiResponse.success(res, result);
  });

  deleteBusiness = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await businessService.deleteBusiness(id, req.user!._id);
    ApiResponse.success(res, null, 'Business deleted successfully');
  });

  getNearbyBusinesses = asyncHandler(async (req: Request, res: Response) => {
    const { longitude, latitude, maxDistance } = req.query;
    const businesses = await businessService.getNearbyBusinesses(
      parseFloat(longitude as string),
      parseFloat(latitude as string),
      maxDistance ? parseInt(maxDistance as string) : undefined
    );
    ApiResponse.success(res, businesses);
  });
}

export const businessController = new BusinessController();
