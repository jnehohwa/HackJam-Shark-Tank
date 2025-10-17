/**
 * Configuration for Shark Tank Backend
 * Loads from environment variables or uses defaults
 */

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'hackathon-shark-tank-secret-2024',
  jwtExpiresIn: '7d',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  
  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // File Upload
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB) || 10,
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  
  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  
  // Gamification
  points: {
    submitIdea: 50,
    receiveVote: 5,
    receiveComment: 2,
    ideaApproved: 100,
    mentorPick: 200,
    writeComment: 1
  },
  
  // AI Scoring thresholds
  ai: {
    draftThreshold: 60, // Below this = DRAFT
    approvalThreshold: 80, // Above this = can fast-track to APPROVED
  }
};

export default config;

