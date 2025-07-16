import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag as TagIcon, TrendingUp, Hash, Users, Star, Zap, Target } from 'lucide-react';
import { tagsApi } from '../services/api';
import { Tag } from '../types';
import toast from 'react-hot-toast';
import HeroParticles from '../components/HeroParticles';

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'popular'>('popular');

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
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await tagsApi.getAll();
      setTags(response.data.tags || []);
    } catch (error) {
      toast.error('Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (tagId: string) => {
    try {
      await tagsApi.follow(tagId);
      toast.success('Followed tag');
      fetchTags();
    } catch (err) {
      toast.error('Failed to follow tag');
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTags = [...filteredTags].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return (b._count?.questions || 0) - (a._count?.questions || 0);
    }
  });

  const getTagColor = (index: number) => {
    const colors = [
      { bg: 'from-blue-500/20 to-blue-600/20', text: 'text-blue-400', border: 'border-blue-500/30', hover: 'hover:border-blue-400/50' },
      { bg: 'from-emerald-500/20 to-emerald-600/20', text: 'text-emerald-400', border: 'border-emerald-500/30', hover: 'hover:border-emerald-400/50' },
      { bg: 'from-purple-500/20 to-purple-600/20', text: 'text-purple-400', border: 'border-purple-500/30', hover: 'hover:border-purple-400/50' },
      { bg: 'from-amber-500/20 to-amber-600/20', text: 'text-amber-400', border: 'border-amber-500/30', hover: 'hover:border-amber-400/50' },
      { bg: 'from-pink-500/20 to-pink-600/20', text: 'text-pink-400', border: 'border-pink-500/30', hover: 'hover:border-pink-400/50' },
      { bg: 'from-cyan-500/20 to-cyan-600/20', text: 'text-cyan-400', border: 'border-cyan-500/30', hover: 'hover:border-cyan-400/50' },
      { bg: 'from-red-500/20 to-red-600/20', text: 'text-red-400', border: 'border-red-500/30', hover: 'hover:border-red-400/50' },
      { bg: 'from-orange-500/20 to-orange-600/20', text: 'text-orange-400', border: 'border-orange-500/30', hover: 'hover:border-orange-400/50' }
    ];
    return colors[index % colors.length];
  };

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
          <span className="ml-4 text-slate-400 text-lg">Loading tags...</span>
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
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6"
              >
                <TagIcon className="h-4 w-4 text-purple-400 mr-2" />
                <span className="text-purple-300 text-sm font-medium">Explore Topics</span>
              </motion.div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Tags</span> 🏷️
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Explore topics and technologies discussed in our developer community.
              </p>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 backdrop-blur-sm transition-all duration-300"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                    <Target className="h-5 w-5 text-blue-400" />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="name">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tags Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {sortedTags.map((tag, index) => {
                const colors = getTagColor(index);
                return (
                  <motion.div
                    key={tag.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`bg-gradient-to-r ${colors.bg} backdrop-blur-md border ${colors.border} ${colors.hover} rounded-2xl p-6 cursor-pointer transition-all duration-300 group`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className={`w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20`}
                        >
                          <Hash className={`h-5 w-5 ${colors.text}`} />
                        </motion.div>
                        <h3 className={`text-lg font-semibold ${colors.text} group-hover:text-white transition-colors`}>
                          {tag.name}
                        </h3>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleFollow(tag.id)}
                        className="text-sm opacity-70 hover:opacity-100 transition-opacity px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20"
                      >
                        <Star className="h-3 w-3" />
                      </motion.button>
                    </div>

                    <div className="space-y-4 text-sm opacity-80">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>Questions</span>
                        </div>
                        <span className="font-bold text-white">{tag._count?.questions || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4" />
                          <span>Followers</span>
                        </div>
                        <span className="font-bold text-white">{tag.followers || '—'}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-current border-opacity-20">
                      <div className="flex items-center justify-between text-xs opacity-70">
                        <span>This week</span>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>+{Math.floor((tag._count?.questions || 0) * 0.1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Trending indicator for popular tags */}
                    {index < 3 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg"
                      >
                        <Zap className="h-3 w-3" />
                        Hot
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* No results */}
          {sortedTags.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
                <TagIcon className="h-12 w-12 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No tags found</h3>
              <p className="text-slate-400 text-lg">Try adjusting your search terms.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagsPage;