import { Response } from 'express';
import { AuthRequest } from '../../shared/interfaces';
import { User } from '../../models/User.model';
import { Business } from '../../models/Business.model';
import { Rating } from '../../models/Rating.model';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AppError } from '../../middleware/errorHandler';

export class UserController {
  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { firstName, lastName, phone } = req.body;

    const user = await User.findById(req.user!._id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if phone is being changed and if it's already taken
    if (phone && phone !== user.phone) {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        throw new AppError('Phone number already in use', 409);
      }
      user.phone = phone;
      user.isPhoneVerified = false; // Need to re-verify new phone
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();

    ApiResponse.success(res, user, 'Profile updated successfully');
  });

  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user!._id).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    ApiResponse.success(res, null, 'Password changed successfully');
  });

  getUserBusinesses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.params.userId || req.user!._id;

    const businesses = await Business.find({ owner: userId }).sort({ createdAt: -1 });

    ApiResponse.success(res, businesses);
  });

  getUserReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.params.userId || req.user!._id;

    const reviews = await Rating.find({ user: userId })
      .populate('business', 'businessName slug logo')
      .sort({ createdAt: -1 });

    ApiResponse.success(res, reviews);
  });

  deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { password } = req.body;

    const user = await User.findById(req.user!._id).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Password is incorrect', 400);
    }

    // Soft delete - you might want to keep the data but mark as deleted
    // Or hard delete based on your requirements
    await User.findByIdAndDelete(user._id);

    // Optionally delete user's businesses and reviews
    // await Business.deleteMany({ owner: user._id });
    // await Rating.deleteMany({ user: user._id });

    ApiResponse.success(res, null, 'Account deleted successfully');
  });
}

export const userController = new UserController();
