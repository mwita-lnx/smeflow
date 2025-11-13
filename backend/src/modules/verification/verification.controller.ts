import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AuthRequest } from '../../shared/interfaces';
import { verificationService } from './verification.service';

export class VerificationController {
  // Create product verification
  createVerification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { productId, businessId, batchNumber, manufacturingDate, expiryDate, metadata } =
      req.body;

    const verification = await verificationService.createProductVerification({
      productId,
      businessId,
      batchNumber,
      manufacturingDate,
      expiryDate,
      metadata,
    });

    res.status(201).json({
      success: true,
      message: 'Product verification created successfully',
      data: verification,
    });
  });

  // Verify product by scanning QR code
  verifyProduct = asyncHandler(async (req: Request, res: Response) => {
    const { qrCode } = req.params;
    const { latitude, longitude, deviceInfo } = req.body;
    const userId = (req as AuthRequest).user?._id;

    const location =
      latitude && longitude ? { latitude: parseFloat(latitude), longitude: parseFloat(longitude) } : undefined;

    const result = await verificationService.verifyProduct({
      qrCode,
      scannedBy: userId,
      location,
      ipAddress: req.ip,
      deviceInfo,
    });

    res.status(200).json({
      success: result.verified,
      message: result.message,
      data: result,
    });
  });

  // Get verification by serial number
  getBySerialNumber = asyncHandler(async (req: Request, res: Response) => {
    const { serialNumber } = req.params;

    const verification = await verificationService.getBySerialNumber(serialNumber);

    res.status(200).json({
      success: true,
      data: verification,
    });
  });

  // Get product verifications
  getProductVerifications = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await verificationService.getProductVerifications(productId, page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  // Get business verifications
  getBusinessVerifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { businessId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await verificationService.getBusinessVerifications(businessId, page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  // Get scan history
  getScanHistory = asyncHandler(async (req: Request, res: Response) => {
    const { qrCode } = req.params;

    const result = await verificationService.getScanHistory(qrCode);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  // Mark as counterfeit
  markAsCounterfeit = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { verificationId } = req.params;
    const { reason } = req.body;

    const verification = await verificationService.markAsCounterfeit(verificationId, reason);

    res.status(200).json({
      success: true,
      message: 'Product marked as counterfeit',
      data: verification,
    });
  });

  // Deactivate verification
  deactivateVerification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { verificationId } = req.params;

    const verification = await verificationService.deactivateVerification(verificationId);

    res.status(200).json({
      success: true,
      message: 'Verification deactivated',
      data: verification,
    });
  });

  // Bulk create verifications
  bulkCreate = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { productId, businessId, quantity, batchNumber, manufacturingDate, expiryDate, metadata } =
      req.body;

    const verifications = await verificationService.bulkCreateVerifications(
      productId,
      businessId,
      quantity,
      {
        batchNumber,
        manufacturingDate,
        expiryDate,
        metadata,
      }
    );

    res.status(201).json({
      success: true,
      message: `${verifications.length} verifications created successfully`,
      data: {
        count: verifications.length,
        verifications: verifications.slice(0, 10), // Return first 10
      },
    });
  });
}

export const verificationController = new VerificationController();
