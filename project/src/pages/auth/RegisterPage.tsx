import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Github, ShieldCheck, Star, Code, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import HeroParticles from '../../components/HeroParticles';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp?: string;
}

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState<RegisterForm | null>(null);

  const { register: registerUser, loginWithProvider } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterForm>();

  const password = watch('password');

  const API_BASE = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000/api/v1';

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const handleFormSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/users/generate-otp`, { email: data.email });
      setFormData(data);
      setStep('otp');
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otpData: RegisterForm) => {
    if (!formData) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/users/verify-otp`, {
        email: formData.email,
        otp: otpData.otp
      });

      await registerUser(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1920')"
        }}
      />
      <div className="absolute inset-0 bg-slate-900/40 z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/25 to-indigo-600/30 z-0" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 z-10">
        <HeroParticles />
      </div>

      {/* Floating Elements */}
      <motion.div
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        className="absolute top-20 right-10 w-20 h-20 border border-blue-400/20 rounded-full z-10"
      />
      <motion.div
        variants={{
          ...floatingVariants,
          animate: {
            ...floatingVariants.animate,
            transition: {
              ...floatingVariants.animate.transition,
              delay: 1,
            },
          },
        }}
        initial="initial"
        animate="animate"
        className="absolute bottom-40 left-10 w-16 h-16 border border-purple-400/20 rounded-lg rotate-45 z-10"
      />
      <motion.div
        variants={{
          ...floatingVariants,
          animate: {
            ...floatingVariants.animate,
            transition: {
              ...floatingVariants.animate.transition,
              delay: 2,
            },
          },
        }}
        initial="initial"
        animate="animate"
        className="absolute top-1/2 left-20 w-12 h-12 border border-indigo-400/20 rounded-full z-10"
      />

      {/* Main Form */}
      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/25"
            >
              {step === 'form' ? <Code className="h-8 w-8 text-white" /> : <ShieldCheck className="h-8 w-8 text-white" />}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
            >
              <Star className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">
                {step === 'form' ? 'Create your account' : 'Verify your email'}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
            >
              {step === 'form' ? 'Sign up to get started' : 'Enter OTP to continue'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-slate-300"
            >
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign in here
              </Link>
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(step === 'form' ? handleFormSubmit : handleOtpSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6"
          >
            {step === 'form' ? (
              <>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                      {...register('name', {
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' },
                      })}
                      className="block w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className="block w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters required' },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="block w-full pl-10 pr-12 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Create a password"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </motion.button>
                  </div>
                  {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match',
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="block w-full pl-10 pr-12 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Re-enter your password"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </motion.button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-400 mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* OTP */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">OTP</label>
                  <input
                    {...register('otp', { required: 'OTP is required' })}
                    type="text"
                    maxLength={6}
                    className="block w-full py-3 px-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    placeholder="Enter the 6-digit OTP"
                  />
                  {errors.otp && <p className="text-sm text-red-400 mt-1">{errors.otp.message}</p>}
                </div>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                  />
                  {step === 'form' ? 'Sending OTP...' : 'Verifying OTP...'}
                </>
              ) : (
                step === 'form' ? 'Send OTP' : 'Verify & Register'
              )}
            </motion.button>

            {step === 'form' && (
              <>
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900/50 text-slate-400">Or continue with</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="inline-flex justify-center items-center py-3 px-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 group"
                  >
                    <svg className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="inline-flex justify-center items-center py-3 px-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 group"
                  >
                    <Github className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    GitHub
                  </motion.button>
                </div>
              </>
            )}
          </motion.form>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-6 text-slate-400 text-sm mt-6 pt-6 border-t border-slate-600/30"
          >
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-blue-400 mr-1" />
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-purple-400 mr-1" />
              <span>Trusted Platform</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;