import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  role: string;
  email: string;
}

/**
 * Generates a JWT token signed with JWT_SECRET and expiring in JWT_EXPIRES_IN.
 * Defaults role to 'member' and email to empty string if not provided.
 */
export const generateToken = (id: string, role: string = 'member', email: string = ''): string => {
  const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_key_min_32_chars';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id, role, email }, jwtSecret, {
    expiresIn: jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verifies and decodes a JWT token. Returns the decoded payload or null if invalid/expired.
 */
export const verifyTokenUtil = (token: string): TokenPayload | null => {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_key_min_32_chars';
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export default generateToken;
