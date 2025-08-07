import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Users, 
  Target, 
  TrendingUp, 
  Calendar,
  Bell,
  Plus,
  Filter,
  Search,
  CheckCircle,
  Clock,
  Trophy,
  Zap,
  BookOpen,
  GitBranch,
  MessageSquare,
  BarChart3,
  PieChart,
  Star,
  Award,
  Flame,
  Brain,
  Repeat,
  Share2,
  Eye,
  ChevronRight,
  ExternalLink,
  Hash,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import HeroParticles from '../components/HeroParticles';

interface Question {
  id: string;
  title: string;
  platform: 'LeetCode' | 'Codeforces' | 'HackerRank' | 'GeeksforGeeks';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Need Revision';
  url: string;
  notes?: string;
  completedAt?: string;
  timeSpent?: number;
}

interface Syllabus {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
  completedQuestions: number;
  topics: string[];
  isPublic: boolean;
  createdBy: string;
}

interface Contest {
  id: string;
  name: string;
  platform: string;
  startTime: string;
  duration: string;
  url: string;
}

const CodeMatedPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [upcomingContests, setUpcomingContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');

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
    // Mock data - replace with actual API calls
    setQuestions([
      {
        id: '1',
        title: 'Two Sum',
        platform: 'LeetCode',
        difficulty: 'Easy',
        topics: ['Arrays', 'Hash Table'],
        status: 'Completed',
        url: 'https://leetcode.com/problems/two-sum/',
        completedAt: '2025-01-10',
        timeSpent: 45
      },
      {
        id: '2',
        title: 'Binary Tree Inorder Traversal',
        platform: 'LeetCode',
        difficulty: 'Medium',
        topics: ['Trees', 'DFS'],
        status: 'In Progress',
        url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/'
      },
      {
        id: '3',
        title: 'Longest Common Subsequence',
        platform: 'GeeksforGeeks',
        difficulty: 'Hard',
        topics: ['Dynamic Programming'],
        status: 'Need Revision',
        url: 'https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/'
      }
    ]);

    setSyllabi([
      {
        id: '1',
        name: "Striver's SDE Sheet",
        description: 'Complete DSA preparation for Software Development Engineer roles',
        totalQuestions: 191,
        completedQuestions: 45,
        topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'DP'],
        isPublic: true,
        createdBy: 'Striver'
      },
      {
        id: '2',
        name: 'LeetCode Top 150',
        description: 'Must-do problems for coding interviews',
        totalQuestions: 150,
        completedQuestions: 23,
        topics: ['Arrays', 'Strings', 'Trees', 'Graphs'],
        isPublic: true,
        createdBy: 'LeetCode'
      }
    ]);

    setUpcomingContests([
      {
        id: '1',
        name: 'Codeforces Round #918',
        platform: 'Codeforces',
        startTime: '2025-01-15T14:35:00Z',
        duration: '2h 15m',
        url: 'https://codeforces.com/contests'
      },
      {
        id: '2',
        name: 'Weekly Contest 378',
        platform: 'LeetCode',
        startTime: '2025-01-14T02:30:00Z',
        duration: '1h 30m',
        url: 'https://leetcode.com/contest/'
      }
    ]);

    setLoading(false);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
    { id: 'questions', label: 'Questions', icon: Code2, color: 'from-emerald-500 to-emerald-600' },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen, color: 'from-purple-500 to-purple-600' },
    { id: 'teams', label: 'Teams', icon: Users, color: 'from-orange-500 to-orange-600' },
    { id: 'contests', label: 'Contests', icon: Trophy, color: 'from-red-500 to-red-600' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'from-indigo-500 to-indigo-600' }
  ];

  const getStatusColor = (status: Question['status']) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'In Progress':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'Need Revision':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-emerald-400';
      case 'Medium':
        return 'text-amber-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getPlatformColor = (platform: Question['platform']) => {
    switch (platform) {
      case 'LeetCode':
        return 'text-orange-400 bg-orange-500/20';
      case 'Codeforces':
        return 'text-blue-400 bg-blue-500/20';
      case 'HackerRank':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'GeeksforGeeks':
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
    }
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
          <span className="ml-4 text-slate-400 text-lg">Loading CodeMated...</span>
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
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full mb-6"
            >
              <Code2 className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">Collaborative Coding Practice</span>
            </motion.div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">CodeMated</span> 🧩
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl">
              Master Data Structures & Algorithms with collaborative practice, team challenges, and comprehensive tracking.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 sticky top-8">
                <nav className="space-y-3">
                  {tabs.map((tab, index) => (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                          : 'text-slate-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-4"
            >
              <AnimatePresence mode="wait">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: 'Problems Solved', value: '68', icon: CheckCircle, color: 'from-emerald-500 to-emerald-600', bgColor: 'from-emerald-500/20 to-emerald-600/20' },
                        { label: 'Current Streak', value: '12 days', icon: Flame, color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-500/20 to-orange-600/20' },
                        { label: 'Team Rank', value: '#3', icon: Trophy, color: 'from-amber-500 to-amber-600', bgColor: 'from-amber-500/20 to-amber-600/20' },
                        { label: 'Study Hours', value: '45h', icon: Clock, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-500/20 to-blue-600/20' }
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                              <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                          </div>
                          <p className="text-slate-400 font-medium">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Upcoming Contests */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-purple-400" />
                          </div>
                          <h2 className="text-2xl font-semibold text-white">Upcoming Contests</h2>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2"
                        >
                          View all
                          <ChevronRight className="h-4 w-4" />
                        </motion.button>
                      </div>
                      
                      <div className="space-y-4">
                        {upcomingContests.slice(0, 3).map((contest, index) => (
                          <motion.div
                            key={contest.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                                <Trophy className="h-6 w-6 text-purple-400" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">{contest.name}</h3>
                                <p className="text-slate-400 text-sm">{contest.platform} • {contest.duration}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">
                                {new Date(contest.startTime).toLocaleDateString()}
                              </p>
                              <p className="text-slate-400 text-sm">
                                {new Date(contest.startTime).toLocaleTimeString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center">
                          <Zap className="h-5 w-5 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-white">Recent Activity</h2>
                      </div>
                      
                      <div className="space-y-4">
                        {[
                          { action: 'Completed', problem: 'Two Sum', platform: 'LeetCode', time: '2 hours ago' },
                          { action: 'Started', problem: 'Binary Tree Traversal', platform: 'GeeksforGeeks', time: '5 hours ago' },
                          { action: 'Revised', problem: 'Merge Sort', platform: 'HackerRank', time: '1 day ago' }
                        ].map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl"
                          >
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-white">
                                <span className="text-emerald-400 font-medium">{activity.action}</span> {activity.problem} on {activity.platform}
                              </p>
                              <p className="text-slate-400 text-sm">{activity.time}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Questions Tab */}
                {activeTab === 'questions' && (
                  <motion.div
                    key="questions"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Search and Filters */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions..."
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300"
                          >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="not-started">Not Started</option>
                          </select>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Add Question
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <motion.div
                          key={question.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                                  {question.title}
                                </h3>
                                <motion.a
                                  href={question.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  whileHover={{ scale: 1.1 }}
                                  className="text-slate-400 hover:text-blue-400 transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </motion.a>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlatformColor(question.platform)}`}>
                                  {question.platform}
                                </span>
                                <span className={`text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                                  {question.difficulty}
                                </span>
                                <div className="flex items-center space-x-2">
                                  {question.topics.map((topic, topicIndex) => (
                                    <span
                                      key={topicIndex}
                                      className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded-lg flex items-center gap-1"
                                    >
                                      <Hash className="h-3 w-3" />
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              {question.completedAt && (
                                <p className="text-slate-400 text-sm mb-2">
                                  Completed on {new Date(question.completedAt).toLocaleDateString()}
                                  {question.timeSpent && ` • ${question.timeSpent} minutes`}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-2 rounded-xl text-sm font-medium border ${getStatusColor(question.status)}`}>
                                {question.status}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-300"
                              >
                                <MessageSquare className="h-5 w-5" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Syllabus Tab */}
                {activeTab === 'syllabus' && (
                  <motion.div
                    key="syllabus"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-white">Study Syllabus</h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create Syllabus
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {syllabi.map((syllabus, index) => (
                        <motion.div
                          key={syllabus.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -5 }}
                          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors mb-2">
                                {syllabus.name}
                              </h3>
                              <p className="text-slate-400 text-sm mb-4">{syllabus.description}</p>
                            </div>
                            {syllabus.isPublic && (
                              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg">
                                Public
                              </span>
                            )}
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-slate-300 text-sm">Progress</span>
                              <span className="text-white font-medium">
                                {syllabus.completedQuestions}/{syllabus.totalQuestions}
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(syllabus.completedQuestions / syllabus.totalQuestions) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              />
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {syllabus.topics.slice(0, 3).map((topic, topicIndex) => (
                              <span
                                key={topicIndex}
                                className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded-lg"
                              >
                                {topic}
                              </span>
                            ))}
                            {syllabus.topics.length > 3 && (
                              <span className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded-lg">
                                +{syllabus.topics.length - 3} more
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm">by {syllabus.createdBy}</span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 hover:text-purple-300 rounded-lg transition-all duration-300 text-sm font-medium"
                            >
                              Continue
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Teams Tab */}
                {activeTab === 'teams' && (
                  <motion.div
                    key="teams"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center py-16">
                      <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
                        <Users className="h-12 w-12 text-slate-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">Team Collaboration</h3>
                      <p className="text-slate-400 text-lg max-w-md mx-auto mb-8">
                        Create or join teams to solve problems together and track progress collaboratively.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 flex items-center gap-2 mx-auto"
                      >
                        <Users className="h-5 w-5" />
                        Create Team
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center py-16">
                      <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
                        <BarChart3 className="h-12 w-12 text-slate-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">Analytics Dashboard</h3>
                      <p className="text-slate-400 text-lg max-w-md mx-auto">
                        Detailed insights into your coding progress, topic mastery, and performance trends.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeMatedPage;