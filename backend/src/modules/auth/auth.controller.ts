import { Request, Response } from 'express';
import { authService } from './auth.service';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AuthRequest } from '../../shared/interfaces';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    ApiResponse.created(res, result, 'Registration successful. Please verify your email and phone.');
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    ApiResponse.success(res, result, 'Login successful');
  });

  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);
    ApiResponse.success(res, result);
  });

  verifyPhone = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { otp } = req.body;
    const result = await authService.verifyPhone(req.user!._id, otp);
    ApiResponse.success(res, result);
  });

  resendPhoneOTP = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await authService.resendPhoneOTP(req.user!._id);
    ApiResponse.success(res, result);
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    ApiResponse.success(res, result);
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    ApiResponse.success(res, result);
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    ApiResponse.success(res, result);
  });

  logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await authService.logout(req.user!._id);
    ApiResponse.success(res, result);
  });

  getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    ApiResponse.success(res, req.user);
  });
}

export const authController = new AuthController();
