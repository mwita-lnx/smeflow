import nodemailer from 'nodemailer';
import { config } from '../config/environment';
import { logger } from '../shared/utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (config.email.service === 'smtp') {
      this.transporter = nodemailer.createTransport({
        host: config.email.smtp!.host,
        port: config.email.smtp!.port,
        secure: false,
        auth: {
          user: config.email.smtp!.user,
          pass: config.email.smtp!.pass,
        },
      });
    } else {
      // For development, use ethereal email
      this.createTestAccount();
    }
  }

  private async createTestAccount() {
    const testAccount = await nodemailer.createTestAccount();
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: config.email.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);

      if (config.nodeEnv === 'development') {
        logger.info(`Email sent: ${nodemailer.getTestMessageUrl(info)}`);
      } else {
        logger.info(`Email sent to ${options.to}`);
      }
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to SmeFlow!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}"
           style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email - SmeFlow',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetUrl}"
           style="display: inline-block; padding: 12px 24px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">If you didn't request a password reset, please ignore this email.</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Password Reset - SmeFlow',
      html,
    });
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to SmeFlow, ${firstName}!</h2>
        <p>Your account has been successfully verified. You can now access all features of SmeFlow.</p>
        <p>Start exploring businesses or list your own business today!</p>
        <a href="${config.frontendUrl}"
           style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Get Started
        </a>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">Need help? Contact us at ${config.email.from}</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Welcome to SmeFlow!',
      html,
    });
  }
}

export const emailService = new EmailService();
