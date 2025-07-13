import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag as TagIcon, TrendingUp, Hash, Users } from 'lucide-react';
import { tagsApi } from '../services/api';
import { Tag } from '../types';
import toast from 'react-hot-toast';

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'popular'>('popular');

  // Mock tags data - replace with actual API call
  const mockTags: Tag[] = [
    { id: '1', name: 'javascript', questions: [] },
    { id: '2', name: 'react', questions: [] },
    { id: '3', name: 'typescript', questions: [] },
    { id: '4', name: 'nodejs', questions: [] },
    { id: '5', name: 'python', questions: [] },
    { id: '6', name: 'css', questions: [] },
    { id: '7', name: 'html', questions: [] },
    { id: '8', name: 'vue', questions: [] },
    { id: '9', name: 'angular', questions: [] },
    { id: '10', name: 'mongodb', questions: [] },
    { id: '11', name: 'postgresql', questions: [] },
    { id: '12', name: 'docker', questions: [] },
    { id: '13', name: 'aws', questions: [] },
    { id: '14', name: 'api', questions: [] },
    { id: '15', name: 'graphql', questions: [] },
    { id: '16', name: 'redux', questions: [] },
    { id: '17', name: 'nextjs', questions: [] },
    { id: '18', name: 'express', questions: [] },
    { id: '19', name: 'git', questions: [] },
    { id: '20', name: 'testing', questions: [] }
  ];

  const tagStats = {
    javascript: { count: 1250, followers: 8900 },
    react: { count: 980, followers: 7200 },
    typescript: { count: 750, followers: 5100 },
    nodejs: { count: 650, followers: 4800 },
    python: { count: 890, followers: 6200 },
    css: { count: 420, followers: 3100 },
    html: { count: 380, followers: 2900 },
    vue: { count: 320, followers: 2400 },
    angular: { count: 290, followers: 2100 },
    mongodb: { count: 180, followers: 1500 },
    postgresql: { count: 160, followers: 1200 },
    docker: { count: 240, followers: 1800 },
    aws: { count: 210, followers: 1600 },
    api: { count: 340, followers: 2500 },
    graphql: { count: 150, followers: 1100 },
    redux: { count: 280, followers: 2000 },
    nextjs: { count: 190, followers: 1400 },
    express: { count: 170, followers: 1300 },
    git: { count: 220, followers: 1700 },
    testing: { count: 200, followers: 1500 }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      // Replace with actual API call
      setTags(mockTags);
    } catch (error) {
      toast.error('Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTags = [...filteredTags].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      const aStats = tagStats[a.name as keyof typeof tagStats] || { count: 0 };
      const bStats = tagStats[b.name as keyof typeof tagStats] || { count: 0 };
      return bStats.count - aStats.count;
    }
  });

  const getTagColor = (index: number) => {
    const colors = [
      'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'bg-red-500/20 text-red-400 border-red-500/30',
      'bg-orange-500/20 text-orange-400 border-orange-500/30'
    ];
    return colors[index % colors.length];
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-6">
            <TagIcon className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Tags</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Explore topics and technologies discussed in our community. Find questions by tag to dive deeper into specific subjects.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tags..."
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="popular">Most Popular</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Tags Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {sortedTags.map((tag, index) => {
            const stats = tagStats[tag.name as keyof typeof tagStats] || { count: 0, followers: 0 };
            return (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`p-6 rounded-xl border cursor-pointer hover:scale-105 transition-all duration-200 ${getTagColor(index)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">{tag.name}</h3>
                  </div>
                  <button className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                    Follow
                  </button>
                </div>
                
                <div className="space-y-2 text-sm opacity-80">
                  <div className="flex items-center justify-between">
                    <span>Questions</span>
                    <span className="font-medium">{stats.count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Followers</span>
                    <span className="font-medium">{stats.followers}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                  <div className="flex items-center justify-between text-xs opacity-70">
                    <span>This week</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>+{Math.floor(stats.count * 0.1)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* No Results */}
        {sortedTags.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <TagIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No tags found</h3>
            <p className="text-slate-400">
              Try adjusting your search terms.
            </p>
          </motion.div>
        )}

        {/* Popular Tags Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-white mb-8">Trending This Week</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTags.slice(0, 6).map((tag, index) => {
                const stats = tagStats[tag.name as keyof typeof tagStats] || { count: 0 };
                return (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400 font-mono text-sm">#{index + 1}</span>
                      <span className="text-white font-medium">{tag.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      <span>{stats.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TagsPage;