import express from 'express';
import { signIn, signOut, signUp } from '@/controllers/auth.controller.ts';

const router = express.Router();

router
  .post('/sign-up', signUp)
  .post('/sign-in', signIn)
  .post('/sign-out', signOut);

export default router;
