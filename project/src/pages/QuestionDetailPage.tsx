import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  User, 
  Calendar,
  Tag as TagIcon,
  Check,
  Flag,
  Edit,
  Trash2
} from 'lucide-react';
import { questionsApi, answersApi, commentsApi, votesApi } from '../services/api';
import { Question, Answer } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentTarget, setCommentTarget] = useState<{ type: 'question' | 'answer'; id: string } | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuestion();
      fetchAnswers();
    }
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await questionsApi.getById(id!);
      setQuestion(response.data.question);
    } catch (error) {
      toast.error('Failed to fetch question');
    }
  };

  const fetchAnswers = async () => {
    try {
      const response = await answersApi.getByQuestion(id!);
      setAnswers(response.data.answers);
    } catch (error) {
      toast.error('Failed to fetch answers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim() || !user) return;

    try {
      await answersApi.create(id!, newAnswer);
      setNewAnswer('');
      fetchAnswers();
      toast.success('Answer submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  };

  const handleVote = async (answerId: string, type: 'UP' | 'DOWN') => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }

    try {
      await votesApi.vote(answerId, type);
      fetchAnswers();
      toast.success(`Vote ${type.toLowerCase()} recorded`);
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!user || !question || question.authorId !== user.id) return;

    try {
      await answersApi.accept(answerId);
      fetchAnswers();
      toast.success('Answer marked as accepted!');
    } catch (error) {
      toast.error('Failed to accept answer');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentTarget || !user) return;

    try {
      await commentsApi.create(commentTarget.type, commentTarget.id, newComment);
      setNewComment('');
      setCommentTarget(null);
      fetchQuestion();
      fetchAnswers();
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const getVoteCount = (answer: Answer) => {
    const upvotes = answer.votes.filter(v => v.type === 'UP').length;
    const downvotes = answer.votes.filter(v => v.type === 'DOWN').length;
    return upvotes - downvotes;
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

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Question not found</h2>
          <Link to="/questions" className="text-emerald-400 hover:text-emerald-300">
            Back to questions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-3xl font-bold text-white flex-1">{question.title}</h1>
            {user && question.authorId === user.id && (
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Edit className="h-5 w-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="prose prose-invert max-w-none mb-6">
            <p className="text-slate-300 whitespace-pre-wrap">{question.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {question.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-1 bg-slate-700 text-emerald-400 text-sm rounded-full"
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag.name}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-700 pt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{question.author?.name || "Unknown"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Asked {formatDistanceToNow(new Date(question.createdAt))} ago</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCommentTarget({ type: 'question', id: question.id })}
                className="flex items-center space-x-1 hover:text-white transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Add comment</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-white transition-colors">
                <Flag className="h-4 w-4" />
                <span>Report</span>
              </button>
            </div>
          </div>

          {question.comments.length > 0 && (
            <div className="mt-6 border-t border-slate-700 pt-4">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Comments</h4>
              <div className="space-y-3">
                {question.comments.map((comment) => (
                  <div key={comment.id} className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-slate-300 text-sm mb-2">{comment.content}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{comment.author?.name || "Unknown"}</span>
                      <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>

          <div className="space-y-6">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className={`bg-slate-800 border rounded-xl p-6 ${
                  answer.isAccepted ? 'border-emerald-500' : 'border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center space-y-2">
                    <button
                      onClick={() => handleVote(answer.id, 'UP')}
                      className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                      disabled={!user}
                    >
                      <ArrowUp className="h-6 w-6" />
                    </button>
                    <span className="text-lg font-semibold text-white">
                      {getVoteCount(answer)}
                    </span>
                    <button
                      onClick={() => handleVote(answer.id, 'DOWN')}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      disabled={!user}
                    >
                      <ArrowDown className="h-6 w-6" />
                    </button>
                    {user && question.authorId === user.id && !answer.isAccepted && (
                      <button
                        onClick={() => handleAcceptAnswer(answer.id)}
                        className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                        title="Accept this answer"
                      >
                        <Check className="h-6 w-6" />
                      </button>
                    )}
                    {answer.isAccepted && (
                      <div className="p-2 text-emerald-400" title="Accepted answer">
                        <Check className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="prose prose-invert max-w-none mb-4">
                      <p className="text-slate-300 whitespace-pre-wrap">{answer.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-700 pt-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{answer.author?.name || "Unknown"}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Answered {formatDistanceToNow(new Date(answer.createdAt))} ago</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setCommentTarget({ type: 'answer', id: answer.id })}
                          className="flex items-center space-x-1 hover:text-white transition-colors"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Comment</span>
                        </button>
                        {user && answer.authorId === user.id && (
                          <button className="flex items-center space-x-1 hover:text-white transition-colors">
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {answer.comments.length > 0 && (
                      <div className="mt-4 border-t border-slate-700 pt-4">
                        <div className="space-y-3">
                          {answer.comments.map((comment) => (
                            <div key={comment.id} className="bg-slate-700/50 rounded-lg p-3">
                              <p className="text-slate-300 text-sm mb-2">{comment.content}</p>
                              <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>{comment.author?.name || "Unknown"}</span>
                                <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {commentTarget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Add a comment to {commentTarget.type}
            </h3>
            <form onSubmit={handleSubmitComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full h-24 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                required
              />
              <div className="flex items-center justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setCommentTarget(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Add Comment
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Your Answer</h3>
            <form onSubmit={handleSubmitAnswer}>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full h-40 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                required
              />
              <div className="flex items-center justify-end mt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Post Your Answer
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center"
          >
            <p className="text-slate-300 mb-4">
              Please <Link to="/login" className="text-emerald-400 hover:text-emerald-300">login</Link> to post an answer.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetailPage;
