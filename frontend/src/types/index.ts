export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  xp: number;
  streak: number;
  questionsAsked: number;
  answersGiven: number;
  joinDate: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: User;
  votes: number;
  answers: Answer[];
  createdAt: string;
  views: number;
}

export interface Answer {
  id: string;
  content: string;
  author: User;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'answer' | 'comment' | 'vote' | 'badge';
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  author: User;
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: number;
  lastMessage?: ChatMessage;
}