import { config } from '../config/environment';
import { logger } from '../shared/utils/logger';

// Note: Africa's Talking SDK would be imported here
// For now, we'll create a mock service structure

interface SMSOptions {
  to: string[];
  message: string;
}

class SMSService {
  private username: string;
  private apiKey: string;
  private senderId: string;

  constructor() {
    this.username = config.sms.username;
    this.apiKey = config.sms.apiKey;
    this.senderId = config.sms.senderId;
  }

  async sendSMS(options: SMSOptions): Promise<void> {
    try {
      // In production, use Africa's Talking SDK
      if (config.nodeEnv === 'development' || !this.apiKey) {
        logger.info(`[DEV] SMS to ${options.to.join(', ')}: ${options.message}`);
        return;
      }

      // Production code would look like:
      // const africastalking = require('africastalking')({
      //   username: this.username,
      //   apiKey: this.apiKey,
      // });
      //
      // const sms = africastalking.SMS;
      // await sms.send({
      //   to: options.to,
      //   message: options.message,
      //   from: this.senderId,
      // });

      logger.info(`SMS sent to ${options.to.join(', ')}`);
    } catch (error) {
      logger.error('Error sending SMS:', error);
      throw error;
    }
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<void> {
    const message = `Your SmeFlow verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;

    await this.sendSMS({
      to: [phoneNumber],
      message,
    });
  }

  async sendBusinessVerificationSMS(phoneNumber: string, businessName: string): Promise<void> {
    const message = `Congratulations! Your business "${businessName}" has been verified on SmeFlow. Start receiving customers now!`;

    await this.sendSMS({
      to: [phoneNumber],
      message,
    });
  }
}

export const smsService = new SMSService();
