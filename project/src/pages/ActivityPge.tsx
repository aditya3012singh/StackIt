import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  MessageSquare, 
  ThumbsUp, 
  Award, 
  Calendar,
  User,
  Filter,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

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

  // Mock activity data
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'answer',
      title: 'How to implement OAuth with React?',
      description: 'Provided a comprehensive answer with code examples',
      points: 15,
      link: '/questions/123',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: '2',
      type: 'question',
      title: 'Best practices for state management in large React apps?',
      description: 'Asked a detailed question about React state management',
      points: 5,
      link: '/questions/456',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: '3',
      type: 'vote',
      title: 'Upvoted answer about JavaScript closures',
      points: 1,
      link: '/questions/789',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
    },
    {
      id: '4',
      type: 'comment',
      title: 'Commented on: Understanding async/await in JavaScript',
      description: 'Added helpful clarification about error handling',
      points: 2,
      link: '/questions/321',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Earned "Helpful" badge',
      description: 'Your answer received 10 upvotes',
      points: 50,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: '6',
      type: 'answer',
      title: 'How to optimize React component performance?',
      description: 'Shared techniques for React optimization',
      points: 12,
      link: '/questions/654',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'question':
        return <MessageSquare className="h-5 w-5 text-blue-400" />;
      case 'answer':
        return <MessageSquare className="h-5 w-5 text-emerald-400" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-purple-400" />;
      case 'vote':
        return <ThumbsUp className="h-5 w-5 text-amber-400" />;
      case 'achievement':
        return <Award className="h-5 w-5 text-yellow-400" />;
      default:
        return <Activity className="h-5 w-5 text-slate-400" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'question':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'answer':
        return 'border-emerald-500/20 bg-emerald-500/5';
      case 'comment':
        return 'border-purple-500/20 bg-purple-500/5';
      case 'vote':
        return 'border-amber-500/20 bg-amber-500/5';
      case 'achievement':
        return 'border-yellow-500/20 bg-yellow-500/5';
      default:
        return 'border-slate-700';
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'questions') return activity.type === 'question';
    if (filter === 'answers') return activity.type === 'answer';
    if (filter === 'votes') return activity.type === 'vote';
    if (filter === 'achievements') return activity.type === 'achievement';
    return true;
  });

  const totalPoints = activities.reduce((sum, activity) => sum + activity.points, 0);

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="h-8 w-8 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Your Activity</h1>
          </div>
          <p className="text-slate-400">
            Track your contributions and progress in the community.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-emerald-400">{totalPoints}</div>
            <div className="text-slate-400 text-sm">Total Points</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {activities.filter(a => a.type === 'question').length}
            </div>
            <div className="text-slate-400 text-sm">Questions</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {activities.filter(a => a.type === 'answer').length}
            </div>
            <div className="text-slate-400 text-sm">Answers</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {activities.filter(a => a.type === 'achievement').length}
            </div>
            <div className="text-slate-400 text-sm">Achievements</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-slate-400" />
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Activity' },
                { key: 'questions', label: 'Questions' },
                { key: 'answers', label: 'Answers' },
                { key: 'votes', label: 'Votes' },
                { key: 'achievements', label: 'Achievements' }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`bg-slate-800 border rounded-xl p-6 hover:border-emerald-500/50 transition-colors ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-slate-700 rounded-lg">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        {activity.link ? (
                          <a href={activity.link} className="hover:text-emerald-400 transition-colors">
                            {activity.title}
                          </a>
                        ) : (
                          activity.title
                        )}
                      </h3>
                      {activity.description && (
                        <p className="text-slate-400 text-sm mb-2">{activity.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(activity.createdAt))} ago</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span className="capitalize">{activity.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-semibold">
                        +{activity.points} XP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Activity */}
        {filteredActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Activity className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No activity found</h3>
            <p className="text-slate-400">
              {filter === 'all' 
                ? 'Start participating in the community to see your activity here!'
                : `No ${filter} activity found. Try a different filter.`
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;