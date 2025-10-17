/**
 * API Service Layer
 * Handles all backend API calls
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth APIs
export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  
  microsoftLogin: (email: string, name: string, microsoftId?: string) =>
    api.post('/auth/microsoft', { email, name, microsoftId }),
  
  getMe: () => api.get('/auth/me'),
};

// Ideas APIs
export const ideas = {
  getAll: (params?: {
    category?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    order?: string;
    page?: number;
    limit?: number;
  }) => api.get('/ideas', { params }),
  
  getById: (id: string) => api.get(`/ideas/${id}`),
  
  create: (data: {
    title: string;
    description: string;
    category: string;
    videoLink?: string;
    imageUrl?: string;
    tags?: string[];
  }) => api.post('/ideas', data),
  
  updateStatus: (id: string, status: string, mentorPick?: boolean) =>
    api.patch(`/ideas/${id}/status`, { status, mentorPick }),
  
  delete: (id: string) => api.delete(`/ideas/${id}`),
};

// Voting APIs
export const votes = {
  vote: (ideaId: string) => api.post(`/ideas/${ideaId}/vote`),
  unvote: (ideaId: string) => api.delete(`/ideas/${ideaId}/vote`),
};

// Comments APIs
export const comments = {
  getForIdea: (ideaId: string) => api.get(`/ideas/${ideaId}/comments`),
  create: (ideaId: string, content: string) =>
    api.post(`/ideas/${ideaId}/comments`, { content }),
  delete: (commentId: string) => api.delete(`/comments/${commentId}`),
};

// Leaderboard APIs
export const leaderboard = {
  get: (params?: { limit?: number; page?: number }) =>
    api.get('/leaderboard', { params }),
  
  getBadges: () => api.get('/leaderboard/badges'),
  
  getUserRank: (userId: string) => api.get(`/leaderboard/user/${userId}`),
  
  getTrending: () => api.get('/leaderboard/trending'),
};

// Analytics APIs
export const analytics = {
  getOverview: () => api.get('/analytics'),
  getTopIdeas: (timeframe?: string, limit?: number) =>
    api.get('/analytics/top-ideas', { params: { timeframe, limit } }),
  getTrendingIdeas: (limit?: number) =>
    api.get('/analytics/trending-ideas', { params: { limit } }),
  getTopUsers: (metric?: string, limit?: number) =>
    api.get('/analytics/top-users', { params: { metric, limit } }),
  getActivity: (limit?: number) =>
    api.get('/analytics/activity', { params: { limit } }),
};

export default api;

