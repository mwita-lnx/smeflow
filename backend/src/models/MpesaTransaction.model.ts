import mongoose, { Schema, Document } from 'mongoose';

export interface IMpesaTransaction extends Document {
  // Transaction identifiers
  merchantRequestID: string;
  checkoutRequestID: string;
  mpesaReceiptNumber?: string;
  transactionID?: string;

  // Transaction details
  phoneNumber: string;
  amount: number;
  accountReference: string; // Order ID, Invoice Number, etc.
  transactionDesc: string;

  // Related entities
  user?: mongoose.Types.ObjectId;
  business?: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  tender?: mongoose.Types.ObjectId;

  // Transaction status
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'TIMEOUT';
  resultCode?: string;
  resultDesc?: string;

  // Payment details
  transactionDate?: Date;
  paidAmount?: number;
  balance?: number;

  // Callback data
  callbackReceived: boolean;
  callbackData?: any;

  // Metadata
  metadata?: {
    initiatedFrom?: string;
    deviceInfo?: string;
    ipAddress?: string;
    [key: string]: any;
  };

  // Simulation flag (for testing)
  isSimulation: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const MpesaTransactionSchema = new Schema<IMpesaTransaction>(
  {
    merchantRequestID: {
      type: String,
      required: [true, 'Merchant request ID is required'],
      unique: true,
      index: true,
    },
    checkoutRequestID: {
      type: String,
      required: [true, 'Checkout request ID is required'],
      unique: true,
      index: true,
    },
    mpesaReceiptNumber: {
      type: String,
      sparse: true,
      index: true,
    },
    transactionID: {
      type: String,
      sparse: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least 1'],
    },
    accountReference: {
      type: String,
      required: [true, 'Account reference is required'],
      index: true,
    },
    transactionDesc: {
      type: String,
      required: [true, 'Transaction description is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      index: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      index: true,
    },
    tender: {
      type: Schema.Types.ObjectId,
      ref: 'Tender',
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'TIMEOUT'],
      default: 'PENDING',
      index: true,
    },
    resultCode: {
      type: String,
    },
    resultDesc: {
      type: String,
    },
    transactionDate: {
      type: Date,
      index: true,
    },
    paidAmount: {
      type: Number,
    },
    balance: {
      type: Number,
    },
    callbackReceived: {
      type: Boolean,
      default: false,
    },
    callbackData: {
      type: Schema.Types.Mixed,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    isSimulation: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
MpesaTransactionSchema.index({ user: 1, status: 1, createdAt: -1 });
MpesaTransactionSchema.index({ business: 1, status: 1, createdAt: -1 });
MpesaTransactionSchema.index({ status: 1, createdAt: -1 });

// TTL index for pending transactions (expire after 5 minutes)
MpesaTransactionSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 300,
    partialFilterExpression: { status: 'PENDING', isSimulation: false },
  }
);

export const MpesaTransaction = mongoose.model<IMpesaTransaction>(
  'MpesaTransaction',
  MpesaTransactionSchema
);
