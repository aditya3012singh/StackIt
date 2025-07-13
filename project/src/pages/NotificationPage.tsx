import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, MessageSquare, Trophy, User, Filter, Trash2, BookMarked as MarkAsRead } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Mock notifications - replace with actual API call
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'NEW_ANSWER',
      content: 'John Doe answered your question about React hooks',
      link: '/questions/123',
      recipientId: user?.id || '',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: '2',
      type: 'NEW_COMMENT',
      content: 'Sarah left a comment on your answer',
      link: '/questions/456',
      recipientId: user?.id || '',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: '3',
      type: 'MENTION',
      content: 'Alex mentioned you in a comment',
      link: '/questions/789',
      recipientId: user?.id || '',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
    },
    {
      id: '4',
      type: 'TAG_ADDED',
      content: 'Your question was tagged with "react" and "hooks"',
      link: '/questions/321',
      recipientId: user?.id || '',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: '5',
      type: 'MESSAGE',
      content: 'You have a new message from Jane',
      link: '/chat',
      recipientId: user?.id || '',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    }
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Replace with actual API call
      setNotifications(mockNotifications);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
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

  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    toast.success('Notification marked as read');
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success('Notification deleted');
  };

  const deleteAllRead = async () => {
    setNotifications(prev => prev.filter(notif => !notif.read));
    toast.success('All read notifications deleted');
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Bell className="h-8 w-8 text-emerald-400" />
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-slate-400">
                Stay updated with your community activity and interactions.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={deleteAllRead}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear read</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-slate-400" />
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'read', label: 'Read' }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  {filterOption.label}
                  {filterOption.key === 'unread' && unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`bg-slate-800 border rounded-xl p-6 hover:border-emerald-500/50 transition-colors cursor-pointer ${
                !notification.read ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700'
              }`}
              onClick={() => {
                if (!notification.read) {
                  markAsRead(notification.id);
                }
                if (notification.link) {
                  window.location.href = notification.link;
                }
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-slate-700 rounded-lg">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`mb-2 ${notification.read ? 'text-slate-300' : 'text-white font-medium'}`}>
                        {notification.content}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDistanceToNow(new Date(notification.createdAt))} ago
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      )}
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Notifications */}
        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bell className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
            </h3>
            <p className="text-slate-400">
              {filter === 'all' 
                ? "You're all caught up! New notifications will appear here."
                : `No ${filter} notifications found. Try a different filter.`
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;