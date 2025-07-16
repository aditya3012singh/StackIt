import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  X, 
  Tag as TagIcon, 
  MessageSquare, 
  Lightbulb, 
  Code,
  ArrowRight,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { questionsApi, tagsApi } from '../services/api';
import { Tag } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import HeroParticles from '../components/HeroParticles';

const AskQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTags();
  }, [user, navigate]);

  const fetchTags = async () => {
    try {
      const response = await tagsApi.getAll();
      setAvailableTags(response.data.tags);
    } catch (error) {
      toast.error('Failed to fetch tags');
    }
  };

  const handleAddTag = (tagName: string) => {
    if (tagName && !selectedTags.includes(tagName) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tagName]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await questionsApi.create({
        title: title.trim(),
        description: description.trim(),
        tags: selectedTags
      });
      
      toast.success('Question posted successfully!');
      navigate(`/questions/${response.data.question.id}`);
    } catch (error) {
      toast.error('Failed to post question');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-purple-900/20" />
      <HeroParticles />

      <div className="relative z-10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
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
                <MessageSquare className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-blue-300 text-sm font-medium">Ask the Community</span>
              </motion.div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Ask a <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Question</span> 💡
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Get help from the community by asking a clear, detailed question. Share your knowledge and learn together.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2"
            >
              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300"
              >
                {/* Title */}
                <motion.div variants={itemVariants} className="mb-8">
                  <label htmlFor="title" className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 text-xs font-bold">1</span>
                    </div>
                    Question Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's your programming question? Be specific and clear."
                    className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
                    required
                  />
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-slate-400 mt-2 flex items-center gap-2"
                  >
                    <Lightbulb className="h-3 w-3" />
                    Be specific and imagine you're asking a question to another person.
                  </motion.p>
                </motion.div>

                {/* Description */}
                <motion.div variants={itemVariants} className="mb-8">
                  <label htmlFor="description" className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 text-xs font-bold">2</span>
                    </div>
                    Question Details *
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide all the details someone would need to understand and answer your question. Include code snippets, error messages, and what you've tried..."
                    className="w-full h-48 px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300 resize-none"
                    required
                  />
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs text-slate-400 mt-2 flex items-center gap-2"
                  >
                    <Code className="h-3 w-3" />
                    Include any error messages, code snippets, or steps you've already tried.
                  </motion.p>
                </motion.div>

                {/* Tags */}
                <motion.div variants={itemVariants} className="mb-10">
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 text-xs font-bold">3</span>
                    </div>
                    Tags (up to 5)
                  </label>
                  
                  {/* Selected Tags */}
                  <AnimatePresence>
                    {selectedTags.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-3 mb-4"
                      >
                        {selectedTags.map((tag, index) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-xl shadow-lg shadow-blue-500/25 group"
                          >
                            <TagIcon className="h-3 w-3 mr-2" />
                            {tag}
                            <motion.button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              whileHover={{ scale: 1.2, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                              className="ml-2 hover:text-red-300 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </motion.button>
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Add New Tag */}
                  <div className="flex items-center space-x-3 mb-6">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag(newTag);
                        }
                      }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => handleAddTag(newTag)}
                      disabled={!newTag || selectedTags.length >= 5}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 group"
                    >
                      <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                    </motion.button>
                  </div>

                  {/* Popular Tags */}
                  <div>
                    <p className="text-sm text-slate-400 mb-3 font-medium">Popular tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.slice(0, 12).map((tag, index) => (
                        <motion.button
                          key={tag.id}
                          type="button"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.05 }}
                          onClick={() => handleAddTag(tag.name)}
                          disabled={selectedTags.includes(tag.name) || selectedTags.length >= 5}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2 bg-white/5 hover:bg-white/10 disabled:bg-slate-600/50 disabled:cursor-not-allowed text-slate-300 hover:text-white text-sm rounded-lg transition-all duration-300 border border-white/10 hover:border-white/20 backdrop-blur-sm"
                        >
                          {tag.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center justify-end space-x-4"
                >
                  <motion.button
                    type="button"
                    onClick={() => navigate('/questions')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 text-slate-400 hover:text-white transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading || !title.trim() || !description.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center gap-2 group"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Post Question
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Tips */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Tips for Success</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, text: "Make your question title specific and descriptive" },
                    { icon: Code, text: "Include relevant code, error messages, and what you've tried" },
                    { icon: TagIcon, text: "Use appropriate tags to help others find your question" },
                    { icon: AlertCircle, text: "Be respectful and follow community guidelines" }
                  ].map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                    >
                      <tip.icon className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm leading-relaxed">{tip.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Community Impact</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-slate-300 text-sm">Questions Answered Today</span>
                    <span className="text-amber-400 font-bold">247</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-slate-300 text-sm">Active Developers</span>
                    <span className="text-blue-400 font-bold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-slate-300 text-sm">Average Response Time</span>
                    <span className="text-emerald-400 font-bold">12 min</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionPage;