import { Response } from 'express';
import { IApiResponse } from '../interfaces';

export class ApiResponse {
  static success<T>(res: Response, data: T, message?: string, statusCode = 200): Response {
    const response: IApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode = 400, errors?: any[]): Response {
    const response: IApiResponse = {
      success: false,
      error: message,
      errors,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message = 'Resource created successfully'): Response {
    return ApiResponse.success(res, data, message, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static unauthorized(res: Response, message = 'Unauthorized access'): Response {
    return ApiResponse.error(res, message, 401);
  }

  static forbidden(res: Response, message = 'Forbidden'): Response {
    return ApiResponse.error(res, message, 403);
  }

  static notFound(res: Response, message = 'Resource not found'): Response {
    return ApiResponse.error(res, message, 404);
  }

  static conflict(res: Response, message = 'Resource already exists'): Response {
    return ApiResponse.error(res, message, 409);
  }

  static validationError(res: Response, errors: any[], message = 'Validation failed'): Response {
    return ApiResponse.error(res, message, 422, errors);
  }

  static serverError(res: Response, message = 'Internal server error'): Response {
    return ApiResponse.error(res, message, 500);
  }
}
