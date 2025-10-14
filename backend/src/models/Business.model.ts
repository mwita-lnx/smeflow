import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';
import { VERIFICATION_LEVELS, BUSINESS_STATUS } from '../config/constants';
import { IGeoLocation } from '../shared/interfaces';

export interface IBusiness extends Document {
  owner: mongoose.Types.ObjectId;
  businessName: string;
  slug: string;
  category: string;
  subCategory?: string;
  description: string;
  logo?: string;
  coverImage?: string;
  county: string;
  subCounty?: string;
  address?: string;
  location?: IGeoLocation;
  phone?: string;
  email?: string;
  whatsapp?: string;
  mpesaPaybill?: string;
  mpesaTill?: string;
  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  isVerified: boolean;
  verificationLevel: 'BASIC' | 'VERIFIED' | 'PREMIUM';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED';
  viewCount: number;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Business owner is required'],
      index: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [100, 'Business name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Business category is required'],
      index: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Business description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    logo: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    county: {
      type: String,
      required: [true, 'County is required'],
      index: true,
    },
    subCounty: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    phone: {
      type: String,
      match: [/^\+254[0-9]{9}$/, 'Please provide a valid Kenyan phone number (+254...)'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    whatsapp: {
      type: String,
      match: [/^\+254[0-9]{9}$/, 'Please provide a valid Kenyan phone number (+254...)'],
    },
    mpesaPaybill: {
      type: String,
      trim: true,
    },
    mpesaTill: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    facebookUrl: {
      type: String,
      trim: true,
    },
    instagramUrl: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationLevel: {
      type: String,
      enum: Object.values(VERIFICATION_LEVELS),
      default: VERIFICATION_LEVELS.BASIC,
    },
    status: {
      type: String,
      enum: Object.values(BUSINESS_STATUS),
      default: BUSINESS_STATUS.ACTIVE,
      index: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
BusinessSchema.pre('save', async function (next) {
  if (this.isModified('businessName')) {
    const baseSlug = slugify(this.businessName, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await mongoose.model('Business').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

// Geospatial index for location-based queries
BusinessSchema.index({ location: '2dsphere' });

// Text index for search
BusinessSchema.index({ businessName: 'text', description: 'text', category: 'text' });

// Compound indexes for common queries
BusinessSchema.index({ category: 1, county: 1, status: 1 });
BusinessSchema.index({ averageRating: -1, totalReviews: -1 });

export const Business = mongoose.model<IBusiness>('Business', BusinessSchema);
