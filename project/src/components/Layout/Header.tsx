import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { notificationsApi } from '../../services/api';
import { Notification } from '../../types';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await notificationsApi.getAll();
        const unread = res.data.notifications.filter((n: Notification) => !n.read);
        setUnreadCount(unread.length);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchUnread();

    if (socket?.onNotification) {
      const handleNotification = (notif: Notification) => {
        setUnreadCount((prev) => prev + 1);
        toast.success(notif.content);
      };

      socket.onNotification(handleNotification);

      return () => {
        socket.socket?.off('notification', handleNotification);
      };
    }
  }, [socket]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-2xl sticky top-0 z-50 overflow-visible"
    >
      {/* Background Effects */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-indigo-600/10" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-10 w-2 h-2 bg-blue-400/20 rounded-full animate-pulse" />
        <div className="absolute top-4 right-20 w-1 h-1 bg-purple-400/30 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-2 left-1/3 w-1.5 h-1.5 bg-indigo-400/20 rounded-full animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 group"
            >
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-300">
                <HelpCircle className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                DevQ&A
              </span>
            </motion.div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions, tags, users..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-slate-800/70"
              />
            </div>
          </form>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <motion.button
                  onClick={async () => {
                    setUnreadCount(0);
                    try {
                      await notificationsApi.markAllAsRead();
                    } catch (e) {
                      console.error('Failed to mark notifications read');
                    }
                    navigate('/notifications');
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 text-slate-400 hover:text-white transition-all duration-300 hover:bg-slate-800/50 rounded-xl group"
                >
                  <Bell className="h-5 w-5 group-hover:animate-pulse" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Messages */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/chat')}
                  className="p-2.5 text-slate-400 hover:text-white transition-all duration-300 hover:bg-slate-800/50 rounded-xl group"
                >
                  <MessageCircle className="h-5 w-5 group-hover:animate-pulse" />
                </motion.button>

                {/* XP Display */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 px-3 py-2 rounded-xl backdrop-blur-sm"
                >
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-amber-300 font-semibold">{user.xp}</span>
                </motion.div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group"
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="h-8 w-8 rounded-full border-2 border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-300"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-300">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="hidden sm:block text-white font-medium group-hover:text-blue-300 transition-colors">
                      {user.name}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 z-[9999] bg-slate-800/90 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/50 py-2 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />
                        <Link
                          to="/profile"
                          className="relative flex items-center space-x-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="h-4 w-4 group-hover:text-blue-400 transition-colors" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="relative flex items-center space-x-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="h-4 w-4 group-hover:text-purple-400 transition-colors" />
                          <span>Settings</span>
                        </Link>
                        <div className="border-t border-slate-700/50 my-1" />
                        <button
                          onClick={handleLogout}
                          className="relative w-full flex items-center space-x-3 px-4 py-2.5 text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
                        >
                          <LogOut className="h-4 w-4 group-hover:text-red-400 transition-colors" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-slate-800/50"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Mobile Menu */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 text-slate-400 hover:text-white transition-all duration-300 hover:bg-slate-800/50 rounded-xl"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-slate-700/50"
            >
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
