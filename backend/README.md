# SmeFlow Backend

A comprehensive platform to help small-scale businesses in Kenya go to market with ratings, reviews, and discovery features.

## Features

- **User Management**: Registration, authentication, profile management
- **Business Listings**: Create, update, search, and discover businesses
- **Product/Service Catalog**: Manage business products and services
- **Ratings & Reviews**: Comprehensive review system with images
- **Location-based Search**: Find businesses by county and nearby location
- **Admin Dashboard**: Business verification and content moderation
- **File Upload**: Image upload with Cloudinary integration
- **Email & SMS**: Notifications via email and SMS (Africa's Talking)

## Tech Stack

- **Runtime**: Node.js (v20+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **SMS**: Africa's Talking (Kenya)

## Prerequisites

- Node.js v20 or higher
- MongoDB v7 or higher
- Redis (optional but recommended)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd smeflow/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/smeflow

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS (Africa's Talking)
AFRICASTALKING_USERNAME=your-username
AFRICASTALKING_API_KEY=your-api-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin
ADMIN_EMAIL=admin@smeflow.co.ke
ADMIN_PASSWORD=change-this-password
```

### 4. Seed Database

```bash
npm run seed
```

This will:
- Create all categories
- Create an admin user

### 5. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`

## Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server

# Database
npm run seed         # Seed database with initial data

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

## Docker Setup

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

This will start:
- MongoDB on port 27017
- Redis on port 6379
- Backend API on port 5000

### Using Docker only

```bash
# Build image
docker build -t smeflow-backend .

# Run container
docker run -p 5000:5000 --env-file .env smeflow-backend
```

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Base URL

```
http://localhost:5000/api/v1
```

### Quick Start Examples

#### Register a user
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "phone": "+254712345678",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

#### Search businesses
```bash
curl http://localhost:5000/api/v1/businesses/search?q=retail&county=Nairobi
```

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts
│   │   ├── environment.ts
│   │   └── constants.ts
│   ├── models/              # Mongoose models
│   │   ├── User.model.ts
│   │   ├── Business.model.ts
│   │   ├── Product.model.ts
│   │   ├── Rating.model.ts
│   │   ├── Category.model.ts
│   │   └── Payment.model.ts
│   ├── modules/             # Feature modules
│   │   ├── auth/
│   │   ├── users/
│   │   ├── businesses/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── locations/
│   │   ├── ratings/
│   │   └── admin/
│   ├── services/            # External services
│   │   ├── email.service.ts
│   │   ├── sms.service.ts
│   │   └── cloudinary.service.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   ├── validator.ts
│   │   └── upload.middleware.ts
│   ├── shared/              # Shared utilities
│   │   ├── interfaces/
│   │   └── utils/
│   ├── database/
│   │   └── seeds/
│   ├── app.ts               # Express app
│   └── server.ts            # Server entry point
├── logs/                    # Log files
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## Database Models

- **User**: User accounts (SME, Consumer, Broker, Admin)
- **Business**: Business profiles and information
- **Product**: Products/services offered by businesses
- **Rating**: Reviews and ratings for businesses
- **Category**: Business categories
- **Payment**: Payment transactions (for future M-Pesa integration)

## Security

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Helmet.js for security headers
- CORS protection
- Input validation and sanitization
- File upload restrictions

## Default Admin Credentials

```
Email: admin@smeflow.co.ke
Password: change-this-password (from .env)
```

**⚠️ Change these credentials in production!**

## Environment Variables

See `.env.example` for all available environment variables.

## Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure production database
4. Set up proper email service (SendGrid or SMTP)
5. Configure Cloudinary for image uploads
6. Set up Africa's Talking for SMS

### Production Checklist

- [ ] Change admin credentials
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure production database with backups
- [ ] Set up monitoring (e.g., PM2, Sentry)
- [ ] Configure firewall rules
- [ ] Set up CDN for static assets
- [ ] Enable database indexing
- [ ] Set up backup strategy

## Monitoring

Logs are stored in the `logs/` directory:
- `error.log`: Error logs
- `all.log`: All logs

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@smeflow.co.ke

---

Built with ❤️ for Kenyan SMEs
