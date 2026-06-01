import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { env } from './config/env';
import { validateEnvStartup } from './middleware/envValidation';

// Fail-fast startup checks
validateEnvStartup();

import { connectDB } from './utils/db';
import authRoutes from './routes/auth.routes';
import { apiLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const PORT = env.PORT;

// Connect to Database
connectDB();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN || (process.env.VITE_API_BASE_URL ? process.env.VITE_API_BASE_URL.replace('/api', '') : 'http://localhost:3000'),
  credentials: true,
}));

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} - Body:`, req.body);
  next();
});

// Rate Limiting (Global)
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MSMERAISE API is running' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
