import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Trash2,
  Clock,
  Zap,
  Award,
  ChevronRight
} from 'lucide-react';
import { questionsApi, answersApi, commentsApi, votesApi } from '../services/api';
import { Question, Answer } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import HeroParticles from '../components/HeroParticles';

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentTarget, setCommentTarget] = useState<{ type: 'question' | 'answer'; id: string } | null>(null);

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
      <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-purple-900/20" />
        <HeroParticles />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-3 border-blue-400/30 border-t-blue-400 rounded-full"
          />
          <span className="ml-4 text-slate-400 text-lg">Loading question...</span>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-purple-900/20" />
        <HeroParticles />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
              <MessageSquare className="h-12 w-12 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Question not found</h2>
            <Link to="/questions" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-2">
              Back to questions
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
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
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          {/* Question Card */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 hover:border-blue-500/30 transition-all duration-300"
          >
            <motion.div variants={itemVariants} className="flex items-start justify-between mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-white flex-1 leading-tight">{question.title}</h1>
              {user && question.authorId === user.id && (
                <div className="flex items-center space-x-2 ml-6">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all duration-300"
                  >
                    <Edit className="h-5 w-5" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="prose prose-invert max-w-none mb-6">
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-lg">{question.description}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-6">
              {question.tags.map((tag, index) => (
                <motion.span
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm rounded-xl border border-blue-500/30 backdrop-blur-sm"
                >
                  <TagIcon className="h-3 w-3 mr-2" />
                  {tag.name}
                </motion.span>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between text-sm text-slate-400 border-t border-white/10 pt-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-white font-medium">{question.author?.name || "Unknown"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Asked {formatDistanceToNow(new Date(question.createdAt))} ago</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCommentTarget({ type: 'question', id: question.id })}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Add comment</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  <Flag className="h-4 w-4" />
                  <span>Report</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Question Comments */}
            <AnimatePresence>
              {question.comments.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 border-t border-white/10 pt-6"
                >
                  <h4 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments
                  </h4>
                  <div className="space-y-3">
                    {question.comments.map((comment, index) => (
                      <motion.div 
                        key={comment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                      >
                        <p className="text-slate-300 text-sm mb-3 leading-relaxed">{comment.content}</p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-medium">{comment.author?.name || "Unknown"}</span>
                          <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Answers Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </h2>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {answers.map((answer, index) => (
                  <motion.div
                    key={answer.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className={`bg-white/5 backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 ${
                      answer.isAccepted 
                        ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 shadow-lg shadow-emerald-500/25' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start space-x-6">
                      {/* Vote Controls */}
                      <div className="flex flex-col items-center space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleVote(answer.id, 'UP')}
                          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all duration-300"
                          disabled={!user}
                        >
                          <ArrowUp className="h-6 w-6" />
                        </motion.button>
                        
                        <span className="text-xl font-bold text-white px-3 py-1 bg-white/10 rounded-lg">
                          {getVoteCount(answer)}
                        </span>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleVote(answer.id, 'DOWN')}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300"
                          disabled={!user}
                        >
                          <ArrowDown className="h-6 w-6" />
                        </motion.button>
                        
                        {/* Accept Button */}
                        {user && question.authorId === user.id && !answer.isAccepted && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAcceptAnswer(answer.id)}
                            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all duration-300"
                            title="Accept this answer"
                          >
                            <Check className="h-6 w-6" />
                          </motion.button>
                        )}
                        
                        {/* Accepted Badge */}
                        {answer.isAccepted && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="p-2 text-emerald-400 bg-emerald-400/20 rounded-lg border border-emerald-500/30"
                            title="Accepted answer"
                          >
                            <Check className="h-6 w-6" />
                          </motion.div>
                        )}
                      </div>

                      {/* Answer Content */}
                      <div className="flex-1">
                        <div className="prose prose-invert max-w-none mb-6">
                          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{answer.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-400 border-t border-white/10 pt-4">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                <User className="h-4 w-4 text-emerald-400" />
                              </div>
                              <span className="text-white font-medium">{answer.author?.name || "Unknown"}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>Answered {formatDistanceToNow(new Date(answer.createdAt))} ago</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCommentTarget({ type: 'answer', id: answer.id })}
                              className="flex items-center space-x-2 px-3 py-1 hover:bg-white/10 rounded-lg transition-all duration-300"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>Comment</span>
                            </motion.button>
                            {user && answer.authorId === user.id && (
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-2 px-3 py-1 hover:bg-white/10 rounded-lg transition-all duration-300"
                              >
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Answer Comments */}
                        <AnimatePresence>
                          {answer.comments.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 border-t border-white/10 pt-4"
                            >
                              <div className="space-y-3">
                                {answer.comments.map((comment, commentIndex) => (
                                  <motion.div 
                                    key={comment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: commentIndex * 0.1 }}
                                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                                  >
                                    <p className="text-slate-300 text-sm mb-3 leading-relaxed">{comment.content}</p>
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                      <span className="font-medium">{comment.author?.name || "Unknown"}</span>
                                      <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Comment Form */}
          <AnimatePresence>
            {commentTarget && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 hover:border-blue-500/30 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  Add a comment to {commentTarget.type}
                </h3>
                <form onSubmit={handleSubmitComment}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full h-24 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300 resize-none"
                    required
                  />
                  <div className="flex items-center justify-end space-x-4 mt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCommentTarget(null)}
                      className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25"
                    >
                      Add Comment
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Answer Form */}
          {user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Your Answer</h3>
              </div>
              <form onSubmit={handleSubmitAnswer}>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full h-40 px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 backdrop-blur-sm transition-all duration-300 resize-none"
                  required
                />
                <div className="flex items-center justify-end mt-6">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Post Your Answer
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-slate-300 mb-4 text-lg">
                Please <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">login</Link> to post an answer.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;