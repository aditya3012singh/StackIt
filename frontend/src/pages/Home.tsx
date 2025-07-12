// Home.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, TrendingUp, Clock, Eye, ArrowUp, MessageSquare,
  Users, Zap, BookOpen, Award, ChevronRight, Star, Plus, Sun, Moon
} from 'lucide-react';
import { questions, currentUser } from '../utils/data';

const filters = [
  { key: 'newest', label: 'Newest' },
  { key: 'unanswered', label: 'Unanswered' },
  { key: 'mostanswered', label: 'Most Answered' },
  { key: 'myquestions', label: 'My Questions' },
  { key: 'myanswers', label: 'My Answers' },
];

const sortOptions = [
  { key: 'date', label: 'Date' },
  { key: 'votes', label: 'Votes' },
  { key: 'views', label: 'Views' },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('newest');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [darkMode, setDarkMode] = useState(false);
  const questionsPerPage = 5;

  const filteredQuestions = questions
    .filter((q) => {
      if (activeFilter === 'unanswered') return q.answers.length === 0;
      if (activeFilter === 'mostanswered') return true;
      if (activeFilter === 'myquestions') return q.author.username === currentUser.username;
      if (activeFilter === 'myanswers') return q.answers.some(a => a.author === currentUser.username);
      return true;
    })
    .filter(q =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'votes') return b.votes - a.votes;
      if (sortBy === 'views') return b.views - a.views;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice((page - 1) * questionsPerPage, page * questionsPerPage);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} relative min-h-screen`}>
      {/* ✅ Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
        >
          {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
        </button>
      </div>

      {/* ✅ HERO section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl mt-8">
        <div className="px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Welcome to <span className="text-blue-400">Stack</span><span className="text-purple-400">It</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            A collaborative learning platform where developers and students share knowledge,
            solve problems, and grow together.
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative group mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search questions, tags, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-white placeholder-gray-400"
              />
            </div>
            <div className="flex justify-center gap-4">
              <Link to="/ask" className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">Ask Question</Link>
              <Link to="/chat" className="border border-white text-white px-6 py-3 rounded-xl hover:bg-white/10 transition">Join Community</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
            <div className="text-white">
              <Users className="mx-auto text-blue-500 mb-2" size={24} />
              <div className="text-xl font-bold">12.5K</div>
              <div className="text-sm">Active Users</div>
            </div>
            <div className="text-white">
              <MessageSquare className="mx-auto text-green-500 mb-2" size={24} />
              <div className="text-xl font-bold">45.2K</div>
              <div className="text-sm">Questions Answered</div>
            </div>
            <div className="text-white">
              <BookOpen className="mx-auto text-purple-500 mb-2" size={24} />
              <div className="text-xl font-bold">98.7%</div>
              <div className="text-sm">Knowledge Shared</div>
            </div>
            <div className="text-white">
              <Award className="mx-auto text-yellow-500 mb-2" size={24} />
              <div className="text-xl font-bold">94.3%</div>
              <div className="text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mt-10">
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => {
              setActiveFilter(filter.key);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full border ${
              activeFilter === filter.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            {filter.label}
          </button>
        ))}

        {/* ✅ Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="ml-4 px-4 py-2 rounded-full border bg-white text-gray-800"
        >
          {sortOptions.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* ✅ Questions */}
      <div className="mt-10 space-y-6 max-w-5xl mx-auto px-4">
        {paginatedQuestions.map((q) => (
          <div key={q.id} className="relative bg-white shadow-sm rounded-xl p-6 border border-gray-200">
            {/* Answer count badge top-right */}
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              {q.answers.length} {q.answers.length === 1 ? 'Answer' : 'Answers'}
            </div>
            <Link to={`/question/${q.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
                {q.title}
              </h3>
              <p className="text-gray-600 mt-1 line-clamp-2">{q.content}</p>
            </Link>
            <div className="flex flex-wrap gap-2 mt-4">
              {q.tags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
              <span className="flex items-center gap-1"><ArrowUp size={14} /> {q.votes}</span>
              <span className="flex items-center gap-1"><MessageSquare size={14} /> {q.answers.length} answers</span>
              <span className="flex items-center gap-1"><Eye size={14} /> {q.views} views</span>
            </div>
          </div>
        ))}
        {paginatedQuestions.length === 0 && (
          <div className="text-center text-gray-500 mt-10">No questions found for this filter/search.</div>
        )}
      </div>

      {/* ✅ Pagination */}
      <div className="flex justify-center mt-10 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ✅ Welcome back section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 mt-10 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Welcome back, {currentUser.username}! 👋
              </h3>
              <p className="text-gray-600">Ready to share knowledge and learn something new?</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-yellow-600">
              <Star size={16} />
              <span className="font-medium">{currentUser.xp} XP</span>
            </div>
            <div className="flex items-center gap-1 text-orange-600">
              <Zap size={16} />
              <span className="font-medium">{currentUser.streak} day streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Floating Ask Button */}
      <Link
        to="/ask"
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
};

export default Home;
