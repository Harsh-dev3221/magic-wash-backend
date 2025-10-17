/// <reference types="bun-types" />

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import bookingRoutes from './routes/booking.js';
import partnershipRoutes from './routes/partnership.js';
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

// Initialize Hono app
const app = new Hono();

// Connect to MongoDB
connectDB();

// Middleware - CORS configuration
app.use('*', cors({
  origin: (origin) => {
    // In development, allow all localhost origins
    if (process.env.NODE_ENV === 'development') {
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return origin || '*';
      }
    }

    // In production, check if origin matches allowed URLs
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://magic-wash-portal-16.vercel.app',
      'http://localhost:5173',
      'http://localhost:4173'
    ].map(url => url?.replace(/\/$/, '')); // Remove trailing slashes

    const cleanOrigin = origin?.replace(/\/$/, '');

    if (allowedOrigins.includes(cleanOrigin)) {
      return origin;
    }

    // Fallback to FRONTEND_URL or default
    return process.env.FRONTEND_URL || 'http://localhost:5173';
  },
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600,
}));

app.use('*', logger());

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/bookings', bookingRoutes);
app.route('/api/partnerships', partnershipRoutes);

// Health check route
app.get('/api/health', (c) => {
  return c.json({
    success: true,
    message: 'Magic Wash API is running with Hono + Bun',
    timestamp: new Date().toISOString(),
    runtime: 'Bun',
    framework: 'Hono',
  });
});

// Root route
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Welcome to Magic Wash API',
    version: '1.0.0',
    runtime: 'Bun',
    framework: 'Hono',
    endpoints: {
      bookings: '/api/bookings',
      partnerships: '/api/partnerships',
      health: '/api/health',
    },
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Route not found',
  }, 404);
});

// Error handling
app.onError((err, c) => {
  console.error('❌ Server Error:', err);
  return c.json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  }, 500);
});

// Start server
const PORT = process.env.PORT || 5000;

console.log('\n🚀 ========================================');
console.log(`🚀 Magic Wash Backend Server Starting...`);
console.log(`🚀 Runtime: Bun ${Bun.version}`);
console.log(`🚀 Framework: Hono`);
console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🚀 Port: ${PORT}`);
console.log('🚀 ========================================\n');

export default {
  port: PORT,
  fetch: app.fetch,
};

