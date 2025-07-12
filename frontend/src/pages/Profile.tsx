import React, { useState } from 'react';
import {
  User,
  Calendar,
  Award,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  Flame,
  Star,
  Target,
} from 'lucide-react';
import { currentUser, achievements, questions } from '../utils/data';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'answers' | 'achievements'>('overview');
  const [showEdit, setShowEdit] = useState(false);

  const userQuestions = questions.filter((q) => q.author.id === currentUser.id);
  const userAnswers = currentUser.answers;

  const stats = [
    { label: 'Total XP', value: currentUser.xp, icon: Star, color: 'text-yellow-500' },
    { label: 'Current Streak', value: `${currentUser.streak} days`, icon: Flame, color: 'text-orange-500' },
    { label: 'Questions Asked', value: currentUser.questionsAsked, icon: HelpCircle, color: 'text-blue-500' },
    { label: 'Answers Given', value: currentUser.answersGiven, icon: MessageSquare, color: 'text-green-500' },
  ];

  const xpProgress = {
    current: currentUser.xp,
    nextLevel: 3000,
    level: Math.floor(currentUser.xp / 1000) + 1,
  };

  const progressPercentage = ((xpProgress.current % 1000) / 1000) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-6">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentUser.username}</h1>
              <p className="text-gray-600">{currentUser.email}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>
                  Joined{' '}
                  {new Date(currentUser.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="flex-1 md:ml-auto">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Level {xpProgress.level}</span>
                <span className="text-sm text-gray-500">
                  {xpProgress.current} / {xpProgress.nextLevel} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {xpProgress.nextLevel - xpProgress.current} XP to next level
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowEdit(true)}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <stat.icon size={24} className={stat.color} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'questions', label: 'Questions', icon: HelpCircle },
              { id: 'answers', label: 'Answers', icon: MessageSquare },
              { id: 'achievements', label: 'Achievements', icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <HelpCircle size={16} className="text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-900">Asked a question about Node.js</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MessageSquare size={16} className="text-green-500" />
                      <div>
                        <p className="text-sm text-gray-900">Answered a React question</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Award size={16} className="text-yellow-500" />
                      <div>
                        <p className="text-sm text-gray-900">Earned "Problem Solver" badge</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* XP Growth Placeholder */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">XP Growth</h3>
                  <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
                    <p className="text-gray-500">XP growth chart would go here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Your Questions</h3>
                <span className="text-sm text-gray-500">{userQuestions.length} total</span>
              </div>
              <div className="space-y-4">
                {userQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{question.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{question.votes} votes</span>
                      <span>{question.answers.length} answers</span>
                      <span>{question.views} views</span>
                      <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {question.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answers Tab */}
          {activeTab === 'answers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Your Answers</h3>
                <span className="text-sm text-gray-500">{userAnswers.length} total</span>
              </div>
              <div className="space-y-4">
                {userAnswers.map((answer) => {
                  const question = questions.find((q) => q.id === answer.questionId);
                  return (
                    <div
                      key={answer.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <a
                        href={`/question/${question?.id}`}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        {question?.title}
                      </a>
                      <p className="text-gray-800 mt-2 text-sm">{answer.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Answered on {new Date(answer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
                <span className="text-sm text-gray-500">
                  {achievements.filter((a) => a.earned).length} of {achievements.length} earned
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      achievement.earned
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4
                          className={`font-medium ${
                            achievement.earned ? 'text-green-900' : 'text-gray-500'
                          }`}
                        >
                          {achievement.name}
                        </h4>
                        {achievement.earned && achievement.earnedAt && (
                          <p className="text-xs text-green-600">
                            Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <p
                      className={`text-sm ${
                        achievement.earned ? 'text-green-700' : 'text-gray-500'
                      }`}
                    >
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Username</label>
                <input
                  type="text"
                  defaultValue={currentUser.username}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  defaultValue={currentUser.email}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Avatar URL</label>
                <input
                  type="text"
                  defaultValue={currentUser.avatar}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:underline"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
