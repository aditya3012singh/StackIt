import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Award, 
  Zap, 
  MessageSquare,
  TrendingUp,
  Edit,
  Trophy,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock user stats - replace with actual API calls
  const userStats = {
    questionsAsked: 23,
    answersGiven: 45,
    commentsPosted: 12,
    acceptedAnswers: 32,
    totalVotes: 156,
    bestAnswer: 89
  };

  const recentActivity = [
    {
      type: 'answer',
      title: 'How to implement OAuth with React?',
      time: '2 hours ago',
      votes: 15
    },
    {
      type: 'question',
      title: 'Best practices for state management in large React apps?',
      time: '1 day ago',
      votes: 8
    },
    {
      type: 'comment',
      title: 'Commented on: JavaScript closures explained',
      time: '2 days ago',
      votes: 3
    }
  ];

  const achievements = [
    { name: 'First Answer', description: 'Posted your first answer', earned: true },
    { name: 'Helpful', description: 'Answer upvoted 10 times', earned: true },
    { name: 'Popular Question', description: 'Question with 100+ views', earned: true },
    { name: 'Expert', description: '50 accepted answers', earned: false },
    { name: 'Legendary', description: '1000+ reputation points', earned: false }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
        </div>
      </div>
    );
  }

  const isOwnProfile = !id || (currentUser && currentUser.id === user.id);

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center">
                  <User className="h-16 w-16 text-white" />
                </div>
              )}
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors">
                  <Edit className="h-4 w-4 text-white" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDistanceToNow(new Date(user.createdAt))} ago</span>
                </div>
              </div>

              {/* XP and Streak */}
              <div className="flex items-center space-x-6 mt-6">
                <div className="bg-slate-700 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-amber-400" />
                    <span className="text-white font-semibold">{user.xp} XP</span>
                  </div>
                </div>
                <div className="bg-slate-700 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <span className="text-white font-semibold">{user.currentStreak} day streak</span>
                  </div>
                </div>
                <div className="bg-slate-700 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    <span className="text-white font-semibold">Best: {user.longestStreak} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{userStats.questionsAsked}</div>
                  <div className="text-slate-400 text-sm">Questions Asked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{userStats.answersGiven}</div>
                  <div className="text-slate-400 text-sm">Answers Given</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{userStats.acceptedAnswers}</div>
                  <div className="text-slate-400 text-sm">Accepted Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{userStats.totalVotes}</div>
                  <div className="text-slate-400 text-sm">Total Votes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{userStats.commentsPosted}</div>
                  <div className="text-slate-400 text-sm">Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{userStats.bestAnswer}</div>
                  <div className="text-slate-400 text-sm">Best Answer Score</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-emerald-400 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{activity.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-slate-400 text-sm">{activity.time}</p>
                        <span className="text-emerald-400 text-sm font-medium">
                          +{activity.votes} votes
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Achievements</h2>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      achievement.earned 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-slate-600 bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        achievement.earned ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}>
                        {achievement.earned ? (
                          <Award className="h-4 w-4 text-white" />
                        ) : (
                          <Star className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          achievement.earned ? 'text-emerald-400' : 'text-slate-400'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-slate-500">{achievement.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;