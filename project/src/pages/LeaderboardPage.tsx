import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Zap, TrendingUp, User } from 'lucide-react';
import { leaderboardApi } from '../services/api';
import { LeaderboardEntry } from '../types';
import toast from 'react-hot-toast';

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await leaderboardApi.get();
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      toast.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-400 bg-yellow-400/10';
      case 2:
        return 'border-gray-400 bg-gray-400/10';
      case 3:
        return 'border-amber-600 bg-amber-600/10';
      default:
        return 'border-slate-700';
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-6">
            <Trophy className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Leaderboard</h1>
          <p className="text-xl text-slate-400">
            Top contributors in our developer community
          </p>
        </motion.div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-12"
          >
            {/* 2nd Place */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800 border-2 border-gray-400 rounded-xl p-6 mb-4"
              >
                <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {leaderboard[1].profileImage ? (
                    <img
                      src={leaderboard[1].profileImage}
                      alt={leaderboard[1].name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-white" />
                  )}
                </div>
                <Medal className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white">{leaderboard[1].name}</h3>
                <p className="text-2xl font-bold text-gray-400">{leaderboard[1].xp} XP</p>
              </motion.div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800 border-2 border-yellow-400 rounded-xl p-6 mb-4 transform scale-110"
              >
                <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {leaderboard[0].profileImage ? (
                    <img
                      src={leaderboard[0].profileImage}
                      alt={leaderboard[0].name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-slate-900" />
                  )}
                </div>
                <Trophy className="h-10 w-10 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-xl font-semibold text-white">{leaderboard[0].name}</h3>
                <p className="text-3xl font-bold text-yellow-400">{leaderboard[0].xp} XP</p>
              </motion.div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800 border-2 border-amber-600 rounded-xl p-6 mb-4"
              >
                <div className="w-16 h-16 bg-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {leaderboard[2].profileImage ? (
                    <img
                      src={leaderboard[2].profileImage}
                      alt={leaderboard[2].name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-white" />
                  )}
                </div>
                <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white">{leaderboard[2].name}</h3>
                <p className="text-2xl font-bold text-amber-600">{leaderboard[2].xp} XP</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Full Rankings</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {leaderboard.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`p-6 hover:bg-slate-700/50 transition-colors ${getRankColor(index + 1)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(index + 1)}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                      <p className="text-sm text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <Zap className="h-5 w-5 text-amber-400" />
                      <span className="text-xl font-bold text-white">{user.xp} XP</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{user.currentStreak} day streak</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4" />
                        <span>{user.longestStreak} best</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {leaderboard.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Trophy className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No rankings yet</h3>
            <p className="text-slate-400">
              Start contributing to the community to appear on the leaderboard!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;