import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  User, Mail, Calendar, Edit, Zap, TrendingUp, Trophy, Award, Star, Camera, Save, Upload
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import axios from "axios";
import HeroParticles from "../components/HeroParticles";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user: currentUser, updateAuthUser } = useAuth();

  const [user, setUser] = useState(currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || "");
  const [editPassword, setEditPassword] = useState("");
  const [uploading, setUploading] = useState(false);

  const isOwnProfile = !id || (currentUser && currentUser.id === user?.id);

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

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await fetch(`http://localhost:8000/api/v1/users/upload-profile`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.url || typeof data.url !== "string") {
        throw new Error("Upload failed");
      }

      const updateRes = await fetch(`http://localhost:8000/api/v1/users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ profileImage: data.url }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.message || "Update failed");

      setUser(updateData.user);
      updateAuthUser(updateData.user);
      toast.success("Profile picture updated!");
    } catch (err) {
      console.error("❌ Error during upload/update:", err);
      toast.error("Upload or update failed");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/users/update-profile`,
        {
          name: editName,
          password: editPassword || undefined,
          profileImage: user?.profileImage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser(res.data.user);
      updateAuthUser(res.data.user);
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Profile update error:", err);
      toast.error("Profile update failed");
    }
  };

  const achievements = [
    { name: "First Answer", description: "Posted your first answer", earned: true, icon: Award },
    { name: "Helpful", description: "Answer upvoted 10 times", earned: true, icon: Trophy },
    { name: "Popular Question", description: "Question with 100+ views", earned: true, icon: Star },
    { name: "Expert", description: "50 accepted answers", earned: false, icon: Trophy },
    { name: "Legendary", description: "1000+ reputation points", earned: false, icon: Star },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-purple-900/20" />
        <HeroParticles />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
              <User className="h-12 w-12 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
            <p className="text-slate-400">The profile you're looking for doesn't exist.</p>
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
              <User className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">
                {isOwnProfile ? 'Your Profile' : 'Developer Profile'}
              </span>
            </motion.div>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 hover:border-blue-500/30 transition-all duration-300"
          >
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-32 h-32 rounded-2xl object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/20">
                      <User className="h-16 w-16 text-blue-400" />
                    </div>
                  )}
                  
                  {isOwnProfile && (
                    <motion.label
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      htmlFor="profileImage"
                      className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 cursor-pointer shadow-lg shadow-blue-500/25 transition-all duration-300 group"
                    >
                      {uploading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <Camera className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                      )}
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                        }}
                        className="hidden"
                      />
                    </motion.label>
                  )}
                </motion.div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{user.name}</h1>
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Star className="h-4 w-4 text-amber-400" />
                      <span>Developer</span>
                    </div>
                  </div>
                  
                  {isOwnProfile && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(!isEditing)}
                      className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-medium flex items-center gap-2 shadow-lg shadow-blue-500/25"
                    >
                      <Edit className="h-4 w-4" />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </motion.button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-blue-400" />
                    </div>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span>Joined {formatDistanceToNow(new Date(user.createdAt))} ago</span>
                  </div>
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 mb-6 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Your name"
                          className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
                        />
                        <input
                          type="password"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          placeholder="New password (optional)"
                          className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleProfileUpdate}
                        disabled={uploading}
                        className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all duration-300"
                      >
                        <Save className="h-4 w-4" />
                        {uploading ? "Saving..." : "Save Changes"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 px-4 py-3 rounded-xl flex items-center space-x-3 backdrop-blur-sm"
                  >
                    <Zap className="h-5 w-5 text-amber-400" />
                    <div>
                      <span className="text-white font-semibold text-lg">{user.xp}</span>
                      <p className="text-amber-300 text-sm">XP Points</p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 px-4 py-3 rounded-xl flex items-center space-x-3 backdrop-blur-sm"
                  >
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <div>
                      <span className="text-white font-semibold text-lg">{user.currentStreak}</span>
                      <p className="text-emerald-300 text-sm">Day Streak</p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 px-4 py-3 rounded-xl flex items-center space-x-3 backdrop-blur-sm"
                  >
                    <Trophy className="h-5 w-5 text-purple-400" />
                    <div>
                      <span className="text-white font-semibold text-lg">{user.longestStreak}</span>
                      <p className="text-purple-300 text-sm">Best Streak</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Achievements</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    achievement.earned
                      ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 hover:border-emerald-400/50"
                      : "border-slate-600/30 bg-white/5 hover:border-slate-500/50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`p-3 rounded-xl ${
                        achievement.earned ? "bg-emerald-500/20" : "bg-slate-600/20"
                      }`}
                    >
                      <achievement.icon className={`h-6 w-6 ${
                        achievement.earned ? "text-emerald-400" : "text-slate-400"
                      }`} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${
                        achievement.earned ? "text-emerald-400" : "text-slate-400"
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + idx * 0.1 }}
                      >
                        <Star className="h-5 w-5 text-amber-400" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;