import { Response, NextFunction } from 'express';
import { AuthRequest, IUser } from '../shared/interfaces';
import { JWTUtils } from '../shared/utils/jwt';
import { ApiResponse } from '../shared/utils/apiResponse';
import { User } from '../models/User.model';
import { USER_ROLES } from '../config/constants';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      ApiResponse.unauthorized(res, 'No token provided');
      return;
    }

    const decoded = JWTUtils.verifyAccessToken(token);

    const user = await User.findById(decoded.userId);

    if (!user) {
      ApiResponse.unauthorized(res, 'User not found');
      return;
    }

    req.user = user as IUser;
    next();
  } catch (error) {
    ApiResponse.unauthorized(res, 'Invalid or expired token');
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.unauthorized(res);
      return;
    }

    if (!roles.includes(req.user.role)) {
      ApiResponse.forbidden(res, 'You do not have permission to access this resource');
      return;
    }

    next();
  };
};

export const isBusinessOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    ApiResponse.unauthorized(res);
    return;
  }

  if (req.user.role !== USER_ROLES.SME && req.user.role !== USER_ROLES.ADMIN) {
    ApiResponse.forbidden(res, 'Only business owners can access this resource');
    return;
  }

  next();
};
