/**
 * Gamification System
 * Manages points, badges, and leaderboard calculations
 */

import { config } from '../config/config.js';

/**
 * Badge definitions with unlock criteria
 */
export const BADGES = {
  TOP_PITCHER: {
    name: 'Top Pitcher',
    description: 'Submit 5+ ideas with 10+ votes each',
    icon: '🏆',
    check: (user, ideas) => {
      const qualifyingIdeas = ideas.filter(idea => idea.voteCount >= 10);
      return qualifyingIdeas.length >= 5;
    }
  },
  IDEA_REFINER: {
    name: 'Idea Refiner',
    description: 'Receive 100+ total votes across all ideas',
    icon: '📈',
    check: (user, ideas) => {
      const totalVotes = ideas.reduce((sum, idea) => sum + idea.voteCount, 0);
      return totalVotes >= 100;
    }
  },
  MENTOR_MAGNET: {
    name: 'Mentor Magnet',
    description: 'Get 3+ mentor picks',
    icon: '⭐',
    check: (user, ideas) => {
      const mentorPicks = ideas.filter(idea => idea.mentorPick);
      return mentorPicks.length >= 3;
    }
  },
  COMMUNITY_HERO: {
    name: 'Community Hero',
    description: 'Help others with 50+ comments',
    icon: '💡',
    check: (user, comments) => {
      return comments >= 50;
    }
  },
  INNOVATION_CHAMPION: {
    name: 'Innovation Champion',
    description: 'Achieve exceptional AI scores on multiple ideas',
    icon: '🥇',
    check: (user, ideas) => {
      const highScoreIdeas = ideas.filter(idea => idea.aiScore >= 80);
      return highScoreIdeas.length >= 3;
    }
  },
  RISING_STAR: {
    name: 'Rising Star',
    description: 'New member with an idea scoring 85+',
    icon: '🌟',
    check: (user, ideas) => {
      const accountAge = Date.now() - new Date(user.createdAt).getTime();
      const isNew = accountAge < 30 * 24 * 60 * 60 * 1000; // 30 days
      const hasHighScore = ideas.some(idea => idea.aiScore >= 85);
      return isNew && hasHighScore;
    }
  },
  FIRST_IDEA: {
    name: 'First Idea',
    description: 'Submit your first idea',
    icon: '🎯',
    check: (user, ideas) => {
      return ideas.length >= 1;
    }
  },
  ENGAGED_VOTER: {
    name: 'Engaged Voter',
    description: 'Cast 50+ votes',
    icon: '👍',
    check: (user, votes) => {
      return votes >= 50;
    }
  }
};

/**
 * Calculate points for an action
 */
export function calculatePoints(action, data = {}) {
  switch (action) {
    case 'SUBMIT_IDEA':
      return config.points.submitIdea;
    
    case 'RECEIVE_VOTE':
      return config.points.receiveVote;
    
    case 'RECEIVE_COMMENT':
      return config.points.receiveComment;
    
    case 'IDEA_APPROVED':
      return config.points.ideaApproved;
    
    case 'MENTOR_PICK':
      return config.points.mentorPick;
    
    case 'WRITE_COMMENT':
      return config.points.writeComment;
    
    case 'HIGH_AI_SCORE':
      // Bonus points for AI scores above 80
      if (data.aiScore >= 90) return 50;
      if (data.aiScore >= 80) return 25;
      return 0;
    
    default:
      return 0;
  }
}

/**
 * Check which badges a user has earned
 */
export function checkBadges(userData) {
  const { user, ideas = [], commentCount = 0, voteCount = 0 } = userData;
  const earnedBadges = [];
  
  for (const [key, badge] of Object.entries(BADGES)) {
    try {
      let earned = false;
      
      // Different checks based on badge type
      if (key === 'COMMUNITY_HERO') {
        earned = badge.check(user, commentCount);
      } else if (key === 'ENGAGED_VOTER') {
        earned = badge.check(user, voteCount);
      } else {
        earned = badge.check(user, ideas);
      }
      
      if (earned) {
        earnedBadges.push(badge.name);
      }
    } catch (error) {
      console.error(`Error checking badge ${key}:`, error);
    }
  }
  
  return earnedBadges;
}

/**
 * Calculate trending score for an idea
 * Used for "Hot" and "Trending" sections
 */
export function calculateTrendingScore(idea) {
  const now = Date.now();
  const createdAt = new Date(idea.createdAt).getTime();
  const ageInHours = (now - createdAt) / (1000 * 60 * 60);
  
  // Recency factor (newer ideas get boosted)
  const recencyScore = Math.max(0, 100 - ageInHours);
  
  // Engagement factor
  const engagementScore = (idea.voteCount * 3) + (idea.commentCount * 5);
  
  // AI score factor (quality matters)
  const qualityScore = idea.aiScore || 0;
  
  // Combined trending score
  const trendingScore = (recencyScore * 0.3) + (engagementScore * 0.5) + (qualityScore * 0.2);
  
  return Math.round(trendingScore);
}

/**
 * Award points to a user
 * Returns updated points total
 */
export function awardPoints(currentPoints, action, data = {}) {
  const pointsEarned = calculatePoints(action, data);
  return currentPoints + pointsEarned;
}

export default {
  BADGES,
  calculatePoints,
  checkBadges,
  calculateTrendingScore,
  awardPoints
};

