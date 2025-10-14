import mongoose, { Schema, Document } from 'mongoose';
import { PAYMENT_STATUS } from '../config/constants';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  business?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  mpesaReceiptNumber?: string;
  phoneNumber?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },
    currency: {
      type: String,
      default: 'KES',
      uppercase: true,
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['MPESA', 'CARD', 'BANK'],
      default: 'MPESA',
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true,
      index: true,
    },
    mpesaReceiptNumber: {
      type: String,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      match: [/^\+254[0-9]{9}$/, 'Please provide a valid Kenyan phone number (+254...)'],
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ status: 1, createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
