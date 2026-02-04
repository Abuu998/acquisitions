import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from '@/config/logger';
import authRouter from '@/routes/auth.route';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  morgan('combined', {
    stream: {
      write: msg => {
        logger.info(msg.trim());
      },
    },
  }),
);

//
app.get('/', (req, res) => {
  logger.info('Hello from acquisitions!');
  res.status(200).send('Hello From Acquisitions');
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Acquisitions API is running!' });
});
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routers
app.use('/api/auth', authRouter);

export default app;
