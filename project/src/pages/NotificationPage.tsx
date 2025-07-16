import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle,
  MessageSquare,
  Trophy,
  User,
  Filter,
  Trash2,
  Check,
  X,
  Zap,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';
import { notificationsApi } from '../services/api';
import HeroParticles from '../components/HeroParticles';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (socket?.on) {
      const handleNewNotification = (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        toast.success(notification.content);
      };

      socket.on('notification', handleNewNotification);
      return () => {
        socket.off('notification', handleNewNotification);
      };
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationsApi.getAll();
      setNotifications(res.data.notifications);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationsApi.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const deleteAllRead = async () => {
    try {
      await notificationsApi.clearRead();
      setNotifications((prev) => prev.filter((n) => !n.read));
      toast.success('Read notifications cleared');
    } catch {
      toast.error('Failed to delete read');
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'NEW_ANSWER':
        return <MessageSquare className="h-5 w-5 text-blue-400" />;
      case 'NEW_COMMENT':
        return <MessageSquare className="h-5 w-5 text-emerald-400" />;
      case 'MENTION':
        return <User className="h-5 w-5 text-purple-400" />;
      case 'TAG_ADDED':
        return <Trophy className="h-5 w-5 text-amber-400" />;
      case 'MESSAGE':
        return <MessageSquare className="h-5 w-5 text-pink-400" />;
      default:
        return <Bell className="h-5 w-5 text-slate-400" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'NEW_ANSWER':
        return 'border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-blue-600/5 hover:border-blue-400/50';
      case 'NEW_COMMENT':
        return 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 hover:border-emerald-400/50';
      case 'MENTION':
        return 'border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-purple-600/5 hover:border-purple-400/50';
      case 'TAG_ADDED':
        return 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-600/5 hover:border-amber-400/50';
      case 'MESSAGE':
        return 'border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-pink-600/5 hover:border-pink-400/50';
      default:
        return 'border-white/10 hover:border-white/20';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) =>
    filter === 'unread' ? !n.read : filter === 'read' ? n.read : true
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-purple-900/20" />
        <HeroParticles />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-3 border-blue-400/30 border-t-blue-400 rounded-full"
          />
          <span className="ml-4 text-slate-400 text-lg">Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-purple-900/20" />
      <HeroParticles />

      <div className="relative z-10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
                >
                  <Bell className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-blue-300 text-sm font-medium">Stay Updated</span>
                </motion.div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white">
                    Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-full shadow-lg shadow-red-500/25"
                    >
                      {unreadCount}
                    </motion.div>
                  )}
                </div>
                <p className="text-xl text-slate-300">
                  Stay updated with recent activities and messages.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={markAllAsRead}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-6 py-3 text-white rounded-xl text-sm flex items-center gap-2 font-medium shadow-lg shadow-emerald-500/25 transition-all duration-300"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark all read
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={deleteAllRead}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-6 py-3 text-white rounded-xl text-sm flex items-center gap-2 font-medium backdrop-blur-sm transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear read
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <Filter className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Filter Notifications</h2>
              </div>
              
              <div className="flex gap-3">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread', count: unreadCount },
                  { key: 'read', label: 'Read' }
                ].map(({ key, label, count }) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(key as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      filter === key
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {label}
                    {count !== undefined && count > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Notification list */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filtered.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
                  <Bell className="h-12 w-12 text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {filter === 'all'
                    ? 'No notifications'
                    : `No ${filter} notifications`}
                </h3>
                <p className="text-slate-400 text-lg">You're all caught up!</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {filtered.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`bg-white/5 backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 cursor-pointer group ${
                      !notification.read ? getNotificationColor(notification.type) : 'border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id);
                      if (notification.link) window.location.href = notification.link;
                    }}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-4 items-start flex-1">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 group-hover:border-blue-400/50 transition-all duration-300"
                        >
                          {getNotificationIcon(notification.type)}
                        </motion.div>
                        
                        <div className="flex-1">
                          <p className={`mb-2 leading-relaxed ${
                            notification.read
                              ? 'text-slate-300'
                              : 'text-white font-medium'
                          }`}>
                            {notification.content}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDistanceToNow(new Date(notification.createdAt))} ago</span>
                            </div>
                            {!notification.read && (
                              <div className="flex items-center space-x-1">
                                <Zap className="h-3 w-3 text-blue-400" />
                                <span className="text-blue-400 font-medium">New</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {!notification.read && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            title="Mark as read"
                            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all duration-300"
                          >
                            <Check className="w-4 h-4" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          title="Delete"
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;