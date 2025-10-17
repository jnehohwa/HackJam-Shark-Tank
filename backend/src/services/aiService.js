/**
 * Smart Mock AI Service
 * Analyzes ideas for clarity, innovation, feasibility, and impact
 * Uses NLP heuristics and keyword analysis to simulate AI scoring
 */

import natural from 'natural';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();
const sentimentAnalyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

// Keywords for scoring different dimensions
const INNOVATION_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'blockchain', 'innovative', 'novel', 
  'revolutionary', 'breakthrough', 'cutting-edge', 'advanced', 'next-generation', 'pioneering',
  'disruptive', 'unique', 'creative', 'original', 'transformative', 'groundbreaking'
];

const FEASIBILITY_KEYWORDS = [
  'simple', 'practical', 'achievable', 'existing', 'available', 'budget', 'timeline',
  'prototype', 'tested', 'proven', 'scalable', 'efficient', 'cost-effective', 'realistic',
  'viable', 'implementable', 'accessible', 'straightforward', 'buildable'
];

const IMPACT_KEYWORDS = [
  'improve', 'benefit', 'help', 'solve', 'problem', 'solution', 'community', 'students',
  'campus', 'environment', 'sustainability', 'health', 'education', 'social', 'impact',
  'change', 'transform', 'enhance', 'empower', 'support', 'address', 'reduce', 'increase'
];

const CLARITY_KEYWORDS = [
  'specifically', 'for example', 'such as', 'including', 'will', 'would', 'allows',
  'enables', 'provides', 'offers', 'features', 'consists', 'comprises', 'through'
];

/**
 * Main AI Scoring Function
 * @param {Object} idea - Idea object with title and description
 * @returns {Object} Scores and analysis
 */
export function scoreIdea(idea) {
  const { title, description, category } = idea;
  const combinedText = `${title} ${description}`.toLowerCase();
  const words = tokenizer.tokenize(combinedText);
  const sentences = combinedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Score each dimension
  const clarityScore = scoreCLarity(combinedText, sentences, words);
  const innovationScore = scoreInnovation(combinedText, words, category);
  const feasibilityScore = scoreFeasibility(combinedText, words, description);
  const impactScore = scoreImpact(combinedText, words);
  
  // Overall score (weighted average)
  const aiScore = Math.round(
    (clarityScore * 0.25) + 
    (innovationScore * 0.25) + 
    (feasibilityScore * 0.25) + 
    (impactScore * 0.25)
  );
  
  // Generate AI analysis
  const analysis = generateAnalysis(aiScore, {
    clarity: clarityScore,
    innovation: innovationScore,
    feasibility: feasibilityScore,
    impact: impactScore
  });
  
  // Determine status based on score
  const status = determineStatus(aiScore);
  
  return {
    aiScore,
    clarityScore,
    innovationScore,
    feasibilityScore,
    impactScore,
    aiAnalysis: analysis,
    status,
    aiProcessed: true
  };
}

/**
 * Score Clarity (0-100)
 * Measures how well-explained and structured the idea is
 */
function scoreCLarity(text, sentences, words) {
  let score = 40; // Base score
  
  // Length check (too short = unclear, too long = rambling)
  const wordCount = words.length;
  if (wordCount >= 50 && wordCount <= 500) {
    score += 20;
  } else if (wordCount > 500) {
    score += 10;
  } else if (wordCount < 30) {
    score -= 10;
  }
  
  // Sentence count (multiple sentences = better structure)
  if (sentences.length >= 3) {
    score += 15;
  }
  
  // Clarity keywords
  const clarityKeywordCount = countKeywords(text, CLARITY_KEYWORDS);
  score += Math.min(clarityKeywordCount * 5, 15);
  
  // Check for specific details (numbers, examples)
  if (/\d+/.test(text)) score += 5; // Contains numbers
  if (/example|such as|like/.test(text)) score += 5; // Contains examples
  
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Score Innovation (0-100)
 * Measures novelty and creativity
 */
function scoreInnovation(text, words, category) {
  let score = 30; // Base score
  
  // Innovation keywords
  const innovationKeywordCount = countKeywords(text, INNOVATION_KEYWORDS);
  score += Math.min(innovationKeywordCount * 8, 40);
  
  // Technology mentions
  const techTerms = ['app', 'platform', 'system', 'software', 'hardware', 'iot', 'vr', 'ar'];
  const techCount = countKeywords(text, techTerms);
  score += Math.min(techCount * 5, 15);
  
  // Category bonus (IT/Design tend to be more innovative)
  if (category === 'IT' || category === 'Design') {
    score += 10;
  }
  
  // Complexity bonus (longer, more complex ideas might be more innovative)
  if (words.length > 100) {
    score += 5;
  }
  
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Score Feasibility (0-100)
 * Measures how practical and achievable the idea is
 */
function scoreFeasibility(text, words, description) {
  let score = 50; // Base score (neutral)
  
  // Feasibility keywords
  const feasibilityKeywordCount = countKeywords(text, FEASIBILITY_KEYWORDS);
  score += Math.min(feasibilityKeywordCount * 7, 30);
  
  // Red flags for infeasibility
  const redFlags = ['unlimited', 'free forever', 'no cost', 'instant', 'magical', 'impossible'];
  const redFlagCount = countKeywords(text, redFlags);
  score -= redFlagCount * 10;
  
  // Mentions of resources, timeline, budget (good signs)
  if (/budget|cost|resource|month|week|timeline|plan/.test(text)) {
    score += 15;
  }
  
  // Reasonable length (too ambitious ideas tend to be long and unfocused)
  if (description.length < 1000) {
    score += 5;
  }
  
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Score Impact (0-100)
 * Measures potential positive effect on community/campus
 */
function scoreImpact(text, words) {
  let score = 35; // Base score
  
  // Impact keywords
  const impactKeywordCount = countKeywords(text, IMPACT_KEYWORDS);
  score += Math.min(impactKeywordCount * 6, 35);
  
  // Target audience mentions
  const audienceTerms = ['student', 'campus', 'university', 'community', 'people', 'users'];
  const audienceCount = countKeywords(text, audienceTerms);
  score += Math.min(audienceCount * 5, 15);
  
  // Problem-solution language
  if (/problem|challenge|issue|difficulty/.test(text)) {
    score += 5; // Identifies a problem
  }
  if (/solution|solve|address|fix|resolve/.test(text)) {
    score += 5; // Proposes a solution
  }
  
  // Sentiment analysis (positive sentiment = higher impact)
  const sentiment = sentimentAnalyzer.getSentiment(words);
  if (sentiment > 2) {
    score += 5;
  }
  
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Count keyword occurrences
 */
function countKeywords(text, keywords) {
  return keywords.reduce((count, keyword) => {
    const regex = new RegExp(keyword, 'gi');
    const matches = text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
}

/**
 * Generate human-readable AI analysis
 */
function generateAnalysis(overallScore, scores) {
  let analysis = [];
  
  // Overall assessment
  if (overallScore >= 80) {
    analysis.push("🌟 Excellent idea with strong potential!");
  } else if (overallScore >= 60) {
    analysis.push("✅ Good idea that meets quality standards.");
  } else if (overallScore >= 40) {
    analysis.push("⚠️ Promising concept but needs refinement.");
  } else {
    analysis.push("❌ Needs significant improvement before approval.");
  }
  
  // Specific feedback
  if (scores.clarity < 60) {
    analysis.push("• Clarity: Consider adding more specific details and examples to better explain your idea.");
  } else {
    analysis.push("• Clarity: Well-explained and easy to understand.");
  }
  
  if (scores.innovation < 60) {
    analysis.push("• Innovation: Try emphasizing what makes your idea unique or different from existing solutions.");
  } else {
    analysis.push("• Innovation: Creative and novel approach!");
  }
  
  if (scores.feasibility < 60) {
    analysis.push("• Feasibility: Include more details about resources, timeline, or how you'll implement this.");
  } else {
    analysis.push("• Feasibility: Practical and achievable with available resources.");
  }
  
  if (scores.impact < 60) {
    analysis.push("• Impact: Explain more clearly how this will benefit the campus community.");
  } else {
    analysis.push("• Impact: Strong potential to make a positive difference!");
  }
  
  return analysis.join('\n');
}

/**
 * Determine status based on AI score
 * < 60: DRAFT (needs improvement)
 * >= 60: UNDER_REVIEW (auto-qualifies for review)
 * >= 80: Can be fast-tracked to APPROVED by mentors
 */
function determineStatus(aiScore) {
  if (aiScore >= 60) {
    return 'UNDER_REVIEW';
  }
  return 'DRAFT';
}

export default {
  scoreIdea
};

