/**
 * Voting Routes
 * Handles upvotes on ideas
 */

import express from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { voteLimiter } from '../middleware/rateLimiter.js';
import { awardPoints, checkBadges } from '../utils/gamification.js';

const router = express.Router();

/**
 * POST /api/ideas/:id/vote
 * Upvote an idea
 */
router.post('/:id/vote', authenticate, voteLimiter, async (req, res) => {
  try {
    const ideaId = req.params.id;
    const userId = req.user.id;
    
    // Check if idea exists
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        author: true
      }
    });
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found.'
      });
    }
    
    // Can't vote on own idea
    if (idea.authorId === userId) {
      return res.status(400).json({
        success: false,
        error: 'You cannot vote on your own idea.'
      });
    }
    
    // Check if already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId
        }
      }
    });
    
    if (existingVote) {
      return res.status(400).json({
        success: false,
        error: 'You have already voted on this idea.'
      });
    }
    
    // Create vote
    await prisma.vote.create({
      data: {
        userId,
        ideaId
      }
    });
    
    // Update cached vote count
    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: {
        voteCount: {
          increment: 1
        }
      }
    });
    
    // Award points to idea author
    await prisma.user.update({
      where: { id: idea.authorId },
      data: {
        points: {
          increment: awardPoints(0, 'RECEIVE_VOTE')
        }
      }
    });
    
    // Check if idea should move to UNDER_REVIEW (auto-promotion at 5 votes)
    if (updatedIdea.voteCount >= 5 && updatedIdea.status === 'SUBMITTED') {
      await prisma.idea.update({
        where: { id: ideaId },
        data: {
          status: 'UNDER_REVIEW'
        }
      });
    }
    
    // Check for new badges for the idea author
    const authorIdeas = await prisma.idea.findMany({
      where: { authorId: idea.authorId }
    });
    
    const author = await prisma.user.findUnique({
      where: { id: idea.authorId }
    });
    
    const voteCountForAuthor = await prisma.vote.count({
      where: { userId: idea.authorId }
    });
    
    const earnedBadges = checkBadges({ 
      user: author, 
      ideas: authorIdeas,
      voteCount: voteCountForAuthor
    });
    
    if (earnedBadges.length > 0) {
      await prisma.user.update({
        where: { id: idea.authorId },
        data: {
          badges: JSON.stringify(earnedBadges)
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        voteCount: updatedIdea.voteCount,
        newBadges: earnedBadges
      },
      message: 'Vote recorded successfully!'
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to vote. Please try again.'
    });
  }
});

/**
 * DELETE /api/ideas/:id/vote
 * Remove upvote from an idea
 */
router.delete('/:id/vote', authenticate, async (req, res) => {
  try {
    const ideaId = req.params.id;
    const userId = req.user.id;
    
    // Check if vote exists
    const vote = await prisma.vote.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId
        }
      }
    });
    
    if (!vote) {
      return res.status(404).json({
        success: false,
        error: 'You have not voted on this idea.'
      });
    }
    
    // Delete vote
    await prisma.vote.delete({
      where: {
        userId_ideaId: {
          userId,
          ideaId
        }
      }
    });
    
    // Update cached vote count
    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: {
        voteCount: {
          decrement: 1
        }
      }
    });
    
    res.json({
      success: true,
      data: {
        voteCount: updatedIdea.voteCount
      },
      message: 'Vote removed successfully.'
    });
  } catch (error) {
    console.error('Remove vote error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove vote.'
    });
  }
});

export default router;

