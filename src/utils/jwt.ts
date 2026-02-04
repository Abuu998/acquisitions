import { sign, verify } from 'jsonwebtoken';
import logger from '@/config/logger.ts';
import type { SignupSchema } from '@/validations/auth.validation.ts';

const JWT_SECRET =
  Bun.env.JWT_SECRET || 'your-secret-do-not-use-this-in-production';
const JWT_EXPIRES_IN = '1d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: SignupSchema['role'];
}

export const jwtToken = {
  sign(payload: TokenPayload | Buffer | object) {
    try {
      return sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });
    } catch (e) {
      logger.error('Failed to authenticate token', e);
      throw new Error('Unable to authenticate token');
    }
  },

  verify(token: string) {
    try {
      return verify(token, JWT_SECRET);
    } catch (e) {
      logger.error('Failed to authenticate token', e);
      throw new Error('Unable to authenticate token');
    }
  },
};
