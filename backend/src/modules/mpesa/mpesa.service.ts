import { MpesaTransaction, IMpesaTransaction } from '../../models/MpesaTransaction.model';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../shared/utils/logger';
import crypto from 'crypto';

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
  userId?: string;
  businessId?: string;
  orderId?: string;
  tenderId?: string;
  metadata?: any;
}

interface STKPushResponse {
  merchantRequestID: string;
  checkoutRequestID: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
}

interface TransactionStatusResponse {
  status: string;
  resultCode?: string;
  resultDesc?: string;
  mpesaReceiptNumber?: string;
  transactionDate?: Date;
  amount?: number;
}

export class MpesaService {
  /**
   * Simulate M-Pesa STK Push (Lipa Na M-Pesa Online)
   * In production, this would call the actual Safaricom API
   */
  async initiateSTKPush(data: STKPushRequest): Promise<STKPushResponse> {
    try {
      // Validate phone number (Kenyan format)
      if (!this.validatePhoneNumber(data.phoneNumber)) {
        throw new AppError('Invalid phone number format. Use +254XXXXXXXXX', 400);
      }

      // Validate amount
      if (data.amount < 1) {
        throw new AppError('Amount must be at least KES 1', 400);
      }

      // Generate unique request IDs
      const merchantRequestID = this.generateRequestID('MR');
      const checkoutRequestID = this.generateRequestID('CR');

      // Create transaction record
      const transaction = await MpesaTransaction.create({
        merchantRequestID,
        checkoutRequestID,
        phoneNumber: data.phoneNumber,
        amount: data.amount,
        accountReference: data.accountReference,
        transactionDesc: data.transactionDesc,
        user: data.userId,
        business: data.businessId,
        order: data.orderId,
        tender: data.tenderId,
        status: 'PENDING',
        isSimulation: true,
        metadata: data.metadata,
      });

      logger.info(`M-Pesa STK Push initiated: ${checkoutRequestID}`);

      // Simulate STK push (in production, call Safaricom API here)
      // Auto-complete after 5 seconds in simulation mode
      this.simulatePaymentCallback(checkoutRequestID);

      return {
        merchantRequestID,
        checkoutRequestID,
        responseCode: '0',
        responseDescription: 'Success. Request accepted for processing',
        customerMessage: 'Success. Request accepted for processing',
      };
    } catch (error: any) {
      logger.error('M-Pesa STK Push error:', error);
      throw error;
    }
  }

  /**
   * Query transaction status
   */
  async queryTransactionStatus(
    checkoutRequestID: string
  ): Promise<TransactionStatusResponse> {
    try {
      const transaction = await MpesaTransaction.findOne({ checkoutRequestID });

      if (!transaction) {
        throw new AppError('Transaction not found', 404);
      }

      return {
        status: transaction.status,
        resultCode: transaction.resultCode,
        resultDesc: transaction.resultDesc,
        mpesaReceiptNumber: transaction.mpesaReceiptNumber,
        transactionDate: transaction.transactionDate,
        amount: transaction.paidAmount,
      };
    } catch (error: any) {
      logger.error('Query transaction status error:', error);
      throw error;
    }
  }

  /**
   * Process M-Pesa callback (webhook)
   * In production, this would be called by Safaricom servers
   */
  async processCallback(callbackData: any): Promise<void> {
    try {
      const { Body } = callbackData;
      const { stkCallback } = Body;

      const {
        MerchantRequestID,
        CheckoutRequestID,
        ResultCode,
        ResultDesc,
        CallbackMetadata,
      } = stkCallback;

      const transaction = await MpesaTransaction.findOne({
        checkoutRequestID: CheckoutRequestID,
      });

      if (!transaction) {
        logger.error(`Transaction not found: ${CheckoutRequestID}`);
        return;
      }

      // Update transaction
      transaction.callbackReceived = true;
      transaction.callbackData = callbackData;
      transaction.resultCode = ResultCode.toString();
      transaction.resultDesc = ResultDesc;

      if (ResultCode === 0) {
        // Successful payment
        const items = CallbackMetadata?.Item || [];
        const amountItem = items.find((item: any) => item.Name === 'Amount');
        const receiptItem = items.find(
          (item: any) => item.Name === 'MpesaReceiptNumber'
        );
        const transDateItem = items.find(
          (item: any) => item.Name === 'TransactionDate'
        );

        transaction.status = 'SUCCESS';
        transaction.paidAmount = amountItem?.Value || transaction.amount;
        transaction.mpesaReceiptNumber = receiptItem?.Value;
        transaction.transactionDate = transDateItem?.Value
          ? this.parseMpesaDate(transDateItem.Value)
          : new Date();

        logger.info(
          `Payment successful: ${transaction.mpesaReceiptNumber} - KES ${transaction.paidAmount}`
        );
      } else {
        // Failed payment
        transaction.status = 'FAILED';
        logger.info(`Payment failed: ${CheckoutRequestID} - ${ResultDesc}`);
      }

      await transaction.save();
    } catch (error: any) {
      logger.error('Process callback error:', error);
      throw error;
    }
  }

  /**
   * Get user transactions
   */
  async getUserTransactions(
    userId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      MpesaTransaction.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('business', 'businessName')
        .lean(),
      MpesaTransaction.countDocuments({ user: userId }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get business transactions
   */
  async getBusinessTransactions(
    businessId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      MpesaTransaction.find({ business: businessId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'firstName lastName email phone')
        .lean(),
      MpesaTransaction.countDocuments({ business: businessId }),
    ]);

    // Calculate totals
    const successfulTransactions = await MpesaTransaction.find({
      business: businessId,
      status: 'SUCCESS',
    });

    const totalRevenue = successfulTransactions.reduce(
      (sum, txn) => sum + (txn.paidAmount || 0),
      0
    );

    return {
      transactions,
      summary: {
        totalRevenue,
        totalTransactions: total,
        successfulTransactions: successfulTransactions.length,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Helper: Validate Kenyan phone number
   */
  private validatePhoneNumber(phoneNumber: string): boolean {
    // Kenyan phone number format: +254XXXXXXXXX or 254XXXXXXXXX or 07XXXXXXXX
    const regex = /^(\+?254|0)[17]\d{8}$/;
    return regex.test(phoneNumber);
  }

  /**
   * Helper: Format phone number to M-Pesa format (254...)
   */
  private formatPhoneNumber(phoneNumber: string): string {
    let formatted = phoneNumber.replace(/\s+/g, '');

    if (formatted.startsWith('+')) {
      formatted = formatted.substring(1);
    }

    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    }

    return formatted;
  }

  /**
   * Helper: Generate unique request ID
   */
  private generateRequestID(prefix: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Helper: Parse M-Pesa date format (YYYYMMDDHHmmss)
   */
  private parseMpesaDate(dateString: string): Date {
    // Format: 20231105143022 -> 2023-11-05 14:30:22
    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(4, 6)) - 1;
    const day = parseInt(dateString.substring(6, 8));
    const hour = parseInt(dateString.substring(8, 10));
    const minute = parseInt(dateString.substring(10, 12));
    const second = parseInt(dateString.substring(12, 14));

    return new Date(year, month, day, hour, minute, second);
  }

  /**
   * Simulate payment callback (for testing only)
   */
  private async simulatePaymentCallback(checkoutRequestID: string) {
    setTimeout(async () => {
      try {
        const transaction = await MpesaTransaction.findOne({ checkoutRequestID });

        if (!transaction) return;

        // 90% success rate in simulation
        const isSuccess = Math.random() > 0.1;

        const callbackData = {
          Body: {
            stkCallback: {
              MerchantRequestID: transaction.merchantRequestID,
              CheckoutRequestID: checkoutRequestID,
              ResultCode: isSuccess ? 0 : 1032,
              ResultDesc: isSuccess
                ? 'The service request is processed successfully.'
                : 'Request cancelled by user',
              CallbackMetadata: isSuccess
                ? {
                    Item: [
                      {
                        Name: 'Amount',
                        Value: transaction.amount,
                      },
                      {
                        Name: 'MpesaReceiptNumber',
                        Value: `SIM${Date.now()}`,
                      },
                      {
                        Name: 'TransactionDate',
                        Value: new Date()
                          .toISOString()
                          .replace(/[-:T.]/g, '')
                          .substring(0, 14),
                      },
                      {
                        Name: 'PhoneNumber',
                        Value: transaction.phoneNumber,
                      },
                    ],
                  }
                : undefined,
            },
          },
        };

        await this.processCallback(callbackData);
        logger.info(`Simulated callback processed for: ${checkoutRequestID}`);
      } catch (error) {
        logger.error('Simulate callback error:', error);
      }
    }, 5000); // 5 seconds delay
  }
}

export const mpesaService = new MpesaService();
