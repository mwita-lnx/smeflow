import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { config } from './config/environment';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import businessRoutes from './modules/businesses/business.routes';
import productRoutes from './modules/products/product.routes';
import categoryRoutes from './modules/categories/category.routes';
import locationRoutes from './modules/locations/location.routes';
import ratingRoutes from './modules/ratings/rating.routes';
import adminRoutes from './modules/admin/admin.routes';
import tenderRoutes from './modules/tenders/tender.routes';
import bidRoutes from './modules/tenders/bid.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import mpesaRoutes from './modules/mpesa/mpesa.routes';
import verificationRoutes from './modules/verification/verification.routes';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
const apiPrefix = `/api/${config.apiVersion}`;

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/businesses`, businessRoutes);
app.use(`${apiPrefix}/products`, productRoutes);
app.use(`${apiPrefix}/categories`, categoryRoutes);
app.use(`${apiPrefix}/locations`, locationRoutes);
app.use(`${apiPrefix}/ratings`, ratingRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);
app.use(`${apiPrefix}/tenders`, tenderRoutes);
app.use(`${apiPrefix}/bids`, bidRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/mpesa`, mpesaRoutes);
app.use(`${apiPrefix}/verifications`, verificationRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
