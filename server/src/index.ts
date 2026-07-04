import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import businessRoutes from './routes/business';
import contentRoutes from './routes/content';
import calendarRoutes from './routes/calendar';
import ideasRoutes from './routes/ideas';

// Initialize BullMQ Workers
import './workers/content.worker';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
import path from 'path';
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business-profile', businessRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/ideas', ideasRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
