import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as userSchema from '../models/users.model.ts';

const schema = {
  ...userSchema,
};

export const sql = neon(Bun.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
