import { Request, Response, NextFunction } from 'express';
import { logger } from '../shared/utils/logger';
import { ApiResponse } from '../shared/utils/apiResponse';
import { config } from '../config/environment';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`${err.name}: ${err.message}`);
  if (config.nodeEnv === 'development') {
    logger.error(err.stack);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new AppError(message, 409);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    error = new AppError(messages.join(', '), 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401);
  }

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new AppError('File too large', 400);
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      error = new AppError('Unexpected file field', 400);
    }
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  ApiResponse.error(
    res,
    message,
    statusCode,
    config.nodeEnv === 'development' ? [{ stack: err.stack }] : undefined
  );
};

export const notFound = (req: Request, res: Response, _next: NextFunction): void => {
  ApiResponse.notFound(res, `Route ${req.originalUrl} not found`);
};
