import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  Clock, 
  Eye, 
  ArrowUp, 
  MessageSquare, 
  Users,
  Zap,
  BookOpen,
  Award,
  ChevronRight,
  Star
} from 'lucide-react';
import { questions, currentUser } from '../utils/data';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'trending'>('recent');

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const questionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const stats = [
    { label: 'Active Users', value: '12.5K', icon: Users, color: 'text-blue-600' },
    { label: 'Questions Answered', value: '45.2K', icon: MessageSquare, color: 'text-green-600' },
    { label: 'Knowledge Shared', value: '98.7%', icon: BookOpen, color: 'text-purple-600' },
    { label: 'Success Rate', value: '94.3%', icon: Award, color: 'text-yellow-600' },
  ];

  return (
    <motion.div 
      className="space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl"
        variants={heroVariants}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>

        <div className="relative px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Welcome to{' '}
                <motion.span 
                  className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  StackIt
                </motion.span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                A collaborative learning platform where developers and students share knowledge, 
                solve problems, and grow together through meaningful discussions.
              </p>
            </motion.div>
            
            {/* Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search questions, tags, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all text-white placeholder-gray-400"
                />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"
                  layoutId="searchGlow"
                />
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/ask"
                  className="group inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  <Zap className="mr-2 group-hover:text-blue-600 transition-colors" size={20} />
                  Ask Question
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/chat"
                  className="group inline-flex items-center px-8 py-4 border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-all font-semibold text-lg backdrop-blur-sm"
                >
                  <MessageSquare className="mr-2 group-hover:text-blue-400 transition-colors" size={20} />
                  Join Community
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <stat.icon className={`${stat.color} mb-2 mx-auto`} size={24} />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Questions Section */}
      <motion.div 
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        variants={itemVariants}
      >
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <motion.h2 
              className="text-2xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Latest Questions
            </motion.h2>
            <motion.div 
              className="flex bg-gray-100 rounded-lg p-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                onClick={() => setActiveTab('recent')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'recent'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <Clock size={16} className="inline mr-2" />
                Recent
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('trending')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'trending'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <TrendingUp size={16} className="inline mr-2" />
                Trending
              </motion.button>
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            className="divide-y divide-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                variants={questionVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/question/${question.id}`} className="block">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <motion.h3 
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {question.title}
                      </motion.h3>
                      <p className="text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                        {question.content}
                      </p>
                      
                      {/* Tags */}
                      <motion.div 
                        className="flex flex-wrap gap-2 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {question.tags.map((tag, tagIndex) => (
                          <motion.span
                            key={tag}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium hover:bg-blue-200 transition-colors"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + tagIndex * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </motion.div>

                      {/* Meta Information */}
                      <motion.div 
                        className="flex flex-wrap items-center gap-4 text-sm text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <motion.div 
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          <ArrowUp size={16} />
                          <span>{question.votes}</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center gap-1 hover:text-green-600 transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          <MessageSquare size={16} />
                          <span>{question.answers.length} answers</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Eye size={16} />
                          <span>{question.views} views</span>
                        </motion.div>
                        <span className="hidden sm:inline">asked {formatTime(question.createdAt)}</span>
                      </motion.div>
                    </div>

                    {/* Author */}
                    <motion.div 
                      className="flex-shrink-0 hidden sm:block"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <img
                          src={question.author.avatar}
                          alt={question.author.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{question.author.username}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Star size={12} className="text-yellow-500" />
                            <span>{question.author.xp} XP</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredQuestions.length === 0 && (
          <motion.div 
            className="p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">No questions found matching your search.</p>
            <p className="text-gray-400 text-sm">Try adjusting your search terms or browse recent questions.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Welcome Message for Logged-in Users */}
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-12 h-12 rounded-full object-cover"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Welcome back, {currentUser.username}! 👋
              </h3>
              <p className="text-gray-600">Ready to share knowledge and learn something new?</p>
            </div>
          </div>
          <motion.div 
            className="flex items-center gap-3 text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-1 text-yellow-600">
              <Star size={16} />
              <span className="font-medium">{currentUser.xp} XP</span>
            </div>
            <div className="flex items-center gap-1 text-orange-600">
              <Zap size={16} />
              <span className="font-medium">{currentUser.streak} day streak</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;