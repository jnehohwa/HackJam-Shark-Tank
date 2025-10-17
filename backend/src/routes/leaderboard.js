/**
 * Leaderboard Routes
 * Handles user rankings, badges, and gamification
 */

import express from 'express';
import prisma from '../config/database.js';
import { BADGES } from '../utils/gamification.js';

const router = express.Router();

/**
 * GET /api/leaderboard
 * Get top users by points
 */
router.get('/', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        badges: true,
        createdAt: true,
        _count: {
          select: {
            ideas: true,
            votes: true,
            comments: true
          }
        }
      },
      orderBy: {
        points: 'desc'
      },
      skip,
      take: parseInt(limit)
    });
    
    // Format response with ranks
    const leaderboard = users.map((user, index) => ({
      rank: skip + index + 1,
      id: user.id,
      name: user.name,
      points: user.points,
      badges: JSON.parse(user.badges),
      ideas: user._count.ideas,
      votes: user._count.votes,
      comments: user._count.comments,
      memberSince: user.createdAt
    }));
    
    const totalUsers = await prisma.user.count();
    
    res.json({
      success: true,
      data: {
        leaderboard,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalUsers,
          pages: Math.ceil(totalUsers / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard.'
    });
  }
});

/**
 * GET /api/leaderboard/badges
 * Get all available badges with criteria
 */
router.get('/badges', async (req, res) => {
  try {
    const badgeList = Object.entries(BADGES).map(([key, badge]) => ({
      id: key,
      name: badge.name,
      description: badge.description,
      icon: badge.icon
    }));
    
    res.json({
      success: true,
      data: badgeList
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch badges.'
    });
  }
});

/**
 * GET /api/leaderboard/user/:id
 * Get specific user's leaderboard position and stats
 */
router.get('/user/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        badges: true,
        createdAt: true,
        _count: {
          select: {
            ideas: true,
            votes: true,
            comments: true
          }
        },
        ideas: {
          select: {
            id: true,
            title: true,
            voteCount: true,
            commentCount: true,
            aiScore: true,
            status: true,
            mentorPick: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }
    
    // Calculate rank
    const higherRankedUsers = await prisma.user.count({
      where: {
        points: {
          gt: user.points
        }
      }
    });
    
    const rank = higherRankedUsers + 1;
    
    res.json({
      success: true,
      data: {
        rank,
        id: user.id,
        name: user.name,
        points: user.points,
        badges: JSON.parse(user.badges),
        stats: {
          ideasSubmitted: user._count.ideas,
          votesCast: user._count.votes,
          commentsWritten: user._count.comments,
          memberSince: user.createdAt
        },
        recentIdeas: user.ideas
      }
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user rank.'
    });
  }
});

/**
 * GET /api/leaderboard/trending
 * Get users with most points this week
 */
router.get('/trending', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Get users who submitted ideas in the last week
    const recentIdeas = await prisma.idea.findMany({
      where: {
        createdAt: {
          gte: oneWeekAgo
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            points: true,
            badges: true
          }
        }
      }
    });
    
    // Aggregate by user
    const userMap = new Map();
    
    recentIdeas.forEach(idea => {
      const userId = idea.author.id;
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          ...idea.author,
          badges: JSON.parse(idea.author.badges),
          weeklyIdeas: 0,
          weeklyPoints: 0
        });
      }
      
      const userData = userMap.get(userId);
      userData.weeklyIdeas += 1;
      userData.weeklyPoints += 50; // Base points for idea
      userData.weeklyPoints += idea.voteCount * 5; // Points from votes
      userMap.set(userId, userData);
    });
    
    // Convert to array and sort
    const trendingUsers = Array.from(userMap.values())
      .sort((a, b) => b.weeklyPoints - a.weeklyPoints)
      .slice(0, 10);
    
    res.json({
      success: true,
      data: trendingUsers
    });
  } catch (error) {
    console.error('Get trending users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending users.'
    });
  }
});

export default router;

