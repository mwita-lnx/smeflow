import crypto from 'crypto';

export const generateOtp = (length = 6): string => {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }

  return otp;
};

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
