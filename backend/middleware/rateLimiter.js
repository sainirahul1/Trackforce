/**
 * Rate Limiting Middleware
 * 
 * Provides different rate limits for different endpoint categories:
 * - Auth endpoints (login, register): Strict limits to prevent brute force
 * - General API endpoints: Standard limits for normal usage
 * - Public endpoints: Moderate limits
 * 
 * In development mode, limits are significantly relaxed to avoid blocking
 * during rapid testing and hot-reloading.
 */

const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

// Auth rate limiter — strict to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : (parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10), // Relaxed in dev
  message: {
    message: 'Too many login attempts. Please try again after 15 minutes.',
    code: 'RATE_LIMIT_AUTH',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
  // Uses default IP-based key generator (compatible with express-rate-limit v7+)
  skip: () => isDev, // Skip rate limiting entirely in development
});

// General API rate limiter — standard limits
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : (parseInt(process.env.RATE_LIMIT_MAX) || 200), // Relaxed in dev
  message: {
    message: 'Too many requests. Please slow down and try again shortly.',
    code: 'RATE_LIMIT_API',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev, // Skip rate limiting entirely in development
});

// Public endpoints — moderate limits
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 50,
  message: {
    message: 'Too many requests to public endpoints.',
    code: 'RATE_LIMIT_PUBLIC',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev, // Skip rate limiting entirely in development
});

module.exports = { authLimiter, apiLimiter, publicLimiter };
