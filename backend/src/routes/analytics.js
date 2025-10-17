/**
 * Analytics Routes
 * Provides platform statistics and insights
 */

import express from 'express';
import prisma from '../config/database.js';
import { calculateTrendingScore } from '../utils/gamification.js';

const router = express.Router();

/**
 * GET /api/analytics
 * Get overall platform analytics
 */
router.get('/', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Get counts
    const [
      totalIdeas,
      totalUsers,
      totalVotes,
      totalComments,
      ideasThisWeek,
      usersThisWeek
    ] = await Promise.all([
      prisma.idea.count(),
      prisma.user.count(),
      prisma.vote.count(),
      prisma.comment.count(),
      prisma.idea.count({
        where: {
          createdAt: {
            gte: oneWeekAgo
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: oneWeekAgo
          }
        }
      })
    ]);
    
    // Ideas by status
    const ideasByStatus = await prisma.idea.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });
    
    // Ideas by category
    const ideasByCategory = await prisma.idea.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });
    
    // Average AI score
    const avgScore = await prisma.idea.aggregate({
      _avg: {
        aiScore: true
      }
    });
    
    res.json({
      success: true,
      data: {
        overview: {
          totalIdeas,
          totalUsers,
          totalVotes,
          totalComments,
          ideasThisWeek,
          usersThisWeek,
          averageAiScore: Math.round(avgScore._avg.aiScore || 0)
        },
        breakdown: {
          byStatus: ideasByStatus.map(item => ({
            status: item.status,
            count: item._count.id
          })),
          byCategory: ideasByCategory.map(item => ({
            category: item.category,
            count: item._count.id
          }))
        }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics.'
    });
  }
});

/**
 * GET /api/analytics/top-ideas
 * Get top performing ideas
 */
router.get('/top-ideas', async (req, res) => {
  try {
    const { timeframe = 'all', limit = 10 } = req.query;
    
    let whereClause = {
      status: {
        in: ['UNDER_REVIEW', 'APPROVED']
      }
    };
    
    // Apply timeframe filter
    if (timeframe !== 'all') {
      const now = new Date();
      let since = new Date();
      
      switch (timeframe) {
        case 'week':
          since.setDate(now.getDate() - 7);
          break;
        case 'month':
          since.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          since.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      whereClause.createdAt = {
        gte: since
      };
    }
    
    // Get top ideas by vote count
    const topIdeas = await prisma.idea.findMany({
      where: whereClause,
      orderBy: {
        voteCount: 'desc'
      },
      take: parseInt(limit),
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    res.json({
      success: true,
      data: topIdeas
    });
  } catch (error) {
    console.error('Top ideas error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top ideas.'
    });
  }
});

/**
 * GET /api/analytics/trending-ideas
 * Get trending ideas based on engagement and recency
 */
router.get('/trending-ideas', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Get recent ideas with good engagement
    const ideas = await prisma.idea.findMany({
      where: {
        status: {
          in: ['UNDER_REVIEW', 'APPROVED']
        },
        createdAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // Last 2 weeks
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // Calculate trending scores
    const ideasWithScores = ideas.map(idea => ({
      ...idea,
      trendingScore: calculateTrendingScore(idea)
    }));
    
    // Sort by trending score
    ideasWithScores.sort((a, b) => b.trendingScore - a.trendingScore);
    
    // Update trending flag in database for top ideas
    const topTrending = ideasWithScores.slice(0, parseInt(limit));
    await Promise.all(
      topTrending.map(idea =>
        prisma.idea.update({
          where: { id: idea.id },
          data: { trending: true }
        })
      )
    );
    
    res.json({
      success: true,
      data: topTrending
    });
  } catch (error) {
    console.error('Trending ideas error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending ideas.'
    });
  }
});

/**
 * GET /api/analytics/top-users
 * Get top contributing users
 */
router.get('/top-users', async (req, res) => {
  try {
    const { metric = 'points', limit = 10 } = req.query;
    
    let orderBy = {};
    
    switch (metric) {
      case 'points':
        orderBy = { points: 'desc' };
        break;
      case 'ideas':
        orderBy = { ideas: { _count: 'desc' } };
        break;
      default:
        orderBy = { points: 'desc' };
    }
    
    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        points: true,
        badges: true,
        _count: {
          select: {
            ideas: true,
            votes: true,
            comments: true
          }
        }
      },
      orderBy,
      take: parseInt(limit)
    });
    
    res.json({
      success: true,
      data: topUsers.map(user => ({
        ...user,
        badges: JSON.parse(user.badges),
        stats: {
          ideas: user._count.ideas,
          votes: user._count.votes,
          comments: user._count.comments
        },
        _count: undefined
      }))
    });
  } catch (error) {
    console.error('Top users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top users.'
    });
  }
});

/**
 * GET /api/analytics/activity
 * Get recent platform activity
 */
router.get('/activity', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    // Get recent ideas
    const recentIdeas = await prisma.idea.findMany({
      take: parseInt(limit) / 2,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // Get recent comments
    const recentComments = await prisma.comment.findMany({
      take: parseInt(limit) / 2,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        idea: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    
    // Combine and sort by time
    const activity = [
      ...recentIdeas.map(idea => ({
        type: 'idea',
        id: idea.id,
        user: idea.author,
        data: {
          title: idea.title,
          category: idea.category
        },
        timestamp: idea.createdAt
      })),
      ...recentComments.map(comment => ({
        type: 'comment',
        id: comment.id,
        user: comment.user,
        data: {
          content: comment.content.substring(0, 100),
          ideaId: comment.idea.id,
          ideaTitle: comment.idea.title
        },
        timestamp: comment.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({
      success: true,
      data: activity.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity.'
    });
  }
});

export default router;

