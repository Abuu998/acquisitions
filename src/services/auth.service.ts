import logger from '@/config/logger.ts';
import { compare, hash } from 'bcryptjs';
import type {
  SigninSchema,
  SignupSchema,
} from '@/validations/auth.validation.ts';
import { db } from '@/config/database.ts';
import { users } from '@/models';
import { eq } from 'drizzle-orm';

export async function hashPassword(text: string): Promise<string> {
  try {
    return await hash(text, 10);
  } catch (e) {
    logger.error('Error hashing password', e);
    throw new Error('Error hashing');
  }
}

export async function comparePassword(
  text: string,
  hashed: string,
): Promise<boolean> {
  return await compare(text, hashed);
}

export async function createUser({
  name,
  email,
  role,
  password,
}: SignupSchema) {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const passwordHash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, role, password: passwordHash })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    if (!newUser) throw new Error('Error creating user');

    logger.info(`User ${newUser.email} created successfully`);
    return newUser;
  } catch (e) {
    logger.error(`Error creating user: ${e}`);
    throw e;
  }
}

export async function loginUser({ email, password }: SigninSchema) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new Error('No user with those credentials');
    }
    const { password: hashed, ...userData } = user;
    const isCorrectPassword = await comparePassword(password, hashed);

    if (!isCorrectPassword) {
      throw new Error('Invalid email or password');
    }

    logger.info(`User ${user.email} login successfully`);
    return userData;
  } catch (e) {
    logger.error(`Error logging user in: ${e}`);
    throw e;
  }
}
