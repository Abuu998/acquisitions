import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$default(() => uuidv4()),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 150 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});
