// Password validation patterns
export const PASSWORD_REGEX = {
  UPPERCASE: /[A-Z]/,           // At least one uppercase
  LOWERCASE: /[a-z]/,           // At least one lowercase  
  NUMBER: /[0-9]/,              // At least one number
  SPECIAL_CHAR: /[!@#$%^&*]/,   // At least one special character
};

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
};

// Custom error messages
export const AUTH_ERRORS = {
  EMAIL_INVALID: 'Please provide a valid email address',
  EMAIL_ALREADY_EXISTS: 'This email is already registered',
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`,
  PASSWORD_NO_UPPERCASE: 'Password must contain at least one uppercase letter',
  PASSWORD_NO_NUMBER: 'Password must contain at least one number',
  PASSWORD_NO_SPECIAL_CHAR: 'Password must contain at least one special character (!@#$%^&*)',
  EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_TOKEN: 'Verification token is invalid or expired',
  INVALID_RESET_TOKEN: 'Password reset link is invalid or expired',
  USER_NOT_FOUND: 'No account found with this email address',
};

export const TOKEN_EXPIRY = {
  VERIFICATION_TOKEN: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  RESET_TOKEN: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
};