import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  MessageSquare,
  ThumbsUp,
  Award,
  Filter,
  User,
  Clock,
  Zap,
  TrendingUp,
  Target,
  Star,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { activityApi } from '../services/api';
import HeroParticles from '../components/HeroParticles';

interface ActivityItem {
  id: string;
  type: 'question' | 'answer' | 'comment' | 'vote' | 'achievement';
  title: string;
  description?: string;
  points: number;
  link?: string;
  createdAt: string;
}

const ActivityPage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'questions' | 'answers' | 'votes' | 'achievements'>('all');

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
            title: q.title,
            description: 'You asked a question',
            points: 5,
            link: `/questions/${q.id}`,
            createdAt: q.createdAt,
          })),
          ...answers.map((a: any) => ({
            id: `a-${a.id}`,
            type: 'answer',
            title: 'Answered a question',
            description: a.description.slice(0, 100),
            points: 10,
            link: `/questions/${a.questionId}`,
            createdAt: a.createdAt,
          })),
          ...comments.map((c: any) => ({
            id: `c-${c.id}`,
            type: 'comment',
            title: 'Commented on a post',
            description: c.content.slice(0, 100),
            points: 2,
            link: c.questionId ? `/questions/${c.questionId}` : '#',
            createdAt: c.createdAt,
          })),
        ];

        formatted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setActivities(formatted);
      } catch (err) {
        console.error("❌ Failed to fetch activity:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const getActivityIcon = (type: ActivityItem['type']) => {
    const iconProps = "h-5 w-5";
    switch (type) {
      case 'question':
        return <MessageSquare className={`${iconProps} text-blue-400`} />;
      case 'answer':
        return <MessageSquare className={`${iconProps} text-emerald-400`} />;
      case 'comment':
        return <MessageSquare className={`${iconProps} text-purple-400`} />;
      case 'vote':
        return <ThumbsUp className={`${iconProps} text-amber-400`} />;
      case 'achievement':
        return <Award className={`${iconProps} text-yellow-400`} />;
      default:
        return <Activity className={`${iconProps} text-slate-400`} />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'question':
        return 'border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-blue-600/5 hover:border-blue-400/50';
      case 'answer':
        return 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 hover:border-emerald-400/50';
      case 'comment':
        return 'border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-purple-600/5 hover:border-purple-400/50';
      case 'vote':
        return 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-600/5 hover:border-amber-400/50';
      case 'achievement':
        return 'border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 hover:border-yellow-400/50';
      default:
        return 'border-white/10 hover:border-white/20';
    }
  };

  const filteredActivities = activities.filter(activity => {
    switch (filter) {
      case 'questions': return activity.type === 'question';
      case 'answers': return activity.type === 'answer';
      case 'votes': return activity.type === 'vote';
      case 'achievements': return activity.type === 'achievement';
      default: return true;
    }
  });

  const totalPoints = activities.reduce((sum, a) => sum + a.points, 0);

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
          <span className="ml-4 text-slate-400 text-lg">Loading your activity...</span>
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
                className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
              >
                <Activity className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-blue-300 text-sm font-medium">Activity Dashboard</span>
              </motion.div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Activity</span> 📊
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Track your contributions and progress in the developer community.
              </p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <StatCard 
              label="Total Points" 
              value={totalPoints} 
              icon={Zap}
              color="from-amber-500 to-amber-600"
              bgColor="from-amber-500/20 to-amber-600/20"
            />
            <StatCard 
              label="Questions" 
              value={activities.filter(a => a.type === 'question').length} 
              icon={MessageSquare}
              color="from-blue-500 to-blue-600"
              bgColor="from-blue-500/20 to-blue-600/20"
            />
            <StatCard 
              label="Answers" 
              value={activities.filter(a => a.type === 'answer').length} 
              icon={Award}
              color="from-emerald-500 to-emerald-600"
              bgColor="from-emerald-500/20 to-emerald-600/20"
            />
            <StatCard 
              label="Achievements" 
              value={activities.filter(a => a.type === 'achievement').length} 
              icon={Star}
              color="from-purple-500 to-purple-600"
              bgColor="from-purple-500/20 to-purple-600/20"
            />
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 }} 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <Filter className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Filter Activity</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {[
                  { key: 'all', label: 'All Activity', icon: Activity },
                  { key: 'questions', label: 'Questions', icon: MessageSquare },
                  { key: 'answers', label: 'Answers', icon: Award },
                  { key: 'votes', label: 'Votes', icon: ThumbsUp },
                  { key: 'achievements', label: 'Achievements', icon: Star }
                ].map(({ key, label, icon: Icon }) => (
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
                    <Icon className="h-4 w-4" />
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.8 }} 
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredActivities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`bg-white/5 backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 group ${getActivityColor(activity.type)}`}
                >
                  <div className="flex items-start space-x-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="flex-shrink-0 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 group-hover:border-blue-400/50 transition-all duration-300"
                    >
                      {getActivityIcon(activity.type)}
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                            {activity.link ? (
                              <a 
                                href={activity.link} 
                                className="hover:text-blue-400 transition-colors flex items-center gap-2 group/link"
                              >
                                {activity.title}
                                <ChevronRight className="h-4 w-4 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                              </a>
                            ) : (
                              activity.title
                            )}
                          </h3>
                          
                          {activity.description && (
                            <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                              {activity.description}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{formatDistanceToNow(new Date(activity.createdAt))} ago</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span className="capitalize">{activity.type}</span>
                            </div>
                          </div>
                        </div>
                        
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="text-right ml-4"
                        >
                          <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm font-semibold rounded-xl border border-blue-500/30">
                            <Zap className="h-4 w-4 mr-1" />
                            +{activity.points} XP
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Activity */}
          {filteredActivities.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
                <Activity className="h-12 w-12 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No activity found</h3>
              <p className="text-slate-400 max-w-md mx-auto text-lg">
                {filter === 'all'
                  ? 'Start participating in the community to see your activity here!'
                  : `No ${filter} activity found. Try a different filter.`}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced stat component with animations
const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  color, 
  bgColor 
}: { 
  label: string; 
  value: number; 
  icon: any; 
  color: string; 
  bgColor: string; 
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    }}
    whileHover={{ 
      scale: 1.05,
      y: -5,
      transition: { duration: 0.2 }
    }}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group"
  >
    <div className="flex items-center justify-between mb-4">
      <motion.div 
        className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <Icon className={`h-6 w-6 bg-gradient-to-r ${color} bg-clip-text text-transparent`} />
      </motion.div>
      <div className="text-right">
        <motion.p 
          className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {value}
        </motion.p>
      </div>
    </div>
    <p className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors">{label}</p>
  </motion.div>
);

export default ActivityPage;