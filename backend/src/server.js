import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { errorHandler, notFound, logger } from './middleware/errorHandler.js';
import initDb from './config/initDb.js';
import pool from './config/db.js';

dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this') {
  console.warn('WARNING: JWT_SECRET is weak or default. Set a strong secret in production.');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for correct IP detection behind load balancers / Docker
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  referrerPolicy: { policy: 'same-origin' },
  strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true, preload: true },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
      connectSrc: ["'self'", 'https://res.cloudinary.com'],
      fontSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Stricter rate limit on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);

// Stricter rate limit on upload endpoints
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many uploads, please try again later' }
});
app.use('/api/upload', uploadLimiter);

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173', 'https://inventorysmts.netlify.app'];

app.use(logger);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (isLocal) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});



app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, async () => {
  console.log('Initializing database...');
  try {
    await initDb();
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization failed:', err.message);
  }
  console.log(`Server running on port ${PORT}`);
});

function gracefulShutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    pool.end(() => {
      console.log('Database pool disconnected.');
      process.exit(0);
    });
  });
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

// Prevent crash from unhandled errors — log and continue
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
