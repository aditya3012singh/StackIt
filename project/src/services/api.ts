import axios from 'axios';
import { Question, Answer, Comment, Tag, ChatRoom, ChatMessage, Notification, Flag, SearchResult, LeaderboardEntry, User } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Questions API
export const questionsApi = {
  getAll: () => api.get<{ questions: Question[] }>('/questions'),
  getById: (id: string) => api.get<{ question: Question }>(`/questions/${id}`),
  create: (data: { title: string; description: string; tags: string[] }) => 
    api.post<{ question: Question }>('/questions', data),
  update: (id: string, data: { title: string; description: string }) => 
    api.put<{ question: Question }>(`/questions/${id}`, data),
  delete: (id: string) => api.delete(`/questions/${id}`),
};

// Answers API
export const answersApi = {
  getByQuestion: (questionId: string) => 
    api.get<{ answers: Answer[] }>(`/answers/by-question/${questionId}`),
  create: (questionId: string, description: string) => 
    api.post<{ answer: Answer }>(`/answers/${questionId}`, { description }),
  update: (answerId: string, description: string) => 
    api.put<{ answer: Answer }>(`/answers/${answerId}`, { description }),
  delete: (answerId: string) => api.delete(`/answers/${answerId}`),
  accept: (answerId: string) => api.patch(`/answers/${answerId}/accept`),
  vote: (answerId: string, type: 'UP' | 'DOWN') => 
    api.post(`/answers/${answerId}/vote`, { type }),
};

// Comments API
export const commentsApi = {
  getByQuestion: (questionId: string) => 
    api.get<{ comments: Comment[] }>(`/comments/question/${questionId}`),
  getByAnswer: (answerId: string) => 
    api.get<{ comments: Comment[] }>(`/comments/answer/${answerId}`),
  create: (targetType: 'question' | 'answer', targetId: string, content: string) => 
    api.post<{ comment: Comment }>(`/comments/${targetType}/${targetId}`, { content }),
  update: (commentId: string, content: string) => 
    api.put<{ comment: Comment }>(`/comments/${commentId}`, { content }),
  delete: (commentId: string) => api.delete(`/comments/${commentId}`),
};

// Votes API
export const votesApi = {
  vote: (answerId: string, type: 'UP' | 'DOWN') => 
    api.post(`/votes/${answerId}`, { type }),
  getCount: (answerId: string) => 
    api.get<{ upvotes: number; downvotes: number }>(`/votes/${answerId}`),
};

// Tags API
export const tagsApi = {
  getAll: () => api.get<{ tags: Tag[] }>('/tags'),
  create: (name: string) => api.post<{ tag: Tag }>('/tags', { name }),
  assign: (questionId: string, tagIds: string[]) => 
    api.post(`/tags/assign/${questionId}`, { tagIds }),
};

// Chat API
// export const chatApi = {
//   getRooms: () => api.get<ChatRoom[]>('/chat/rooms'),
//   createRoom: (participantId: string) => 
//     api.post<ChatRoom>('/chat/room', { participantId }),
//   getMessages: (roomId: string) => 
//     api.get<ChatMessage[]>(`/chat/messages/${roomId}`),
//   sendMessage: (roomId: string, content: string) => 
//     api.post<ChatMessage>('/chat/message', { roomId, content }),
// };

// Notifications API
export const notificationsApi = {
  getAll: () => api.get<{ notifications: Notification[] }>('/notifications'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
};

// Search API
export const searchApi = {
  search: (query: string) => api.get<SearchResult>(`/search?q=${encodeURIComponent(query)}`),
};

// Leaderboard API
export const leaderboardApi = {
  get: () => api.get<{ leaderboard: LeaderboardEntry[] }>('/leaderboard'),
};

// Activity API
export const activityApi = {
  get: () => api.get('/activity'),
};

// Flags API
export const flagsApi = {
  create: (data: { type: string; reason: string; questionId?: string; answerId?: string; commentId?: string }) => 
    api.post<{ flag: Flag }>('/flags', data),
  getAll: () => api.get<{ flags: Flag[] }>('/flags'),
  delete: (id: string) => api.delete(`/flags/${id}`),
};

// Admin API
export const adminApi = {
  getPendingQuestions: () => api.get('/admin/pending/questions'),
  approveQuestion: (id: string) => api.post(`/admin/approve/question/${id}`),
  deleteContent: (type: 'question' | 'answer' | 'comment', id: string) => 
    api.delete(`/admin/delete/${type}/${id}`),
  getFlags: () => api.get('/admin/flags'),
};

export const chatApi = {
  getRooms: async () => {
    const response = await api.get<ChatRoom[]>("/chat/rooms");
    return response.data;
  },
  createRoom: async (participantId: string) => {
    const response = await api.post<ChatRoom>("/chat/room", { participantId });
    return response.data;
  },
  getMessages: async (roomId: string) => {
    const response = await api.get<ChatMessage[]>(`/chat/messages/${roomId}`);
    return response.data;
  },
  sendMessage: async (roomId: string, content: string) => {
    const response = await api.post<ChatMessage>("/chat/message", { roomId, content });
    return response.data;
  },
  createGroup: async (name: string, memberIds: string[]) => {
    const response = await api.post("/chat/group", { name, memberIds });
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get<User[]>("/users/all");
    return response.data;
  },
};



export default api;