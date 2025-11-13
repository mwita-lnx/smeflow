import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AuthRequest } from '../../shared/interfaces';
import { mpesaService } from './mpesa.service';
import { AppError } from '../../middleware/errorHandler';

export class MpesaController {
  // Initiate STK Push
  initiatePayment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { phoneNumber, amount, accountReference, transactionDesc, businessId, orderId, tenderId } =
      req.body;
    const userId = req.user?._id;

    const result = await mpesaService.initiateSTKPush({
      phoneNumber,
      amount,
      accountReference,
      transactionDesc,
      userId,
      businessId,
      orderId,
      tenderId,
      metadata: {
        initiatedFrom: 'web',
        ipAddress: req.ip,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully. Please enter your M-Pesa PIN on your phone.',
      data: result,
    });
  });

  // Query transaction status
  queryStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { checkoutRequestID } = req.params;

    const result = await mpesaService.queryTransactionStatus(checkoutRequestID);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  // M-Pesa callback webhook
  callback = asyncHandler(async (req: Request, res: Response) => {
    await mpesaService.processCallback(req.body);

    res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Success',
    });
  });

  // Get user transactions
  getUserTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await mpesaService.getUserTransactions(userId, page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  // Get business transactions
  getBusinessTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { businessId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    // Verify user owns the business
    // This would be implemented in actual authorization middleware

    const result = await mpesaService.getBusinessTransactions(businessId, page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  });
}

export const mpesaController = new MpesaController();
