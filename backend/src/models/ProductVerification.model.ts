import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVerification extends Document {
  product: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  qrCode: string; // Unique QR code identifier
  serialNumber: string; // Product serial number
  batchNumber?: string;
  manufacturingDate?: Date;
  expiryDate?: Date;
  isAuthentic: boolean;
  isActive: boolean;
  scans: Array<{
    scannedBy?: mongoose.Types.ObjectId;
    scannedAt: Date;
    location?: {
      type: string;
      coordinates: [number, number];
    };
    ipAddress?: string;
    deviceInfo?: string;
  }>;
  metadata?: {
    weight?: number;
    dimensions?: string;
    color?: string;
    warranty?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductVerificationSchema = new Schema<IProductVerification>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business reference is required'],
      index: true,
    },
    qrCode: {
      type: String,
      required: [true, 'QR code is required'],
      unique: true,
      index: true,
    },
    serialNumber: {
      type: String,
      required: [true, 'Serial number is required'],
      unique: true,
      index: true,
    },
    batchNumber: {
      type: String,
      index: true,
    },
    manufacturingDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    isAuthentic: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    scans: [
      {
        scannedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        scannedAt: {
          type: Date,
          default: Date.now,
        },
        location: {
          type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
          },
          coordinates: {
            type: [Number],
          },
        },
        ipAddress: String,
        deviceInfo: String,
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
ProductVerificationSchema.index({ 'scans.location': '2dsphere' });

// Index for expiry date queries
ProductVerificationSchema.index({ expiryDate: 1 });

// Virtual for total scans
ProductVerificationSchema.virtual('totalScans').get(function () {
  return this.scans.length;
});

export const ProductVerification = mongoose.model<IProductVerification>(
  'ProductVerification',
  ProductVerificationSchema
);
