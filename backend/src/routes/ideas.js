/**
 * Ideas Routes
 * Handles idea CRUD, status workflow, and AI scoring
 */

import express from 'express';
import prisma from '../config/database.js';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';
import { scoreIdea } from '../services/aiService.js';
import { awardPoints, checkBadges } from '../utils/gamification.js';

const router = express.Router();

/**
 * POST /api/ideas
 * Submit a new idea with AI scoring
 */
router.post('/', authenticate, submissionLimiter, async (req, res) => {
  try {
    const { title, description, category, videoLink, imageUrl, tags } = req.body;
    
    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, and category are required.'
      });
    }
    
    // Run AI scoring
    const aiResults = scoreIdea({ title, description, category });
    
    // Create idea with AI scores
    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        category,
        videoLink,
        imageUrl,
        authorId: req.user.id,
        ...aiResults
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    // Award points to user
    const pointsEarned = awardPoints(0, 'SUBMIT_IDEA');
    const highScoreBonus = awardPoints(0, 'HIGH_AI_SCORE', { aiScore: aiResults.aiScore });
    const totalPoints = pointsEarned + highScoreBonus;
    
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        points: {
          increment: totalPoints
        }
      }
    });
    
    // Check for new badges
    const userIdeas = await prisma.idea.findMany({
      where: { authorId: req.user.id }
    });
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    const earnedBadges = checkBadges({ user, ideas: userIdeas });
    
    if (earnedBadges.length > 0) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          badges: JSON.stringify(earnedBadges)
        }
      });
    }
    
    res.status(201).json({
      success: true,
      data: {
        idea: {
          ...idea,
          badges: earnedBadges
        },
        pointsEarned: totalPoints,
        message: aiResults.status === 'DRAFT' 
          ? 'Idea submitted! Please refine it to reach the leaderboard (needs 60+ AI score).'
          : 'Idea submitted successfully and is now under review!'
      }
    });
  } catch (error) {
    console.error('Submit idea error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit idea. Please try again.'
    });
  }
});

/**
 * GET /api/ideas
 * Get all ideas with filters
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {
      AND: []
    };
    
    // Only show UNDER_REVIEW and APPROVED ideas to regular users
    if (!req.user || req.user.role === 'user') {
      where.AND.push({
        status: {
          in: ['UNDER_REVIEW', 'APPROVED']
        }
      });
    } else if (status) {
      // Mentors/admins can filter by any status
      where.AND.push({ status });
    }
    
    if (category && category !== 'All') {
      where.AND.push({ category });
    }
    
    if (search) {
      where.AND.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      });
    }
    
    // Get ideas
    const ideas = await prisma.idea.findMany({
      where: where.AND.length > 0 ? where : {},
      skip,
      take: parseInt(limit),
      orderBy: {
        [sortBy]: order
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            votes: true,
            comments: true
          }
        }
      }
    });
    
    // Get total count
    const total = await prisma.idea.count({
      where: where.AND.length > 0 ? where : {}
    });
    
    res.json({
      success: true,
      data: {
        ideas: ideas.map(idea => ({
          ...idea,
          voteCount: idea._count.votes,
          commentCount: idea._count.comments,
          _count: undefined
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ideas.'
    });
  }
});

/**
 * GET /api/ideas/:id
 * Get single idea by ID
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            points: true,
            badges: true
          }
        },
        votes: {
          select: {
            userId: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found.'
      });
    }
    
    // Check if user has voted
    const hasVoted = req.user 
      ? idea.votes.some(vote => vote.userId === req.user.id)
      : false;
    
    res.json({
      success: true,
      data: {
        ...idea,
        voteCount: idea.votes.length,
        commentCount: idea.comments.length,
        hasVoted,
        author: {
          ...idea.author,
          badges: JSON.parse(idea.author.badges)
        }
      }
    });
  } catch (error) {
    console.error('Get idea error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch idea.'
    });
  }
});

/**
 * PATCH /api/ideas/:id/status
 * Update idea status (mentors/admins only)
 */
router.patch('/:id/status', authenticate, requireRole('mentor', 'admin'), async (req, res) => {
  try {
    const { status, mentorPick } = req.body;
    
    const validStatuses = ['SUBMITTED', 'DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
    
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value.'
      });
    }
    
    const idea = await prisma.idea.findUnique({
      where: { id: req.params.id }
    });
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found.'
      });
    }
    
    // Update idea
    const updateData = {};
    if (status) updateData.status = status;
    if (mentorPick !== undefined) updateData.mentorPick = mentorPick;
    
    const updatedIdea = await prisma.idea.update({
      where: { id: req.params.id },
      data: updateData
    });
    
    // Award points if approved or mentor pick
    if (status === 'APPROVED' && idea.status !== 'APPROVED') {
      await prisma.user.update({
        where: { id: idea.authorId },
        data: {
          points: {
            increment: awardPoints(0, 'IDEA_APPROVED')
          }
        }
      });
    }
    
    if (mentorPick && !idea.mentorPick) {
      await prisma.user.update({
        where: { id: idea.authorId },
        data: {
          points: {
            increment: awardPoints(0, 'MENTOR_PICK')
          }
        }
      });
    }
    
    res.json({
      success: true,
      data: updatedIdea
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update idea status.'
    });
  }
});

/**
 * DELETE /api/ideas/:id
 * Delete own idea (or any idea if admin)
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: req.params.id }
    });
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found.'
      });
    }
    
    // Check ownership
    if (idea.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this idea.'
      });
    }
    
    await prisma.idea.delete({
      where: { id: req.params.id }
    });
    
    res.json({
      success: true,
      message: 'Idea deleted successfully.'
    });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete idea.'
    });
  }
});

export default router;

