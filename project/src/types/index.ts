export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  profileImage?: string;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
  createdAt: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  author: User;
  authorId: string;
  tags: Tag[];
  answers: Answer[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  description: string;
  author: User;
  authorId: string;
  questionId: string;
  votes: Vote[];
  isAccepted: boolean;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  authorId: string;
  questionId?: string;
  answerId?: string;
  createdAt: string;
}

export interface Vote {
  id: string;
  type: 'UP' | 'DOWN';
  userId: string;
  answerId: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  questions?: Question[];
}

export interface Notification {
  id: string;
  type: 'NEW_ANSWER' | 'NEW_COMMENT' | 'MENTION' | 'TAG_ADDED' | 'MESSAGE';
  content: string;
  link?: string;
  recipientId: string;
  read: boolean;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  isGroup: boolean;
  name?: string;
  members: User[];
  messages: ChatMessage[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: User;
  senderId: string;
  roomId: string;
  createdAt: string;
}

export interface Flag {
  id: string;
  type: string;
  reason: string;
  questionId?: string;
  answerId?: string;
  commentId?: string;
  reportedBy: User;
  reportedById: string;
  createdAt: string;
}

export interface SearchResult {
  results: Question[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  xp: number;
  profileImage?: string;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

