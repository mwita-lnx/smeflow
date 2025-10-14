import mongoose, { Schema, Document } from 'mongoose';

export interface IBid extends Document {
  tender: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  proposal: string;
  deliveryTime: number; // in days
  attachments: string[];
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  createdAt: Date;
  updatedAt: Date;
}

const bidSchema = new Schema<IBid>(
  {
    tender: {
      type: Schema.Types.ObjectId,
      ref: 'Tender',
      required: true,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'KES',
    },
    proposal: {
      type: String,
      required: [true, 'Proposal is required'],
      trim: true,
    },
    deliveryTime: {
      type: Number,
      required: [true, 'Delivery time is required'],
      min: [1, 'Delivery time must be at least 1 day'],
    },
    attachments: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bidSchema.index({ tender: 1, business: 1 }, { unique: true }); // One bid per business per tender
bidSchema.index({ business: 1, status: 1 });
bidSchema.index({ tender: 1, status: 1 });

// Update tender's bid count when a bid is created
bidSchema.post('save', async function () {
  const Tender = mongoose.model('Tender');
  await Tender.findByIdAndUpdate(this.tender, {
    $inc: { bidsCount: 1 },
  });
});

export const Bid = mongoose.model<IBid>('Bid', bidSchema);
