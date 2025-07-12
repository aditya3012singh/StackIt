import { User, Question, Notification, Achievement, ChatRoom, ChatMessage } from '../types';

export const currentUser: User = {
  id: '1',
  username: 'alex_dev',
  email: 'alex@example.com',
  avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=150',
  xp: 2840,
  streak: 12,
  questionsAsked: 23,
  answersGiven: 87,
  joinDate: '2023-01-15'
};

export const users: User[] = [
  currentUser,
  {
    id: '2',
    username: 'sarah_codes',
    email: 'sarah@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
    xp: 4250,
    streak: 8,
    questionsAsked: 45,
    answersGiven: 132,
    joinDate: '2022-08-22'
  },
  {
    id: '3',
    username: 'mike_stack',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150',
    xp: 1890,
    streak: 5,
    questionsAsked: 12,
    answersGiven: 34,
    joinDate: '2023-06-10'
  }
];

export const questions: Question[] = [
  {
    id: '1',
    title: 'How to implement proper error handling in React applications?',
    content: '...',
    tags: ['react', 'javascript', 'error-handling'],
    author: users[1],
    votes: 24,
    answers: [],
    createdAt: '2024-01-15T10:30:00Z',
    views: 156
  },
  {
    id: '2',
    title: 'TypeScript generics with React components - best practices?',
    content: '...',
    tags: ['typescript', 'react', 'generics'],
    author: users[2],
    votes: 18,
    answers: [],
    createdAt: '2024-01-14T15:45:00Z',
    views: 89
  },
  {
    id: '3',
    title: 'Optimizing database queries in Node.js applications',
    content: '...',
    tags: ['nodejs', 'database', 'performance'],
    author: currentUser,
    votes: 31,
    answers: [],
    createdAt: '2024-01-13T09:20:00Z',
    views: 203
  }
];

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'answer',
    message: 'sarah_codes answered your question about React error handling',
    read: false,
    createdAt: '2024-01-15T11:30:00Z',
    questionId: '1'
  },
  {
    id: '2',
    type: 'vote',
    message: 'Your answer received 5 upvotes',
    read: false,
    createdAt: '2024-01-15T10:15:00Z',
    questionId: '1'
  },
  {
    id: '3',
    type: 'badge',
    message: 'You earned the "Problem Solver" badge!',
    read: true,
    createdAt: '2024-01-14T16:20:00Z'
  },
  {
    id: '4',
    type: 'mention',
    message: 'sarah_codes mentioned your question in a comment',
    read: false,
    createdAt: '2024-01-15T13:00:00Z',
    questionId: '2'
  },
  {
    id: '5',
    type: 'tag',
    message: 'Your question was tagged with "performance"',
    read: false,
    createdAt: '2024-01-15T14:00:00Z',
    questionId: '3'
  },
  {
    id: '6',
    type: 'chat',
    message: 'New message in React Help group: "Check out this cool component pattern"',
    read: false,
    createdAt: '2024-01-15T12:30:00Z',
    chatRoomId: '2'
  }
];

export const chatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'React Help',
    members: ['1', '2']
  },
  {
    id: '2',
    name: 'TypeScript Tips',
    members: ['1', '3']
  }
];

export const chatMessages: ChatMessage[] = [
  {
    id: '1',
    roomId: '1',
    senderId: '2',
    content: 'Hey, need help with React Router?',
    timestamp: '2024-01-15T11:00:00Z'
  },
  {
    id: '2',
    roomId: '1',
    senderId: '1',
    content: 'Sure! What issue are you facing?',
    timestamp: '2024-01-15T11:01:00Z'
  },
  {
    id: '3',
    roomId: '2',
    senderId: '3',
    content: 'Is there a way to infer prop types from data?',
    timestamp: '2024-01-15T11:02:00Z'
  }
];

export const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Fast Responder',
    description: 'Answered a question within 5 minutes',
    icon: '⚡',
    awardedAt: '2024-01-14T10:20:00Z'
  },
  {
    id: '2',
    title: 'Top Voted Answer',
    description: 'Got highest votes in a day',
    icon: '🏆',
    awardedAt: '2024-01-13T17:30:00Z'
  }
];
