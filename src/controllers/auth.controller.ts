import type { NextFunction, Request, Response } from 'express';
import logger from '@/config/logger.ts';
import { signinSchema, signupSchema } from '@/validations/auth.validation.ts';
import { formatValidationError } from '@/utils/format.ts';
import { createUser, loginUser } from '@/services/auth.service.ts';
import { jwtToken } from '@/utils/jwt.ts';
import { cookies } from '@/utils/cookies.ts';

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success)
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validation.error),
      });

    const { role, email } = validation.data;

    // Call auth service
    const user = await createUser(validation.data);

    const token = jwtToken.sign({ userId: user.id, email, role });
    const COOKIE_NAME = Bun.env.ACCESS_COOKIE_NAME!;
    cookies.set(res, COOKIE_NAME, token);

    logger.info(`User registered successfully: ${email}`);
    return res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (e: unknown) {
    logger.error('Signup Error', e);

    if (e.message === 'Email already exists') {
      return res.status(409).json({ error: 'Email already exists' });
    }

    next(e);
  }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const validation = signinSchema.safeParse(req.body);

    if (!validation.success)
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validation.error),
      });

    // Call auth service
    const user = await loginUser(validation.data);

    const token = jwtToken.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const COOKIE_NAME = Bun.env.ACCESS_COOKIE_NAME!;
    cookies.set(res, COOKIE_NAME, token);

    logger.info(`User login successfully: ${user.email}`);
    return res.status(200).json({
      message: 'User login successfully',
      user,
    });
  } catch (e: unknown) {
    logger.error('Sign in Error', e);

    next(e);
  }
}

export async function signOut(req: Request, res: Response, next: NextFunction) {
  try {
    const COOKIE_NAME = Bun.env.ACCESS_COOKIE_NAME!;
    cookies.clear(res, COOKIE_NAME);

    logger.info('User logout successfully');
    return res.status(204).json({ message: 'User logout successfully' });
  } catch (e: unknown) {
    logger.error('Sign in Error', e);

    next(e);
  }
}
