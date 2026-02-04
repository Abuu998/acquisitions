import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().trim().min(3).max(150),
  email: z.email().max(255).toLowerCase().trim(),
  role: z.enum(['user', 'admin']).default('user'),
  password: z.string().trim().min(6).max(128),
});

export const signinSchema = z.object({
  email: z.email().max(255).toLowerCase().trim(),
  password: z.string().trim().min(6).max(128),
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type SigninSchema = z.infer<typeof signinSchema>;
