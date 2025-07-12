import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, Eye } from 'lucide-react';

const AskQuestion: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ title, content, tags });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
        <p className="text-gray-600 mt-2">
          Get help from the community by asking a clear, specific question.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Question Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your programming question? Be specific."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {title.length}/150 characters
                </p>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Question Details *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Eye size={16} className="mr-1" />
                    {isPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
                
                {isPreview ? (
                  <div className="min-h-[200px] p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="prose prose-sm max-w-none">
                      {content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-2">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide additional details about your question. Include what you've tried, expected vs actual results, and any relevant code snippets."
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
                    required
                  />
                )}
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (up to 5)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag (e.g., javascript, react, nodejs)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={tags.length >= 5 || !currentTag.trim()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Add relevant tags to help others find your question
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!title.trim() || !content.trim()}
                  className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              How to ask a great question
            </h3>
            <ul className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                <span>Write a clear, specific title that summarizes your problem</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">2.</span>
                <span>Explain what you've tried and what went wrong</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">3.</span>
                <span>Include relevant code snippets and error messages</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">4.</span>
                <span>Add appropriate tags to categorize your question</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">5.</span>
                <span>Be respectful and show appreciation for answers</span>
              </li>
            </ul>
          </div>

          {/* Popular Tags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {['javascript', 'react', 'typescript', 'nodejs', 'python', 'css', 'html', 'database'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (!tags.includes(tag) && tags.length < 5) {
                      setTags([...tags, tag]);
                    }
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;