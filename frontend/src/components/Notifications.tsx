import React, { useState } from 'react';
import {
  Bell,
  Check,
  Award,
  MessageSquare,
  ThumbsUp,
  AtSign,
  Tag,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notifications as initialNotifications } from '../utils/data';
import { Notification } from '../types';

interface NotificationsProps {
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'answer':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'vote':
        return <ThumbsUp size={16} className="text-green-500" />;
      case 'badge':
        return <Award size={16} className="text-yellow-500" />;
      case 'mention':
        return <AtSign size={16} className="text-purple-500" />;
      case 'tag':
        return <Tag size={16} className="text-pink-500" />;
      case 'chat':
        return <MessageSquare size={16} className="text-indigo-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    }
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    if (notification.questionId) {
      navigate(`/question/${notification.questionId}`);
    } else if (notification.chatRoomId) {
      navigate(`/chat/${notification.chatRoomId}`);
    }

    onClose();
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Mark all read
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(notification.createdAt)}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

// Optional: export for badge usage
export const getUnreadCount = (notifications: Notification[]) =>
  notifications.filter((n) => !n.read).length;

export default Notifications;
