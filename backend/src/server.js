/**
 * Main Server File
 * Shark Tank Mode Backend API
 */

import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Import routes
import authRoutes from './routes/auth.js';
import ideasRoutes from './routes/ideas.js';
import votesRoutes from './routes/votes.js';
import commentsRoutes from './routes/comments.js';
import leaderboardRoutes from './routes/leaderboard.js';
import analyticsRoutes from './routes/analytics.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all routes
app.use('/api/', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Shark Tank Mode API is running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/ideas', votesRoutes);
app.use('/api/ideas', commentsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║     🦈 SHARK TANK MODE API                    ║
║                                                ║
║     Server running on port ${PORT}               ║
║     Environment: ${config.nodeEnv}                   ║
║     Frontend: ${config.frontendUrl}    ║
║                                                ║
║     API Documentation:                         ║
║     http://localhost:${PORT}/health               ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});

export default app;

