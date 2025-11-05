import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  business: mongoose.Types.ObjectId;
  eventType: 'VIEW' | 'CLICK' | 'CONTACT_CLICK' | 'PRODUCT_VIEW' | 'SHARE';
  userId?: mongoose.Types.ObjectId;
  userRole?: 'CONSUMER' | 'SME' | 'ADMIN';
  metadata?: {
    productId?: string;
    source?: string; // 'search', 'category', 'featured', 'direct'
    deviceType?: string;
    location?: {
      county?: string;
      coordinates?: [number, number];
    };
  };
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: ['VIEW', 'CLICK', 'CONTACT_CLICK', 'PRODUCT_VIEW', 'SHARE'],
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    userRole: {
      type: String,
      enum: ['CONSUMER', 'SME', 'ADMIN'],
    },
    metadata: {
      productId: String,
      source: {
        type: String,
        enum: ['search', 'category', 'featured', 'direct', 'nearby'],
      },
      deviceType: String,
      location: {
        county: String,
        coordinates: [Number],
      },
    },
    sessionId: String,
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient querying
analyticsSchema.index({ business: 1, createdAt: -1 });
analyticsSchema.index({ business: 1, eventType: 1, createdAt: -1 });
analyticsSchema.index({ createdAt: -1 });

// TTL index to auto-delete old analytics after 1 year
analyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema);
