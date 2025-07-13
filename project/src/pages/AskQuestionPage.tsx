import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Tag as TagIcon } from 'lucide-react';
import { questionsApi, tagsApi } from '../services/api';
import { Tag } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AskQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Ask a Question</h1>
          <p className="text-slate-400">
            Get help from the community by asking a clear, detailed question.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-slate-800 border border-slate-700 rounded-xl p-8"
        >
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
              Question Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your programming question? Be specific."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              Be specific and imagine you're asking a question to another person.
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
              Question Details *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide all the details someone would need to understand and answer your question..."
              className="w-full h-48 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              Include any error messages, code snippets, or steps you've already tried.
            </p>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tags (up to 5)
            </label>
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-emerald-600 text-white text-sm rounded-full"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-red-300 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add New Tag */}
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTag);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleAddTag(newTag)}
                disabled={!newTag || selectedTags.length >= 5}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Popular Tags */}
            <div>
              <p className="text-xs text-slate-400 mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleAddTag(tag.name)}
                    disabled={selectedTags.includes(tag.name) || selectedTags.length >= 5}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-300 text-sm rounded-md transition-colors"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/questions')}
              className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !description.trim()}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </motion.form>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-slate-800 border border-slate-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Tips for asking a great question:</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start">
              <span className="text-emerald-400 mr-2">•</span>
              Make your question title specific and descriptive
            </li>
            <li className="flex items-start">
              <span className="text-emerald-400 mr-2">•</span>
              Include relevant code, error messages, and what you've tried
            </li>
            <li className="flex items-start">
              <span className="text-emerald-400 mr-2">•</span>
              Use appropriate tags to help others find your question
            </li>
            <li className="flex items-start">
              <span className="text-emerald-400 mr-2">•</span>
              Be respectful and follow community guidelines
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AskQuestionPage;