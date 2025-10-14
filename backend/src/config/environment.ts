import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  nodeEnv: string;
  port: number;
  apiVersion: string;
  mongodbUri: string;
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  jwt: {
    secret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  email: {
    from: string;
    service: string;
    sendgridApiKey?: string;
    smtp?: {
      host: string;
      port: number;
      user: string;
      pass: string;
    };
  };
  sms: {
    username: string;
    apiKey: string;
    senderId: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  mpesa: {
    environment: string;
    consumerKey: string;
    consumerSecret: string;
    passkey: string;
    shortcode: string;
    callbackUrl: string;
    timeoutUrl: string;
  };
  security: {
    bcryptRounds: number;
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
  };
  frontendUrl: string;
  fileUpload: {
    maxFileSize: number;
    allowedFileTypes: string[];
  };
  admin: {
    email: string;
    password: string;
  };
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/smeflow',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  email: {
    from: process.env.EMAIL_FROM || 'noreply@smeflow.co.ke',
    service: process.env.EMAIL_SERVICE || 'smtp',
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  },
  sms: {
    username: process.env.AFRICASTALKING_USERNAME || 'sandbox',
    apiKey: process.env.AFRICASTALKING_API_KEY || '',
    senderId: process.env.AFRICASTALKING_SENDER_ID || 'SMEFLOW',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  mpesa: {
    environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
    consumerKey: process.env.MPESA_CONSUMER_KEY || '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    passkey: process.env.MPESA_PASSKEY || '',
    shortcode: process.env.MPESA_SHORTCODE || '174379',
    callbackUrl: process.env.MPESA_CALLBACK_URL || '',
    timeoutUrl: process.env.MPESA_TIMEOUT_URL || '',
  },
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  fileUpload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg,image/webp').split(','),
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@smeflow.co.ke',
    password: process.env.ADMIN_PASSWORD || 'change-this-password',
  },
};

export const validateConfig = (): void => {
  const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0 && config.nodeEnv === 'production') {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};
