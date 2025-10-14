import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  business: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'KES',
      uppercase: true,
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ProductSchema.index({ business: 1, isAvailable: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
