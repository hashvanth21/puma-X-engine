import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health';
import { shoesRouter } from './routes/shoes';
import { recommendRouter } from './routes/recommend';
import { eventsRouter } from './routes/events';
import { feedbackRouter } from './routes/feedback';

dotenv.config();
const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api/shoes', shoesRouter);
app.use('/api/recommend', recommendRouter);
app.use('/api/events', eventsRouter);
app.use('/api/feedback', feedbackRouter);

app.listen(PORT, () => {
  console.log(`PUMA Backend running on http://localhost:${PORT}`);
});
