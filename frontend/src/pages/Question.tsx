import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Eye, 
  Check,
  Heart,
  Flag,
  Share2
} from 'lucide-react';
import { questions, currentUser } from '../utils/data';

const Question: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const question = questions.find(q => q.id === id);
  const [answer, setAnswer] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  if (!question) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Question not found</p>
        <Link to="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle answer submission
    console.log('Answer:', answer);
    setAnswer('');
    setShowAnswerForm(false);
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
          Back to Questions
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Question */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Question Header */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {question.title}
              </h1>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{question.views} views</span>
                </div>
                <span>asked {formatTime(question.createdAt)}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Question Content */}
            <div className="p-6">
              <div className="flex">
                {/* Voting */}
                <div className="flex flex-col items-center mr-6 space-y-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <ArrowUp size={20} />
                  </button>
                  <span className="text-lg font-semibold text-gray-900">{question.votes}</span>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <ArrowDown size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors mt-4">
                    <Heart size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {question.content}
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center text-gray-500 hover:text-gray-700 text-sm">
                        <Share2 size={16} className="mr-1" />
                        Share
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-gray-700 text-sm ml-4">
                        <Flag size={16} className="mr-1" />
                        Report
                      </button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <img
                        src={question.author.avatar}
                        alt={question.author.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{question.author.username}</p>
                        <p className="text-xs text-gray-500">{question.author.xp} XP</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {question.answers.length} Answers
              </h2>
              <button
                onClick={() => setShowAnswerForm(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Write Answer
              </button>
            </div>

            {/* Sample Answer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="p-6">
                <div className="flex">
                  {/* Voting */}
                  <div className="flex flex-col items-center mr-6 space-y-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <ArrowUp size={20} />
                    </button>
                    <span className="text-lg font-semibold text-gray-900">15</span>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <ArrowDown size={20} />
                    </button>
                    <button className="p-2 text-green-600 bg-green-50 rounded-lg mt-4">
                      <Check size={20} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        You can implement error handling in React using Error Boundaries for component-level errors and try-catch blocks for async operations. Here's a comprehensive approach:
                      </p>
                      <pre className="bg-gray-100 p-4 rounded-lg text-sm mt-4">
{`// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}`}
                      </pre>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        answered {formatTime('2024-01-15T11:30:00Z')}
                      </div>
                      <div className="flex items-center space-x-3">
                        <img
                          src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150"
                          alt="sarah_codes"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">sarah_codes</p>
                          <p className="text-xs text-gray-500">4250 XP</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Form */}
            {showAnswerForm && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
                <form onSubmit={handleSubmitAnswer}>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Share your knowledge and help the community..."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
                    required
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAnswerForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Post Answer
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Follow Question
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Add to Bookmarks
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Share Question
              </button>
            </div>
          </div>

          {/* Related Questions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Questions</h3>
            <div className="space-y-3">
              {questions.slice(0, 3).map((relatedQ) => (
                <Link
                  key={relatedQ.id}
                  to={`/question/${relatedQ.id}`}
                  className="block text-sm text-blue-600 hover:text-blue-700 leading-relaxed"
                >
                  {relatedQ.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;