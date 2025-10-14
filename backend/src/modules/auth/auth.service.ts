import { User } from '../../models/User.model';
import { IUser } from '../../shared/interfaces';
import { JWTUtils } from '../../shared/utils/jwt';
import { generateOtp, generateToken } from '../../shared/utils/generateOtp';
import { emailService } from '../../services/email.service';
import { smsService } from '../../services/sms.service';
import { AppError } from '../../middleware/errorHandler';
import { OTP_EXPIRY, PASSWORD_RESET_EXPIRY } from '../../config/constants';

interface RegisterDTO {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'SME' | 'CONSUMER' | 'BROKER';
}

interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterDTO) {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { phone: data.phone }],
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new AppError('Email already registered', 409);
      }
      if (existingUser.phone === data.phone) {
        throw new AppError('Phone number already registered', 409);
      }
    }

    // Generate verification tokens
    const emailVerificationToken = generateToken();
    const phoneVerificationOtp = generateOtp();

    // Create user
    const user = await User.create({
      ...data,
      emailVerificationToken,
      phoneVerificationOtp,
      phoneVerificationOtpExpires: new Date(Date.now() + OTP_EXPIRY),
    });

    // Send verification emails/SMS
    await Promise.all([
      emailService.sendVerificationEmail(user.email, emailVerificationToken),
      smsService.sendOTP(user.phone, phoneVerificationOtp),
    ]);

    // Generate tokens
    const tokens = JWTUtils.generateTokens({
      userId: user._id,
      role: user.role,
    });

    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(data: LoginDTO) {
    // Find user with password field
    const user = await User.findOne({ email: data.email }).select('+password');

    if (!user || !(await user.comparePassword(data.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const tokens = JWTUtils.generateTokens({
      userId: user._id,
      role: user.role,
    });

    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async verifyEmail(token: string) {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.firstName);

    return { message: 'Email verified successfully' };
  }

  async verifyPhone(userId: string, otp: string) {
    const user = await User.findById(userId).select(
      '+phoneVerificationOtp +phoneVerificationOtpExpires'
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!user.phoneVerificationOtp || !user.phoneVerificationOtpExpires) {
      throw new AppError('No OTP found. Please request a new one', 400);
    }

    if (user.phoneVerificationOtpExpires < new Date()) {
      throw new AppError('OTP has expired. Please request a new one', 400);
    }

    if (user.phoneVerificationOtp !== otp) {
      throw new AppError('Invalid OTP', 400);
    }

    user.isPhoneVerified = true;
    user.phoneVerificationOtp = undefined;
    user.phoneVerificationOtpExpires = undefined;
    await user.save();

    return { message: 'Phone verified successfully' };
  }

  async resendPhoneOTP(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.isPhoneVerified) {
      throw new AppError('Phone already verified', 400);
    }

    const otp = generateOtp();
    user.phoneVerificationOtp = otp;
    user.phoneVerificationOtpExpires = new Date(Date.now() + OTP_EXPIRY);
    await user.save();

    await smsService.sendOTP(user.phone, otp);

    return { message: 'OTP sent successfully' };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If your email is registered, you will receive a password reset link' };
    }

    const resetToken = generateToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_EXPIRY);
    await user.save();

    await emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = JWTUtils.verifyRefreshToken(refreshToken);

      const user = await User.findById(decoded.userId).select('+refreshToken');

      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      const tokens = JWTUtils.generateTokens({
        userId: user._id,
        role: user.role,
      });

      user.refreshToken = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: undefined });
    return { message: 'Logged out successfully' };
  }

  private sanitizeUser(user: IUser) {
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.emailVerificationToken;
    delete userObj.phoneVerificationOtp;
    delete userObj.phoneVerificationOtpExpires;
    delete userObj.passwordResetToken;
    delete userObj.passwordResetExpires;
    delete userObj.refreshToken;
    return userObj;
  }
}

export const authService = new AuthService();
