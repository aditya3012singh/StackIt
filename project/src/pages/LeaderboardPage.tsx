import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Zap, TrendingUp, User, Star, Crown, Target } from 'lucide-react';
import { leaderboardApi } from '../services/api';
import { LeaderboardEntry } from '../types';
import toast from 'react-hot-toast';
import HeroParticles from '../components/HeroParticles';

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

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
        return <Medal className="h-6 w-6 text-slate-300" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 hover:border-yellow-400/50';
      case 2:
        return 'border-slate-400/30 bg-gradient-to-r from-slate-400/10 to-slate-500/5 hover:border-slate-300/50';
      case 3:
        return 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-600/5 hover:border-amber-400/50';
      default:
        return 'border-white/10 hover:border-white/20';
    }
  };

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
          <span className="ml-4 text-slate-400 text-lg">Loading leaderboard...</span>
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
                className="inline-flex items-center px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6"
              >
                <Trophy className="h-4 w-4 text-amber-400 mr-2" />
                <span className="text-amber-300 text-sm font-medium">Community Champions</span>
              </motion.div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">Leaderboard</span> 🏆
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Celebrating the top contributors in our developer community. Keep climbing!
              </p>
            </div>
          </motion.div>

          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              {/* 2nd Place */}
              <motion.div variants={itemVariants} className="order-2 md:order-1">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/5 backdrop-blur-md border border-slate-300/30 rounded-2xl p-8 text-center hover:border-slate-300/50 transition-all duration-300 group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 bg-gradient-to-r from-slate-400/20 to-slate-500/20 rounded-full mx-auto mb-6 flex items-center justify-center border border-slate-300/30"
                  >
                    {leaderboard[1].profileImage ? (
                      <img
                        src={leaderboard[1].profileImage}
                        alt={leaderboard[1].name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-slate-300" />
                    )}
                  </motion.div>
                  <Medal className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{leaderboard[1].name}</h3>
                  <motion.p 
                    className="text-3xl font-bold text-slate-300 mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  >
                    {leaderboard[1].xp} XP
                  </motion.p>
                  <div className="inline-flex items-center px-3 py-1 bg-slate-300/20 text-slate-300 text-sm rounded-full">
                    <Crown className="h-3 w-3 mr-1" />
                    2nd Place
                  </div>
                </motion.div>
              </motion.div>

              {/* 1st Place */}
              <motion.div variants={itemVariants} className="order-1 md:order-2">
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white/5 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-8 text-center hover:border-yellow-400/50 transition-all duration-300 transform md:scale-110 group shadow-2xl shadow-yellow-500/25"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-24 h-24 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-full mx-auto mb-6 flex items-center justify-center border border-yellow-400/30"
                  >
                    {leaderboard[0].profileImage ? (
                      <img
                        src={leaderboard[0].profileImage}
                        alt={leaderboard[0].name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-yellow-400" />
                    )}
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mb-2">{leaderboard[0].name}</h3>
                  <motion.p 
                    className="text-4xl font-bold text-yellow-400 mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  >
                    {leaderboard[0].xp} XP
                  </motion.p>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-300 text-sm rounded-full border border-yellow-500/30">
                    <Crown className="h-4 w-4 mr-2" />
                    Champion
                  </div>
                </motion.div>
              </motion.div>

              {/* 3rd Place */}
              <motion.div variants={itemVariants} className="order-3">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/5 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 text-center hover:border-amber-400/50 transition-all duration-300 group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-full mx-auto mb-6 flex items-center justify-center border border-amber-500/30"
                  >
                    {leaderboard[2].profileImage ? (
                      <img
                        src={leaderboard[2].profileImage}
                        alt={leaderboard[2].name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-amber-400" />
                    )}
                  </motion.div>
                  <Award className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{leaderboard[2].name}</h3>
                  <motion.p 
                    className="text-3xl font-bold text-amber-500 mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                  >
                    {leaderboard[2].xp} XP
                  </motion.p>
                  <div className="inline-flex items-center px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full">
                    <Star className="h-3 w-3 mr-1" />
                    3rd Place
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Full Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="px-8 py-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Full Rankings</h2>
              </div>
            </div>
            
            <div className="divide-y divide-white/10">
              <AnimatePresence>
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay: 0.8 + index * 0.05, duration: 0.6 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`p-6 transition-all duration-300 group ${getRankColor(index + 1)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center justify-center w-12 h-12"
                        >
                          {getRankIcon(index + 1)}
                        </motion.div>
                        
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center border border-white/20 group-hover:border-blue-400/50 transition-all duration-300"
                        >
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-7 w-7 text-slate-400" />
                          )}
                        </motion.div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">{user.name}</h3>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="h-5 w-5 text-amber-400" />
                          <span className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">{user.xp} XP</span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-slate-400">
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
              </AnimatePresence>
            </div>
          </motion.div>

          {leaderboard.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
                <Trophy className="h-12 w-12 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No rankings yet</h3>
              <p className="text-slate-400 max-w-md mx-auto text-lg">
                Start contributing to the community to appear on the leaderboard!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;