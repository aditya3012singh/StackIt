import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  User, 
  Calendar,
  Tag as TagIcon,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  Award
} from 'lucide-react';
import { questionsApi } from '../services/api';
import { Question } from '../types';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import HeroParticles from '../components/HeroParticles';

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'unanswered'>('newest');

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
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await questionsApi.getAll();
      setQuestions(response.data.questions);
    } catch (error) {
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.answers.length - a.answers.length;
      case 'unanswered':
        return a.answers.length - b.answers.length;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-purple-900/20" />
        <HeroParticles />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-3 border-blue-400/30 border-t-blue-400 rounded-full"
          />
          <span className="ml-4 text-slate-400 text-lg">Loading questions...</span>
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
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
                >
                  <MessageSquare className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-blue-300 text-sm font-medium">Community Q&A</span>
                </motion.div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  All <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Questions</span> 💬
                </h1>
                <p className="text-xl text-slate-300">
                  {questions.length} questions from our developer community
                </p>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/questions/ask"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 group"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Ask Question
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions, tags, or content..."
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                    <Filter className="h-5 w-5 text-purple-400" />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="newest">Newest</option>
                    <option value="popular">Most Answers</option>
                    <option value="unanswered">Unanswered</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Questions List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <AnimatePresence>
              {sortedQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        to={`/questions/${question.id}`}
                        className="text-xl lg:text-2xl font-semibold text-white hover:text-blue-400 transition-colors mb-3 block group-hover:text-blue-300"
                      >
                        {question.title}
                      </Link>
                      <p className="text-slate-300 mb-6 line-clamp-2 leading-relaxed">
                        {question.description.substring(0, 200)}...
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        {question.tags.map((tag, tagIndex) => (
                          <motion.span
                            key={tag.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + tagIndex * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm rounded-xl border border-blue-500/30 backdrop-blur-sm"
                          >
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag.name}
                          </motion.span>
                        ))}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-400" />
                            </div>
                            <span className="text-white font-medium">{question.author.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatDistanceToNow(new Date(question.createdAt))} ago</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                              <MessageSquare className="h-4 w-4 text-emerald-400" />
                            </div>
                            <span className="font-medium">{question.answers.length} answers</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-purple-400" />
                            </div>
                            <span className="font-medium">{question.comments.length} comments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Questions */}
          {sortedQuestions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
                <MessageSquare className="h-12 w-12 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No questions found</h3>
              <p className="text-slate-400 mb-8 text-lg max-w-md mx-auto">
                {searchQuery ? 'Try adjusting your search terms' : 'Be the first to ask a question!'}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/questions/ask"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 group"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Ask Question
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;