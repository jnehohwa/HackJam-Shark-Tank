/**
 * Comments Routes
 * Handles comments on ideas
 */

import express from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { awardPoints } from '../utils/gamification.js';

const router = express.Router();

/**
 * POST /api/ideas/:id/comments
 * Add a comment to an idea
 */
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const ideaId = req.params.id;
    const userId = req.user.id;
    
    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required.'
      });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Comment is too long (max 1000 characters).'
      });
    }
    
    // Check if idea exists
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId }
    });
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found.'
      });
    }
    
    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId,
        ideaId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // Update cached comment count
    await prisma.idea.update({
      where: { id: ideaId },
      data: {
        commentCount: {
          increment: 1
        }
      }
    });
    
    // Award points
    // Points to commenter
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: awardPoints(0, 'WRITE_COMMENT')
        }
      }
    });
    
    // Points to idea author
    if (idea.authorId !== userId) {
      await prisma.user.update({
        where: { id: idea.authorId },
        data: {
          points: {
            increment: awardPoints(0, 'RECEIVE_COMMENT')
          }
        }
      });
    }
    
    res.status(201).json({
      success: true,
      data: comment,
      message: 'Comment added successfully!'
    });
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add comment.'
    });
  }
});

/**
 * GET /api/ideas/:id/comments
 * Get all comments for an idea
 */
router.get('/:id/comments', async (req, res) => {
  try {
    const ideaId = req.params.id;
    
    const comments = await prisma.comment.findMany({
      where: { ideaId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            points: true,
            badges: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json({
      success: true,
      data: comments.map(comment => ({
        ...comment,
        user: {
          ...comment.user,
          badges: JSON.parse(comment.user.badges)
        }
      }))
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comments.'
    });
  }
});

/**
 * DELETE /api/comments/:id
 * Delete own comment (or any comment if admin)
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.id }
    });
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found.'
      });
    }
    
    // Check ownership
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this comment.'
      });
    }
    
    await prisma.comment.delete({
      where: { id: req.params.id }
    });
    
    // Update cached comment count
    await prisma.idea.update({
      where: { id: comment.ideaId },
      data: {
        commentCount: {
          decrement: 1
        }
      }
    });
    
    res.json({
      success: true,
      message: 'Comment deleted successfully.'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete comment.'
    });
  }
});

export default router;

