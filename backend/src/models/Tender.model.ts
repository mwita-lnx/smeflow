import mongoose, { Schema, Document } from 'mongoose';

export interface ITender extends Document {
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: Date;
  location: {
    county: string;
    subCounty?: string;
  };
  requirements: string[];
  attachments: string[];
  postedBy: mongoose.Types.ObjectId;
  postedByRole: 'CONSUMER';
  status: 'OPEN' | 'CLOSED' | 'AWARDED' | 'CANCELLED';
  bidsCount: number;
  awardedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const tenderSchema = new Schema<ITender>(
  {
    title: {
      type: String,
      required: [true, 'Tender title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    budget: {
      min: {
        type: Number,
        required: [true, 'Minimum budget is required'],
        min: [0, 'Budget cannot be negative'],
      },
      max: {
        type: Number,
        required: [true, 'Maximum budget is required'],
        min: [0, 'Budget cannot be negative'],
      },
      currency: {
        type: String,
        default: 'KES',
      },
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: 'Deadline must be in the future',
      },
    },
    location: {
      county: {
        type: String,
        required: [true, 'County is required'],
      },
      subCounty: String,
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    attachments: [
      {
        type: String,
      },
    ],
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postedByRole: {
      type: String,
      enum: ['CONSUMER'],
      default: 'CONSUMER',
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED', 'AWARDED', 'CANCELLED'],
      default: 'OPEN',
    },
    bidsCount: {
      type: Number,
      default: 0,
    },
    awardedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
tenderSchema.index({ postedBy: 1, status: 1 });
tenderSchema.index({ category: 1, status: 1 });
tenderSchema.index({ deadline: 1, status: 1 });
tenderSchema.index({ 'location.county': 1, status: 1 });

// Virtual populate bids
tenderSchema.virtual('bids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'tender',
});

export const Tender = mongoose.model<ITender>('Tender', tenderSchema);
