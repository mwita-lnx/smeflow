# SmeFlow API Documentation

Base URL: `http://localhost:5000/api/v1`

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Businesses](#businesses)
- [Products](#products)
- [Categories](#categories)
- [Locations](#locations)
- [Ratings & Reviews](#ratings--reviews)
- [Admin](#admin)

---

## Authentication

### Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "phone": "+254712345678",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CONSUMER"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### Verify Email
```http
POST /auth/verify-email
```

**Request Body:**
```json
{
  "token": "verification_token"
}
```

### Verify Phone (OTP)
```http
POST /auth/verify-phone
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "otp": "123456"
}
```

### Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### Reset Password
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "NewPassword123"
}
```

### Refresh Token
```http
POST /auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "..."
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

---

## Users

### Update Profile
```http
PUT /users/profile
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678"
}
```

### Change Password
```http
PUT /users/change-password
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

### Get User Businesses
```http
GET /users/businesses
Authorization: Bearer {token}
```

### Get User Reviews
```http
GET /users/reviews
Authorization: Bearer {token}
```

### Delete Account
```http
DELETE /users/account
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "password": "Password123"
}
```

---

## Businesses

### Create Business
```http
POST /businesses
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "businessName": "My Business",
  "category": "Retail & Shop",
  "description": "Business description",
  "county": "Nairobi",
  "subCounty": "Westlands",
  "address": "123 Main Street",
  "phone": "+254712345678",
  "email": "business@example.com",
  "whatsapp": "+254712345678",
  "location": {
    "coordinates": [36.8219, -1.2921]
  }
}
```

### Update Business
```http
PUT /businesses/:id
Authorization: Bearer {token}
```

### Upload Business Images
```http
POST /businesses/:id/images
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `logo`: File (optional)
- `coverImage`: File (optional)

### Get Business by ID
```http
GET /businesses/:id
```

### Get Business by Slug
```http
GET /businesses/slug/:slug
```

### Search Businesses
```http
GET /businesses/search?q=search_term&category=Retail&county=Nairobi&minRating=4&verified=true&page=1&limit=20&sort=rating
```

**Query Parameters:**
- `q`: Search query (optional)
- `category`: Business category (optional)
- `county`: County filter (optional)
- `minRating`: Minimum rating (1-5) (optional)
- `verified`: Show only verified businesses (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort by (newest, oldest, rating, popular)

### Get Nearby Businesses
```http
GET /businesses/nearby?longitude=36.8219&latitude=-1.2921&maxDistance=5000
```

### Increment View Count
```http
POST /businesses/:id/view
```

### Delete Business
```http
DELETE /businesses/:id
Authorization: Bearer {token}
```

---

## Products

### Create Product
```http
POST /products/business/:businessId
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 1000,
  "currency": "KES",
  "isAvailable": true
}
```

### Upload Product Images
```http
POST /products/:id/images
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `images`: File[] (max 5 files)

### Get Products by Business
```http
GET /products/business/:businessId
```

### Get Product by ID
```http
GET /products/:id
```

### Update Product
```http
PUT /products/:id
Authorization: Bearer {token}
```

### Delete Product
```http
DELETE /products/:id
Authorization: Bearer {token}
```

---

## Categories

### Get All Categories
```http
GET /categories
```

### Get Category by Slug
```http
GET /categories/:slug
```

### Get Businesses by Category
```http
GET /categories/:slug/businesses?page=1&limit=20
```

### Get Sub-categories
```http
GET /categories/:parentId/subcategories
```

---

## Locations

### Get All Counties
```http
GET /locations/counties
```

### Get Sub-counties by County
```http
GET /locations/counties/:county/subcounties
```

### Get Businesses by County
```http
GET /locations/counties/:county/businesses?page=1&limit=20
```

---

## Ratings & Reviews

### Create Rating
```http
POST /ratings
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "business": "business_id",
  "rating": 5,
  "reviewTitle": "Great service!",
  "reviewText": "Detailed review text",
  "qualityRating": 5,
  "serviceRating": 5,
  "valueRating": 4
}
```

### Upload Rating Images
```http
POST /ratings/:id/images
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `images`: File[] (max 5 files)

### Update Rating
```http
PUT /ratings/:id
Authorization: Bearer {token}
```

### Delete Rating
```http
DELETE /ratings/:id
Authorization: Bearer {token}
```

### Get Business Ratings
```http
GET /ratings/business/:businessId?page=1&limit=20
```

### Get Rating by ID
```http
GET /ratings/:id
```

### Mark Rating as Helpful
```http
POST /ratings/:id/helpful
```

### Respond to Rating (Business Owner)
```http
POST /ratings/:id/respond
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "response": "Thank you for your feedback!"
}
```

### Flag Rating
```http
POST /ratings/:id/flag
Authorization: Bearer {token}
```

---

## Admin

**All admin routes require authentication and ADMIN role**

### Get Pending Businesses
```http
GET /admin/businesses/pending
Authorization: Bearer {admin_token}
```

### Verify Business
```http
PUT /admin/businesses/:id/verify
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "verificationLevel": "VERIFIED",
  "status": "ACTIVE"
}
```

### Reject Business
```http
PUT /admin/businesses/:id/reject
Authorization: Bearer {admin_token}
```

### Suspend Business
```http
PUT /admin/businesses/:id/suspend
Authorization: Bearer {admin_token}
```

### Activate Business
```http
PUT /admin/businesses/:id/activate
Authorization: Bearer {admin_token}
```

### Get Flagged Reviews
```http
GET /admin/reviews/flagged
Authorization: Bearer {admin_token}
```

### Moderate Review
```http
PUT /admin/reviews/:id/moderate
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "status": "ACTIVE"
}
```

### Get All Users
```http
GET /admin/users?page=1&limit=20
Authorization: Bearer {admin_token}
```

### Get Platform Statistics
```http
GET /admin/stats
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalBusinesses": 50,
    "activeBusinesses": 45,
    "pendingBusinesses": 5,
    "totalReviews": 200,
    "flaggedReviews": 2
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "Email already registered"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Registration: 3 requests per hour
- Password reset: 3 requests per 15 minutes
- File upload: 20 requests per 15 minutes

---

## File Upload Limits

- Maximum file size: 5MB
- Allowed image types: JPEG, PNG, JPG, WebP
- Maximum images per upload:
  - Business logo/cover: 1 each
  - Product images: 5
  - Review images: 5
