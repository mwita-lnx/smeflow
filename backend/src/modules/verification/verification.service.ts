import {
  ProductVerification,
  IProductVerification,
} from '../../models/ProductVerification.model';
import { Product } from '../../models/Product.model';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../shared/utils/logger';
import crypto from 'crypto';

interface CreateVerificationData {
  productId: string;
  businessId: string;
  batchNumber?: string;
  manufacturingDate?: Date;
  expiryDate?: Date;
  metadata?: any;
}

interface ScanData {
  qrCode: string;
  scannedBy?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  ipAddress?: string;
  deviceInfo?: string;
}

export class VerificationService {
  /**
   * Generate QR code verification for a product
   */
  async createProductVerification(
    data: CreateVerificationData
  ): Promise<IProductVerification> {
    try {
      // Verify product exists
      const product = await Product.findById(data.productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Generate unique QR code and serial number
      const qrCode = this.generateQRCode();
      const serialNumber = this.generateSerialNumber(data.productId);

      const verification = await ProductVerification.create({
        product: data.productId,
        business: data.businessId,
        qrCode,
        serialNumber,
        batchNumber: data.batchNumber,
        manufacturingDate: data.manufacturingDate,
        expiryDate: data.expiryDate,
        isAuthentic: true,
        isActive: true,
        metadata: data.metadata,
        scans: [],
      });

      logger.info(`Product verification created: ${qrCode}`);

      return verification;
    } catch (error: any) {
      logger.error('Create verification error:', error);
      throw error;
    }
  }

  /**
   * Verify product by QR code
   */
  async verifyProduct(scanData: ScanData) {
    try {
      const verification = await ProductVerification.findOne({
        qrCode: scanData.qrCode,
      })
        .populate('product', 'name description price images category')
        .populate('business', 'businessName phone email county');

      if (!verification) {
        return {
          isValid: false,
          message: 'Invalid QR code. Product verification not found.',
          verified: false,
        };
      }

      if (!verification.isActive) {
        return {
          isValid: false,
          message: 'This product verification has been deactivated.',
          verified: false,
        };
      }

      if (!verification.isAuthentic) {
        return {
          isValid: false,
          message: 'Warning: This product has been marked as counterfeit!',
          verified: false,
        };
      }

      // Check expiry date
      if (verification.expiryDate && verification.expiryDate < new Date()) {
        return {
          isValid: false,
          message: 'Warning: This product has expired!',
          product: verification,
          verified: false,
        };
      }

      // Record the scan
      const scanRecord: any = {
        scannedAt: new Date(),
        ipAddress: scanData.ipAddress,
        deviceInfo: scanData.deviceInfo,
      };

      if (scanData.scannedBy) {
        scanRecord.scannedBy = scanData.scannedBy;
      }

      if (scanData.location) {
        scanRecord.location = {
          type: 'Point',
          coordinates: [scanData.location.longitude, scanData.location.latitude],
        };
      }

      verification.scans.push(scanRecord);
      await verification.save();

      logger.info(`Product verified: ${scanData.qrCode} - Scan #${verification.scans.length}`);

      return {
        isValid: true,
        message: 'Product is authentic and verified!',
        product: verification,
        verified: true,
        scanCount: verification.scans.length,
      };
    } catch (error: any) {
      logger.error('Verify product error:', error);
      throw error;
    }
  }

  /**
   * Get verification details by serial number
   */
  async getBySerialNumber(serialNumber: string) {
    try {
      const verification = await ProductVerification.findOne({ serialNumber })
        .populate('product')
        .populate('business');

      if (!verification) {
        throw new AppError('Product verification not found', 404);
      }

      return verification;
    } catch (error: any) {
      logger.error('Get by serial number error:', error);
      throw error;
    }
  }

  /**
   * Get all verifications for a product
   */
  async getProductVerifications(productId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [verifications, total] = await Promise.all([
      ProductVerification.find({ product: productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProductVerification.countDocuments({ product: productId }),
    ]);

    return {
      verifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all verifications for a business
   */
  async getBusinessVerifications(
    businessId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const [verifications, total] = await Promise.all([
      ProductVerification.find({ business: businessId })
        .populate('product', 'name price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProductVerification.countDocuments({ business: businessId }),
    ]);

    // Calculate statistics
    const stats = await ProductVerification.aggregate([
      { $match: { business: businessId } },
      {
        $group: {
          _id: null,
          totalVerifications: { $sum: 1 },
          totalScans: { $sum: { $size: '$scans' } },
          activeVerifications: {
            $sum: { $cond: ['$isActive', 1, 0] },
          },
          authenticVerifications: {
            $sum: { $cond: ['$isAuthentic', 1, 0] },
          },
        },
      },
    ]);

    return {
      verifications,
      stats: stats[0] || {
        totalVerifications: 0,
        totalScans: 0,
        activeVerifications: 0,
        authenticVerifications: 0,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark product as counterfeit
   */
  async markAsCounterfeit(verificationId: string, reason?: string) {
    try {
      const verification = await ProductVerification.findById(verificationId);

      if (!verification) {
        throw new AppError('Verification not found', 404);
      }

      verification.isAuthentic = false;
      verification.isActive = false;
      if (reason) {
        verification.metadata = {
          ...verification.metadata,
          counterfeitReason: reason,
          markedCounterfeitAt: new Date(),
        };
      }

      await verification.save();

      logger.info(`Product marked as counterfeit: ${verification.qrCode}`);

      return verification;
    } catch (error: any) {
      logger.error('Mark as counterfeit error:', error);
      throw error;
    }
  }

  /**
   * Deactivate verification
   */
  async deactivateVerification(verificationId: string) {
    try {
      const verification = await ProductVerification.findByIdAndUpdate(
        verificationId,
        { isActive: false },
        { new: true }
      );

      if (!verification) {
        throw new AppError('Verification not found', 404);
      }

      logger.info(`Verification deactivated: ${verification.qrCode}`);

      return verification;
    } catch (error: any) {
      logger.error('Deactivate verification error:', error);
      throw error;
    }
  }

  /**
   * Get scan history for a verification
   */
  async getScanHistory(qrCode: string) {
    try {
      const verification = await ProductVerification.findOne({ qrCode })
        .populate('scans.scannedBy', 'firstName lastName email')
        .select('qrCode serialNumber scans product business');

      if (!verification) {
        throw new AppError('Verification not found', 404);
      }

      return {
        qrCode: verification.qrCode,
        serialNumber: verification.serialNumber,
        totalScans: verification.scans.length,
        scans: verification.scans,
      };
    } catch (error: any) {
      logger.error('Get scan history error:', error);
      throw error;
    }
  }

  /**
   * Helper: Generate unique QR code
   */
  private generateQRCode(): string {
    const prefix = 'SF'; // SmeFlow
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(6).toString('hex').toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Helper: Generate serial number
   */
  private generateSerialNumber(productId: string): string {
    const productPrefix = productId.substring(productId.length - 6).toUpperCase();
    const timestamp = Date.now().toString();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `SN${productPrefix}${timestamp.substring(timestamp.length - 8)}${random}`;
  }

  /**
   * Bulk create verifications for a product batch
   */
  async bulkCreateVerifications(
    productId: string,
    businessId: string,
    quantity: number,
    batchData?: {
      batchNumber?: string;
      manufacturingDate?: Date;
      expiryDate?: Date;
      metadata?: any;
    }
  ) {
    try {
      if (quantity > 1000) {
        throw new AppError('Maximum 1000 verifications can be created at once', 400);
      }

      const verifications = [];

      for (let i = 0; i < quantity; i++) {
        verifications.push({
          product: productId,
          business: businessId,
          qrCode: this.generateQRCode(),
          serialNumber: this.generateSerialNumber(productId),
          batchNumber: batchData?.batchNumber,
          manufacturingDate: batchData?.manufacturingDate,
          expiryDate: batchData?.expiryDate,
          isAuthentic: true,
          isActive: true,
          metadata: batchData?.metadata,
          scans: [],
        });
      }

      const created = await ProductVerification.insertMany(verifications);

      logger.info(`Bulk created ${created.length} verifications for product ${productId}`);

      return created;
    } catch (error: any) {
      logger.error('Bulk create verifications error:', error);
      throw error;
    }
  }
}

export const verificationService = new VerificationService();
