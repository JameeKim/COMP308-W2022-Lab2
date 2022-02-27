export const BCRYPT_SALT_ROUNDS = process.env.NODE_ENV === "production" ? 16 : 8;

export const TOKEN_VALID_PERIOD = process.env.NODE_ENV === "production"
  ? 60 * 60 * 24 * 7 // 1 week
  : 60 * 5; // 5 minutes
