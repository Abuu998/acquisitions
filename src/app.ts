import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from "@/config/logger";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(
    morgan(
        'combined',
        {
          stream: {
            write: (msg) => {
              logger.info(msg.trim())
            }
          }
        })
);

app.get('/', (req, res) => {
  logger.info('Hello from acquisitions!');
  res.status(200).send('Hello From Acquisitions');
});

export default app;
