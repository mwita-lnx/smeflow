import mongoose, { Schema, Document } from 'mongoose';
import { REVIEW_STATUS, RATING_RANGE } from '../config/constants';

export interface IRating extends Document {
  business: mongoose.Types.ObjectId;
  ratingType: 'BUSINESS';
  user: mongoose.Types.ObjectId;
  rating: number;
  reviewTitle?: string;
  reviewText?: string;
  images: string[];
  qualityRating?: number;
  serviceRating?: number;
  valueRating?: number;
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  businessResponse?: string;
  businessResponseDate?: Date;
  status: 'ACTIVE' | 'FLAGGED' | 'REMOVED';
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    ratingType: {
      type: String,
      enum: ['BUSINESS'],
      default: 'BUSINESS',
      required: [true, 'Rating type is required'],
      index: true,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business reference is required'],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [RATING_RANGE.MIN, `Rating must be at least ${RATING_RANGE.MIN}`],
      max: [RATING_RANGE.MAX, `Rating cannot exceed ${RATING_RANGE.MAX}`],
    },
    reviewTitle: {
      type: String,
      trim: true,
      maxlength: [100, 'Review title cannot exceed 100 characters'],
    },
    reviewText: {
      type: String,
      trim: true,
      maxlength: [2000, 'Review text cannot exceed 2000 characters'],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 5;
        },
        message: 'Cannot upload more than 5 images',
      },
    },
    qualityRating: {
      type: Number,
      min: RATING_RANGE.MIN,
      max: RATING_RANGE.MAX,
    },
    serviceRating: {
      type: Number,
      min: RATING_RANGE.MIN,
      max: RATING_RANGE.MAX,
    },
    valueRating: {
      type: Number,
      min: RATING_RANGE.MIN,
      max: RATING_RANGE.MAX,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    businessResponse: {
      type: String,
      trim: true,
      maxlength: [1000, 'Response cannot exceed 1000 characters'],
    },
    businessResponseDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
      default: REVIEW_STATUS.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per user per business
RatingSchema.index({ business: 1, user: 1 }, { unique: true });

// Index for common queries
RatingSchema.index({ business: 1, status: 1, createdAt: -1 });
RatingSchema.index({ user: 1, createdAt: -1 });

export const Rating = mongoose.model<IRating>('Rating', RatingSchema);
