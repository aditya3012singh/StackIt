import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, User, Calendar, MessageSquare, Tag as TagIcon, Clock, ArrowRight, Zap } from 'lucide-react';
import { searchApi } from '../services/api';
import { Question } from '../types';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import HeroParticles from '../components/HeroParticles';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');

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
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await searchApi.search(searchQuery);
      setResults(response.data.results);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

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
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
              >
                <Search className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-blue-300 text-sm font-medium">Search & Discover</span>
              </motion.div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Search <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Results</span> 🔍
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Find answers, discussions, and insights from our developer community.
              </p>
            </div>
            
            {/* Search Form */}
            <motion.form 
              onSubmit={handleSearch} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions, tags, or content..."
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-md transition-all duration-300 text-lg"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25"
                >
                  Search
                </motion.button>
              </div>
            </motion.form>

            {/* Search Info */}
            {searchParams.get('q') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <p className="text-slate-400 text-lg">
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full"
                      />
                      Searching...
                    </span>
                  ) : (
                    <>
                      <span className="font-medium text-white">{results.length}</span> results found for{' '}
                      <span className="font-medium text-blue-400">"{searchParams.get('q')}"</span>
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Search Results */}
          {!loading && results.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <AnimatePresence>
                {results.map((question, index) => (
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
                          className="text-xl lg:text-2xl font-semibold text-white hover:text-blue-400 transition-colors mb-3 block group-hover:text-blue-300 flex items-center gap-2"
                        >
                          {question.title}
                          <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                        <p className="text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                          {question.description.substring(0, 300)}...
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
                              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm rounded-xl border border-purple-500/30 backdrop-blur-sm"
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
                            <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 text-xs rounded-full border border-amber-500/30">
                              <Zap className="h-3 w-3 mr-1" />
                              Match
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* No Results */}
          {!loading && searchParams.get('q') && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
                <Search className="h-12 w-12 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No results found</h3>
              <p className="text-slate-400 mb-8 text-lg max-w-md mx-auto">
                Try adjusting your search terms or browse all questions.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/questions"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 group"
                >
                  Browse All Questions
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          )}

          {/* Initial State */}
          {!searchParams.get('q') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
                <Search className="h-12 w-12 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Search the community</h3>
              <p className="text-slate-400 text-lg max-w-md mx-auto">
                Find questions, answers, and discussions on any programming topic.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;