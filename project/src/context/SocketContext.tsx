import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { ChatMessage, Notification } from '../types';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => void;
  sendMessage: (roomId: string, content: string) => void;
  onMessage: (callback: (message: ChatMessage) => void) => void;
  onNotification: (callback: (notification: Notification) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      if (token) {
        const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000', {
          auth: { token }
        });

        newSocket.on('connect', () => {
          setIsConnected(true);
          console.log('Socket connected');
        });

        newSocket.on('disconnect', () => {
          setIsConnected(false);
          console.log('Socket disconnected');
        });

        newSocket.on('notification', (notification: Notification) => {
          toast.success(notification.content);
        });

        setSocket(newSocket);

        return () => {
          newSocket.close();
        };
      }
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user]);

  const joinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('join-room', roomId);
    }
  };

  const sendMessage = (roomId: string, content: string) => {
    if (socket) {
      socket.emit('send-message', { roomId, content });
    }
  };

  const onMessage = (callback: (message: ChatMessage) => void) => {
    if (socket) {
      socket.on('receive-message', callback);
    }
  };

  const onNotification = (callback: (notification: Notification) => void) => {
    if (socket) {
      socket.on('notification', callback);
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      joinRoom,
      sendMessage,
      onMessage,
      onNotification
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};