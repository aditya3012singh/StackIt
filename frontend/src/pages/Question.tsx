import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { questions, currentUser } from '../utils/data';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Question: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const question = questions.find((q) => q.id === id);
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
    if (!user) return toast.error('Login required to post an answer');
    const newAnswer = {
      id: Date.now().toString(),
      content: answer,
      votes: 0,
      voters: [],
      author: currentUser
    };
    question.answers.push(newAnswer);
    setAnswer('');
    setShowAnswerForm(false);
  };

  const handleVote = (answerId: string, type: 'up' | 'down') => {
    if (!user) return toast.error('Login required to vote');

    const answer = question.answers.find((a) => a.id === answerId);
    if (!answer) return;

    if (answer.voters.includes(user.id)) {
      return toast.error('You already voted on this answer');
    }

    if (type === 'up') answer.votes++;
    else answer.votes--;

    answer.voters.push(user.id);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft size={20} className="mr-2" />
          Back to Questions
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{question.views} views</span>
                </div>
                <span>asked {formatTime(question.createdAt)}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {question.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="flex">
                <div className="flex flex-col items-center mr-6 space-y-2">
                  <ArrowUp size={20} />
                  <span className="text-lg font-semibold text-gray-900">{question.votes}</span>
                  <ArrowDown size={20} />
                </div>
                <div className="flex-1">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{question.content}</p>
                  </div>
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
                      <img src={question.author.avatar} alt={question.author.username} className="w-10 h-10 rounded-full object-cover" />
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

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{question.answers.length} Answers</h2>
              <button
                onClick={() => {
                  if (!user) {
                    toast.error('Please login to answer');
                    navigate('/login');
                  } else {
                    setShowAnswerForm(true);
                  }
                }}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Write Answer
              </button>
            </div>

            {question.answers.map((ans) => (
              <div key={ans.id} className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-6">
                <div className="flex">
                  <div className="flex flex-col items-center mr-6 space-y-2">
                    <button onClick={() => handleVote(ans.id, 'up')} className="text-gray-400 hover:text-blue-600">
                      <ArrowUp size={20} />
                    </button>
                    <span className="text-lg font-semibold text-gray-900">{ans.votes}</span>
                    <button onClick={() => handleVote(ans.id, 'down')} className="text-gray-400 hover:text-red-600">
                      <ArrowDown size={20} />
                    </button>
                    <Check size={20} className="text-green-600 mt-4" />
                  </div>
                  <div className="flex-1">
                    <div dangerouslySetInnerHTML={{ __html: ans.content }} className="prose max-w-none" />
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">answered {formatTime('2024-01-15T11:30:00Z')}</div>
                      <div className="flex items-center space-x-3">
                        <img src={ans.author.avatar} alt={ans.author.username} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ans.author.username}</p>
                          <p className="text-xs text-gray-500">{ans.author.xp} XP</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {showAnswerForm && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
                <form onSubmit={handleSubmitAnswer}>
                  <ReactQuill value={answer} onChange={setAnswer} placeholder="Write your answer here..." className="mb-4" />
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

        <div className="space-y-6">
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