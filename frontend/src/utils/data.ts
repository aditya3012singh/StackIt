import { User, Question, Answer, Comment, Notification, Achievement, ChatMessage, ChatRoom } from '../types';

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
    content: 'I\'m working on a React project and want to implement comprehensive error handling. What are the best practices for handling errors in React components, async operations, and API calls?',
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
    content: 'I\'m trying to create reusable React components with TypeScript generics. What are some best practices and common patterns for implementing type-safe, flexible components?',
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
    content: 'My Node.js application is experiencing slow database queries. What strategies can I use to optimize query performance and reduce response times?',
    tags: ['nodejs', 'database', 'performance'],
    author: currentUser,
    votes: 31,
    answers: [],
    createdAt: '2024-01-13T09:20:00Z',
    views: 203
  },
  {
    id: '4',
    title: 'Understanding closure in JavaScript with practical examples',
    content: 'I\'m having trouble understanding closures in JavaScript. Can someone explain with practical examples how closures work and when to use them?',
    tags: ['javascript', 'closures', 'fundamentals'],
    author: users[0],
    votes: 42,
    answers: [],
    createdAt: '2024-01-12T14:10:00Z',
    views: 287
  }
];

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'answer',
    message: 'sarah_codes answered your question about React error handling',
    read: false,
    createdAt: '2024-01-15T11:30:00Z'
  },
  {
    id: '2',
    type: 'vote',
    message: 'Your answer received 5 upvotes',
    read: false,
    createdAt: '2024-01-15T10:15:00Z'
  },
  {
    id: '3',
    type: 'badge',
    message: 'You earned the "Problem Solver" badge!',
    read: true,
    createdAt: '2024-01-14T16:20:00Z'
  }
];

export const achievements: Achievement[] = [
  {
    id: '1',
    name: 'First Question',
    description: 'Asked your first question',
    icon: '❓',
    earned: true,
    earnedAt: '2023-01-16'
  },
  {
    id: '2',
    name: 'Helpful Answer',
    description: 'Answer was accepted as solution',
    icon: '✅',
    earned: true,
    earnedAt: '2023-02-03'
  },
  {
    id: '3',
    name: 'Week Streak',
    description: 'Active for 7 consecutive days',
    icon: '🔥',
    earned: true,
    earnedAt: '2023-03-15'
  },
  {
    id: '4',
    name: 'Popular Question',
    description: 'Question received 50+ views',
    icon: '👁️',
    earned: false
  },
  {
    id: '5',
    name: 'Expert',
    description: 'Reached 5000 XP',
    icon: '🏆',
    earned: false
  }
];

export const chatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'General Discussion',
    participants: 234,
    lastMessage: {
      id: '1',
      content: 'Anyone working with Next.js 14?',
      author: users[1],
      timestamp: '2024-01-15T12:45:00Z'
    }
  },
  {
    id: '2',
    name: 'React Help',
    participants: 156,
    lastMessage: {
      id: '2',
      content: 'Check out this cool component pattern',
      author: users[2],
      timestamp: '2024-01-15T12:30:00Z'
    }
  },
  {
    id: '3',
    name: 'Career Advice',
    participants: 89,
    lastMessage: {
      id: '3',
      content: 'Just landed my first dev job!',
      author: currentUser,
      timestamp: '2024-01-15T11:20:00Z'
    }
  }
];

export const chatMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hey everyone! How\'s the coding going today?',
    author: users[1],
    timestamp: '2024-01-15T12:45:00Z'
  },
  {
    id: '2',
    content: 'Working on a React project. Having some state management issues.',
    author: users[2],
    timestamp: '2024-01-15T12:46:00Z'
  },
  {
    id: '3',
    content: 'Have you considered using Zustand? It\'s much simpler than Redux.',
    author: currentUser,
    timestamp: '2024-01-15T12:47:00Z'
  },
  {
    id: '4',
    content: 'I\'ll check it out, thanks!',
    author: users[2],
    timestamp: '2024-01-15T12:48:00Z'
  }
];