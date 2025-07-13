import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  TrendingUp, 
  Award, 
  Users, 
  MessageSquare,
  Clock,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const quickStats = [
    { label: 'Questions Asked', value: '12', icon: MessageSquare, color: 'text-blue-400' },
    { label: 'Answers Given', value: '34', icon: Award, color: 'text-emerald-400' },
    { label: 'Reputation Points', value: user?.xp || '0', icon: Zap, color: 'text-amber-400' },
    { label: 'Current Streak', value: `${user?.currentStreak || 0} days`, icon: TrendingUp, color: 'text-purple-400' }
  ];

  const recentActivity = [
    {
      type: 'answer',
      title: 'Answered: How to implement OAuth with React?',
      time: '2 hours ago',
      points: '+15 XP'
    },
    {
      type: 'question',
      title: 'Asked: Best practices for state management?',
      time: '1 day ago',
      points: '+5 XP'
    },
    {
      type: 'comment',
      title: 'Commented on: JavaScript closures explained',
      time: '2 days ago',
      points: '+2 XP'
    }
  ];

  const trendingTopics = [
    { name: 'React', questions: 234 },
    { name: 'TypeScript', questions: 189 },
    { name: 'Node.js', questions: 156 },
    { name: 'Python', questions: 143 },
    { name: 'JavaScript', questions: 298 }
  ];

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-400">
            Ready to share knowledge and learn something new today?
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/questions/ask"
              className="flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors group"
            >
              <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
              Ask a Question
            </Link>
            <Link
              to="/questions"
              className="flex items-center justify-center px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 font-semibold rounded-lg transition-colors"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Browse Questions
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                <Link
                  to="/activity"
                  className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center transition-colors"
                >
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-emerald-400 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{activity.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-slate-400 text-sm flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </p>
                        <span className="text-emerald-400 text-sm font-medium">
                          {activity.points}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Trending Topics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Trending Topics</h2>
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <motion.div
                    key={topic.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400 text-sm">#{index + 1}</span>
                      <span className="text-white font-medium">{topic.name}</span>
                    </div>
                    <span className="text-slate-400 text-sm">{topic.questions}</span>
                  </motion.div>
                ))}
              </div>
              <Link
                to="/tags"
                className="block mt-4 text-center text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                Explore all tags
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;