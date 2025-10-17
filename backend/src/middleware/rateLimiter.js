/**
 * Rate Limiting Middleware
 * Prevents abuse and ensures fair API usage
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config/config.js';

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for auth endpoints
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: 5,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Submission rate limiter
 * 10 idea submissions per hour per user
 */
export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: 'Too many submissions. Please wait before submitting another idea.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Voting rate limiter
 * 100 votes per 15 minutes per user
 */
export const voteLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: 100,
  message: {
    success: false,
    error: 'Too many votes. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  apiLimiter,
  authLimiter,
  submissionLimiter,
  voteLimiter
};

