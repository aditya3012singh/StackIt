import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus,
  TrendingUp,
  Award,
  MessageSquare,
  Clock,
  ChevronRight,
  Zap,
  Code,
  Star,
  Target,
  BookOpen,
  Users,
  Trophy,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { activityApi, tagsApi } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { Tag } from '../types';
import HeroParticles from '../components/HeroParticles';

interface ActivityItem {
  id: string;
  type: 'question' | 'answer' | 'comment';
  title: string;
  description?: string;
  points: number;
  link?: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [trendingTags, setTrendingTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const quickStats = [
    {
      label: 'Questions Asked',
      value: activity.filter(a => a.type === 'question').length.toString(),
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/20 to-blue-600/20',
    },
    {
      label: 'Answers Given',
      value: activity.filter(a => a.type === 'answer').length.toString(),
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/20 to-purple-600/20',
    },
    {
      label: 'Reputation Points',
      value: user?.xp?.toString() || '0',
      icon: Zap,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'from-amber-500/20 to-amber-600/20',
    },
    {
      label: 'Current Streak',
      value: `${user?.currentStreak || 0} days`,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-500/20 to-emerald-600/20',
    },
  ];

  const achievements = [
    { name: 'First Question', icon: MessageSquare, earned: true },
    { name: 'Helpful Answer', icon: Award, earned: true },
    { name: 'Rising Star', icon: Star, earned: false },
    { name: 'Expert', icon: Trophy, earned: false },
  ];

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
    const fetchActivity = async () => {
      try {
        const res = await activityApi.get();
        const { questions, answers, comments } = res.data;

        const formatted: ActivityItem[] = [
          ...questions.map((q: any) => ({
            id: `q-${q.id}`,
            type: 'question',
            title: `Asked: ${q.title}`,
            description: 'You asked a question',
            points: 5,
            link: `/questions/${q.id}`,
            createdAt: q.createdAt,
          })),
          ...answers.map((a: any) => ({
            id: `a-${a.id}`,
            type: 'answer',
            title: `Answered: ${a.question?.title || 'a question'}`,
            description: a.description.slice(0, 80),
            points: 10,
            link: `/questions/${a.questionId}`,
            createdAt: a.createdAt,
          })),
          ...comments.map((c: any) => ({
            id: `c-${c.id}`,
            type: 'comment',
            title: `Commented on: ${c.question?.title || 'a post'}`,
            description: c.content.slice(0, 80),
            points: 2,
            link: `/questions/${c.questionId || ''}`,
            createdAt: c.createdAt,
          })),
        ];

        const sorted = formatted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setActivity(sorted.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard activity:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTrendingTags = async () => {
      try {
        const res = await tagsApi.getAll();
        const allTags: Tag[] = res.data.tags || [];
        const sorted = allTags.sort((a, b) => (b._count?.questions || 0) - (a._count?.questions || 0));
        setTrendingTags(sorted.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch trending tags:', err);
      }
    };

    fetchActivity();
    fetchTrendingTags();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-purple-900/20" />

      {/* Animated Particles */}
      <HeroParticles />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          {/* Welcome Section */}
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
                <Code className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-blue-300 text-sm font-medium">Developer Dashboard</span>
              </motion.div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user?.name}</span> 👋
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Ready to share knowledge and learn something new today? Your developer journey continues here.
              </p>
            </div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/questions/ask" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 group"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Ask a Question
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  to="/questions" 
                  className="inline-flex items-center px-8 py-4 border-2 border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-300 backdrop-blur-sm"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Browse Questions
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </motion.div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors">{stat.value}</p>
                  </div>
                </div>
                <p className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      <Activity className="h-5 w-5 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">Recent Activity</h2>
                  </div>
                  <Link 
                    to="/activity" 
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center transition-colors group"
                  >
                    View all
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full"
                    />
                    <span className="ml-3 text-slate-400">Loading activity...</span>
                  </div>
                ) : activity.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">No recent activity yet.</p>
                    <p className="text-slate-600 text-sm mt-2">Start by asking a question or answering others!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activity.map((act, index) => (
                      <motion.div
                        key={act.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-700/50"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-3 w-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg shadow-blue-500/25"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={act.link || '#'} 
                            className="text-white font-medium hover:text-blue-400 transition-colors block mb-2"
                          >
                            {act.title}
                          </Link>
                          {act.description && (
                            <p className="text-slate-400 text-sm mb-2">{act.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="text-slate-500 text-sm flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(new Date(act.createdAt))} ago
                            </p>
                            <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-xs font-medium rounded-full">
                              <Zap className="h-3 w-3 mr-1" />
                              +{act.points} XP
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-8"
            >
              {/* Trending Topics */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Trending Topics</h2>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {trendingTags.map((tag, index) => (
                    <motion.div
                      key={tag.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <Link
                        to={`/tags/${tag.id}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-700/50 group"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-slate-500 text-sm font-medium w-6">#{index + 1}</span>
                          <span className="text-white font-medium group-hover:text-purple-300 transition-colors">{tag.name}</span>
                        </div>
                        <span className="text-slate-400 text-sm">{tag._count?.questions || 0}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <Link 
                  to="/tags" 
                  className="block mt-6 text-center text-purple-400 hover:text-purple-300 text-sm transition-colors font-medium"
                >
                  Explore all tags →
                </Link>
              </div>

              {/* Achievements */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-amber-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Achievements</h2>
                </div>
                
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                        achievement.earned 
                          ? 'bg-amber-500/10 border border-amber-500/20' 
                          : 'bg-slate-800/30 border border-slate-700/30'
                      }`}
                    >
                      <achievement.icon 
                        className={`h-5 w-5 ${
                          achievement.earned ? 'text-amber-400' : 'text-slate-500'
                        }`} 
                      />
                      <span 
                        className={`font-medium ${
                          achievement.earned ? 'text-white' : 'text-slate-500'
                        }`}
                      >
                        {achievement.name}
                      </span>
                      {achievement.earned && (
                        <Star className="h-4 w-4 text-amber-400 ml-auto" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;