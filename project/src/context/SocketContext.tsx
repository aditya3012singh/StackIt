import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
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
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('🔌 Connecting to socket with token...');
        
        // Close existing connection if any
        if (socketRef.current) {
          socketRef.current.close();
        }

        socketRef.current = io('http://localhost:8000', {
          auth: { token },
          transports: ['websocket', 'polling'], // Allow fallback
          timeout: 20000,
          forceNew: true
        });

        socketRef.current.on('connect', () => {
          setIsConnected(true);
          console.log('✅ Socket connected successfully');
        });

        socketRef.current.on('disconnect', (reason) => {
          setIsConnected(false);
          console.log('❌ Socket disconnected:', reason);
        });

        socketRef.current.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
          setIsConnected(false);
        });

        socketRef.current.on('notification', (notification: Notification) => {
          toast.success(notification.content);
        });

        return () => {
          if (socketRef.current) {
            console.log('🔌 Cleaning up socket connection');
            socketRef.current.close();
          }
        };
      } else {
        console.log('❌ No JWT token found');
      }
    } else {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setIsConnected(false);
      }
    }
  }, [user]);

  const joinRoom = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join-room', roomId);
      console.log(`🏠 Joining room: ${roomId}`);
    } else {
      console.log('❌ Cannot join room - socket not connected');
    }
  };

  const sendMessage = (roomId: string, content: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-message', { roomId, content });
      console.log(`📤 Sending message to room ${roomId}:`, content);
    } else {
      console.log('❌ Cannot send message - socket not connected');
      toast.error('Cannot send message - not connected');
    }
  };

  const onMessage = (callback: (message: ChatMessage) => void) => {
    if (socketRef.current) {
      socketRef.current.on('receive-message', callback);
      console.log('👂 Listening for messages');
    }
  };

  const onNotification = (callback: (notification: Notification) => void) => {
    if (socketRef.current) {
      socketRef.current.on('notification', callback);
    }
  };

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
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