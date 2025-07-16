import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Settings as SettingsIcon,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import HeroParticles from '../components/HeroParticles';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNewAnswers: true,
    emailNewComments: true,
    emailWeeklyDigest: false,
    pushNotifications: true,
    mentions: true
  });

  // Security settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, color: 'from-blue-500 to-blue-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-emerald-500 to-emerald-600' },
    { id: 'security', label: 'Security', icon: Shield, color: 'from-red-500 to-red-600' },
    { id: 'preferences', label: 'Preferences', icon: Palette, color: 'from-purple-500 to-purple-600' }
  ];

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

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification settings updated!');
    } catch (error) {
      toast.error('Failed to update notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Account deleted successfully');
        await logout();
      } catch (error) {
        toast.error('Failed to delete account');
      } finally {
        setLoading(false);
      }
    }
  };

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
              className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
            >
              <SettingsIcon className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">Account Settings</span>
            </motion.div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Settings</span> ⚙️
            </h1>
            <p className="text-xl text-slate-300">Manage your account preferences and settings.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
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
              className="lg:col-span-3"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
                <AnimatePresence mode="wait">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <motion.div
                      key="profile"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                              Email
                            </label>
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-3">
                            Bio
                          </label>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300 resize-none"
                            placeholder="Tell us about yourself..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                              Location
                            </label>
                            <input
                              type="text"
                              value={profileData.location}
                              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
                              placeholder="e.g. San Francisco, CA"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                              Website
                            </label>
                            <input
                              type="url"
                              value={profileData.website}
                              onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
                              placeholder="https://yourwebsite.com"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSaveProfile}
                            disabled={loading}
                            className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25"
                          >
                            <Save className="h-4 w-4" />
                            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <motion.div
                      key="notifications"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center">
                          <Bell className="h-5 w-5 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-white">Notification Preferences</h2>
                      </div>
                      
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                            <Mail className="h-5 w-5 text-blue-400" />
                            Email Notifications
                          </h3>
                          <div className="space-y-4">
                            {[
                              { key: 'emailNewAnswers', label: 'New answers to your questions', desc: 'Get notified when someone answers your question' },
                              { key: 'emailNewComments', label: 'New comments on your posts', desc: 'Receive updates when someone comments on your content' },
                              { key: 'emailWeeklyDigest', label: 'Weekly activity digest', desc: 'Summary of community activity and trending topics' }
                            ].map((item) => (
                              <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex-1">
                                  <span className="text-white font-medium">{item.label}</span>
                                  <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={notifications[item.key as keyof typeof notifications]}
                                    onChange={(e) => setNotifications({
                                      ...notifications,
                                      [item.key]: e.target.checked
                                    })}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-600"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                            <Bell className="h-5 w-5 text-purple-400" />
                            Push Notifications
                          </h3>
                          <div className="space-y-4">
                            {[
                              { key: 'pushNotifications', label: 'Push notifications', desc: 'Receive browser notifications for important updates' },
                              { key: 'mentions', label: 'When someone mentions you', desc: 'Get notified when you are mentioned in discussions' }
                            ].map((item) => (
                              <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex-1">
                                  <span className="text-white font-medium">{item.label}</span>
                                  <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={notifications[item.key as keyof typeof notifications]}
                                    onChange={(e) => setNotifications({
                                      ...notifications,
                                      [item.key]: e.target.checked
                                    })}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-purple-600"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSaveNotifications}
                            disabled={loading}
                            className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25"
                          >
                            <Save className="h-4 w-4" />
                            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <motion.div
                      key="security"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center">
                          <Shield className="h-5 w-5 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-white">Security Settings</h2>
                      </div>
                      
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                            <Lock className="h-5 w-5 text-blue-400" />
                            Change Password
                          </h3>
                          <div className="space-y-4 max-w-md">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Current Password
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  value={securityData.currentPassword}
                                  onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300 pr-12"
                                />
                                <motion.button
                                  type="button"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </motion.button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                value={securityData.newPassword}
                                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                value={securityData.confirmPassword}
                                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
                              />
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleChangePassword}
                              disabled={loading}
                              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25"
                            >
                              <Lock className="h-4 w-4" />
                              <span>{loading ? 'Updating...' : 'Update Password'}</span>
                            </motion.button>
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-8">
                          <h3 className="text-lg font-medium text-red-400 mb-6 flex items-center gap-2">
                            <Trash2 className="h-5 w-5" />
                            Danger Zone
                          </h3>
                          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm">
                            <h4 className="text-red-400 font-medium mb-2">Delete Account</h4>
                            <p className="text-slate-300 mb-4">
                              Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleDeleteAccount}
                              disabled={loading}
                              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-red-500/25"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>{loading ? 'Deleting...' : 'Delete Account'}</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === 'preferences' && (
                    <motion.div
                      key="preferences"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                          <Palette className="h-5 w-5 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-white">Preferences</h2>
                      </div>
                      
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-medium text-white mb-6">Theme</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['Dark', 'Light', 'System'].map((theme, index) => (
                              <motion.div
                                key={theme}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="p-6 border border-white/20 rounded-xl cursor-pointer hover:border-purple-500/50 transition-all duration-300 bg-white/5 backdrop-blur-sm group"
                              >
                                <div className="text-center">
                                  <div className={`w-16 h-12 mx-auto mb-4 rounded-lg ${
                                    theme === 'Dark' ? 'bg-slate-800 border border-white/20' : 
                                    theme === 'Light' ? 'bg-white border border-slate-200' : 'bg-gradient-to-r from-slate-800 to-white border border-white/20'
                                  }`}></div>
                                  <span className="text-white font-medium group-hover:text-purple-300 transition-colors">{theme}</span>
                                  {index === 0 && (
                                    <div className="mt-2 inline-flex items-center px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                      <Check className="h-3 w-3 mr-1" />
                                      Active
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-white mb-6">Language</h3>
                          <select className="w-full max-w-xs px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 backdrop-blur-sm transition-all duration-300">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>

                        <div className="flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                            className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25"
                          >
                            <Save className="h-4 w-4" />
                            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;