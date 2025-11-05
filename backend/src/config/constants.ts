export const USER_ROLES = {
  SME: 'SME',
  CONSUMER: 'CONSUMER',
  ADMIN: 'ADMIN',
} as const;

export const VERIFICATION_LEVELS = {
  BASIC: 'BASIC',
  VERIFIED: 'VERIFIED',
  PREMIUM: 'PREMIUM',
} as const;

export const BUSINESS_STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
  REJECTED: 'REJECTED',
} as const;

export const REVIEW_STATUS = {
  ACTIVE: 'ACTIVE',
  FLAGGED: 'FLAGGED',
  REMOVED: 'REMOVED',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;

export const KENYAN_COUNTIES = [
  'Mombasa',
  'Kwale',
  'Kilifi',
  'Tana River',
  'Lamu',
  'Taita-Taveta',
  'Garissa',
  'Wajir',
  'Mandera',
  'Marsabit',
  'Isiolo',
  'Meru',
  'Tharaka-Nithi',
  'Embu',
  'Kitui',
  'Machakos',
  'Makueni',
  'Nyandarua',
  'Nyeri',
  'Kirinyaga',
  'Murang\'a',
  'Kiambu',
  'Turkana',
  'West Pokot',
  'Samburu',
  'Trans-Nzoia',
  'Uasin Gishu',
  'Elgeyo-Marakwet',
  'Nandi',
  'Baringo',
  'Laikipia',
  'Nakuru',
  'Narok',
  'Kajiado',
  'Kericho',
  'Bomet',
  'Kakamega',
  'Vihiga',
  'Bungoma',
  'Busia',
  'Siaya',
  'Kisumu',
  'Homa Bay',
  'Migori',
  'Kisii',
  'Nyamira',
  'Nairobi',
] as const;

export const BUSINESS_CATEGORIES = [
  'Agriculture & Farming',
  'Retail & Shop',
  'Food & Beverage',
  'Services',
  'Manufacturing',
  'Construction',
  'Transportation',
  'Technology',
  'Health & Beauty',
  'Education & Training',
  'Automotive',
  'Real Estate',
  'Entertainment',
  'Professional Services',
  'Hospitality',
  'Other',
] as const;

export const CURRENCY = 'KES';

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const RATING_RANGE = {
  MIN: 1,
  MAX: 5,
} as const;

export const VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
export const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes
export const PASSWORD_RESET_EXPIRY = 60 * 60 * 1000; // 1 hour
