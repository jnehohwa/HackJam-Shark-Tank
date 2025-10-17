/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Please login.'
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. Please login again.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Authentication failed.'
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Useful for endpoints that work for both auth and unauth users
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, config.jwtSecret);
      
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
    }
    
    next();
  } catch (error) {
    // Continue without user
    next();
  }
};

/**
 * Check if user has required role
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions.'
      });
    }
    
    next();
  };
};

/**
 * Check if user owns the resource or is admin/mentor
 */
export const ownershipCheck = (getResourceOwnerId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required.'
        });
      }
      
      // Admins and mentors can access everything
      if (req.user.role === 'admin' || req.user.role === 'mentor') {
        return next();
      }
      
      // Get resource owner ID
      const ownerId = await getResourceOwnerId(req);
      
      // Check ownership
      if (ownerId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to access this resource.'
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Ownership verification failed.'
      });
    }
  };
};

export default {
  authenticate,
  optionalAuth,
  requireRole,
  ownershipCheck
};

