# SmeFlow Flutter App - Complete Implementation Plan

## Project Overview
A beautiful, seamless, and clean Flutter mobile application for the SmeFlow platform, enabling Kenyan SMEs to discover, list, and review businesses.

---

## App Structure

```
lib/
├── config/
│   ├── api_config.dart          # API endpoints and base URL
│   ├── app_theme.dart            # Material theme and colors
│   └── routes.dart               # GoRouter navigation setup
├── models/
│   ├── user.dart
│   ├── business.dart
│   ├── product.dart
│   ├── rating.dart
│   └── category.dart
├── services/
│   ├── api_service.dart          # Dio HTTP client
│   ├── auth_service.dart         # Authentication
│   ├── business_service.dart     # Business operations
│   ├── storage_service.dart      # SharedPreferences
│   └── location_service.dart     # Geolocation
├── providers/
│   ├── auth_provider.dart
│   ├── business_provider.dart
│   └── search_provider.dart
├── screens/
│   ├── splash/
│   ├── auth/
│   │   ├── login_screen.dart
│   │   ├── register_screen.dart
│   │   └── forgot_password_screen.dart
│   ├── home/
│   │   ├── home_screen.dart
│   │   └── widgets/
│   ├── business/
│   │   ├── business_list_screen.dart
│   │   ├── business_detail_screen.dart
│   │   ├── create_business_screen.dart
│   │   └── widgets/
│   ├── search/
│   │   ├── search_screen.dart
│   │   └── filter_screen.dart
│   ├── profile/
│   │   ├── profile_screen.dart
│   │   ├── my_businesses_screen.dart
│   │   └── my_reviews_screen.dart
│   ├── ratings/
│   │   ├── add_rating_screen.dart
│   │   └── ratings_list_screen.dart
│   └── admin/
│       ├── admin_dashboard_screen.dart
│       └── pending_businesses_screen.dart
└── widgets/
    ├── custom_button.dart
    ├── custom_textfield.dart
    ├── business_card.dart
    ├── rating_stars.dart
    ├── loading_indicator.dart
    └── error_widget.dart
```

---

## Design System

### Color Palette (Kenyan Theme)
```dart
Primary: #E74C3C (Red - Kenyan flag)
Secondary: #27AE60 (Green - Kenyan flag)
Accent: #F39C12 (Orange - African sunset)
Background: #F5F7FA
Card: #FFFFFF
Text Primary: #2C3E50
Text Secondary: #7F8C8D
Border: #E0E6ED
```

### Typography
- **Headings**: Montserrat Bold
- **Body**: Inter Regular
- **Accent**: Poppins

### UI Components
- **Cards**: Rounded corners (12px), subtle shadow
- **Buttons**: Rounded (8px), gradient for primary
- **Input Fields**: Outlined, rounded (10px)
- **Bottom Nav**: Floating with shadow
- **App Bar**: Transparent with blur effect

---

## Screen Specifications

### 1. Splash Screen
- **Duration**: 2 seconds
- **Animation**: Fade in logo + tagline
- **Transition**: Navigate to Home/Login based on auth status

### 2. Authentication Screens

#### Login Screen
- Email/Phone input
- Password input (with show/hide)
- Remember me checkbox
- Login button
- Forgot password link
- Register link
- Social login buttons (Google, Apple)

#### Register Screen
- Role selection (SME, Consumer, Broker)
- Name fields
- Email & Phone
- Password (with strength indicator)
- Terms acceptance checkbox
- Register button
- Login link

### 3. Home Screen
- **Top Section**:
  - Search bar
  - Filter button
  - Location selector
- **Featured Businesses**:
  - Horizontal scroll cards
  - Image, name, rating, category
- **Categories Grid**:
  - 4 columns
  - Icon + Name
- **Nearby Businesses**:
  - Vertical list
  - Distance indicator
- **Bottom Navigation**:
  - Home, Search, Add, Profile

### 4. Business List Screen
- **Filter chips** (Category, Location, Rating)
- **Sort options** (Newest, Rating, Popular)
- **Business cards**:
  - Image thumbnail
  - Business name
  - Category badge
  - Rating stars + count
  - Location + distance
  - Verified badge

### 5. Business Detail Screen
- **Hero image** (full width)
- **Image gallery** (horizontal scroll)
- **Business info**:
  - Name + verification badge
  - Category
  - Rating + reviews count
  - Location with map preview
  - Contact buttons (Call, WhatsApp, M-Pesa)
- **About section**
- **Products/Services grid**
- **Reviews list** (3 latest + "See all")
- **Floating action button** (Add Review / Edit if owner)

### 6. Create Business Screen (Stepper)
- **Step 1**: Basic Info
  - Business name
  - Category selector
  - Description
- **Step 2**: Location
  - County selector
  - Sub-county
  - Address
  - Map picker
- **Step 3**: Contact
  - Phone
  - Email
  - WhatsApp
  - M-Pesa details
- **Step 4**: Images
  - Logo upload
  - Cover image
- **Step 5**: Review & Submit

### 7. Search Screen
- **Search bar** (with voice search)
- **Recent searches** (chips)
- **Popular searches**
- **Filter panel**:
  - Category
  - County
  - Rating
  - Verified only
- **Results list** (same as Business List)

### 8. Profile Screen
- **User info section**:
  - Avatar
  - Name
  - Email & Phone
  - Verification badges
- **Menu items**:
  - My Businesses (for SME)
  - My Reviews
  - Favorites
  - Settings
  - Help & Support
  - Logout

### 9. Add Rating Screen
- **Business info** (small card)
- **Overall rating** (star selector)
- **Detailed ratings**:
  - Quality
  - Service
  - Value
- **Review title** (optional)
- **Review text** (textarea)
- **Add photos** (up to 5)
- **Submit button**

### 10. Admin Dashboard
- **Statistics cards**:
  - Total businesses
  - Pending verifications
  - Total reviews
  - Flagged content
- **Quick actions**:
  - Pending businesses
  - Flagged reviews
  - User management
- **Charts** (optional)

---

## Key Features

### Authentication
- ✅ Email/Password login
- ✅ Phone verification (OTP)
- ✅ Remember me
- ✅ JWT token management
- ✅ Auto-refresh tokens
- ✅ Secure token storage

### Business Discovery
- ✅ Browse all businesses
- ✅ Search by name, category, location
- ✅ Filter and sort
- ✅ View business details
- ✅ Nearby businesses (geolocation)
- ✅ Category browsing

### Business Management (SME Users)
- ✅ Create business listing
- ✅ Upload images (logo, cover, products)
- ✅ Edit business info
- ✅ Add products/services
- ✅ Respond to reviews
- ✅ View analytics

### Ratings & Reviews
- ✅ View business ratings
- ✅ Add detailed reviews
- ✅ Upload review photos
- ✅ Mark reviews as helpful
- ✅ Business owner responses

### User Profile
- ✅ View/edit profile
- ✅ My businesses
- ✅ My reviews
- ✅ Favorites list
- ✅ Settings

### Admin Features
- ✅ Verify businesses
- ✅ Moderate reviews
- ✅ View statistics
- ✅ User management

---

## Animations & Transitions

### Page Transitions
- Slide from right (forward navigation)
- Slide from left (back navigation)
- Fade (modals)

### UI Animations
- **Buttons**: Scale on tap
- **Cards**: Lift on press (elevation)
- **Images**: Hero transition
- **Lists**: Staggered fade-in
- **Loading**: Shimmer effect

### Micro-interactions
- **Pull to refresh**
- **Swipe to delete** (reviews)
- **Haptic feedback** (buttons, toggle)
- **Success/Error snackbars** with slide-up

---

## State Management (Provider)

### Providers
1. **AuthProvider**
   - User session
   - Login/logout
   - Token management

2. **BusinessProvider**
   - Business list
   - Selected business
   - Create/update business

3. **SearchProvider**
   - Search query
   - Filters
   - Search results

4. **CategoryProvider**
   - Categories list
   - Selected category

5. **LocationProvider**
   - Counties
   - User location
   - Selected location

6. **RatingProvider**
   - Business ratings
   - User reviews

---

## API Integration

### API Service Setup
```dart
class ApiService {
  static const baseUrl = 'http://10.0.2.2:5000/api/v1'; // Android emulator

  // Endpoints
  static const auth = '/auth';
  static const businesses = '/businesses';
  static const products = '/products';
  static const ratings = '/ratings';
  static const categories = '/categories';
  static const locations = '/locations';
}
```

### Request Flow
1. **Interceptor**: Add auth token
2. **Request**: Send to API
3. **Response**: Parse JSON
4. **Error handling**: Show user-friendly message
5. **Retry**: Auto-retry on network error

---

## Local Storage

### SharedPreferences Keys
- `auth_token` - JWT access token
- `refresh_token` - JWT refresh token
- `user_data` - User object (JSON)
- `remember_me` - Boolean
- `recent_searches` - List of strings
- `favorites` - List of business IDs

---

## Image Handling

### Upload Flow
1. **Pick image** (ImagePicker)
2. **Compress** (reduce size)
3. **Upload to API**
4. **Show progress**
5. **Display uploaded image**

### Caching
- Use `CachedNetworkImage` for all network images
- Cache duration: 7 days
- Placeholder: Shimmer
- Error widget: Placeholder icon

---

## Location Services

### Permissions
- Request location permission on first use
- Show dialog if denied
- Link to settings

### Features
- Get current location
- Show nearby businesses
- Map view with markers
- Distance calculation

---

## Performance Optimization

### Best Practices
- ✅ Lazy loading (pagination)
- ✅ Image caching
- ✅ Debounced search
- ✅ Virtual scrolling (ListView.builder)
- ✅ Dispose controllers
- ✅ Optimize images (compress)
- ✅ Use const constructors

### Loading States
- Shimmer placeholders
- Skeleton screens
- Progress indicators
- Pull-to-refresh

---

## Error Handling

### Types
1. **Network errors**: Show retry button
2. **Auth errors**: Logout and redirect to login
3. **Validation errors**: Show field-level errors
4. **Server errors**: Show generic message + support contact

### User Feedback
- **SnackBar** for temporary messages
- **Dialog** for critical errors
- **Toast** for success messages
- **Inline errors** for form validation

---

## Testing Strategy

### Unit Tests
- Models (JSON serialization)
- Services (API calls)
- Validators
- Utils

### Widget Tests
- Custom widgets
- Screens (basic rendering)
- Form validation

### Integration Tests
- Login flow
- Business creation
- Rating submission

---

## Deployment Checklist

### Android
- [ ] Update app name and package
- [ ] Set app icon
- [ ] Configure signing key
- [ ] Set min SDK version (21+)
- [ ] Add permissions (Internet, Location)
- [ ] Test on multiple devices

### iOS
- [ ] Update app name and bundle ID
- [ ] Set app icon
- [ ] Configure provisioning profile
- [ ] Set deployment target (iOS 12+)
- [ ] Add permissions (Info.plist)
- [ ] Test on iPhone & iPad

---

## Future Enhancements

### Phase 2
- Push notifications
- In-app messaging
- M-Pesa payment integration
- Offline mode
- Dark mode
- Multi-language (Swahili)

### Phase 3
- Voice search
- AR business preview
- Video reviews
- Business analytics
- AI recommendations
- WhatsApp Business integration

---

## Performance Targets

- **App size**: < 30MB
- **Launch time**: < 2s
- **Screen load**: < 1s
- **Image load**: < 500ms
- **API response**: < 300ms (cached)
- **Smooth scrolling**: 60 FPS

---

**This comprehensive plan provides a complete roadmap for building a professional, user-friendly SmeFlow mobile app!**
