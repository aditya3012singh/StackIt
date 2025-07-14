import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  MessageSquare,
  Award,
  Zap,
  Code,
  BookOpen,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import HeroParticles from '../components/HeroParticles';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { icon: Users, label: 'Active Developers', value: '50K+' },
    { icon: MessageSquare, label: 'Questions Answered', value: '500K+' },
    { icon: Award, label: 'Solutions Found', value: '90%' },
    { icon: Zap, label: 'Response Time', value: '< 2hrs' }
  ];

  const features = [
    {
      icon: Code,
      title: 'Code-First Community',
      description: 'Get help with real code problems from experienced developers worldwide.'
    },
    {
      icon: BookOpen,
      title: 'Knowledge Sharing',
      description: 'Learn from comprehensive answers and build your programming expertise.'
    },
    {
      icon: Star,
      title: 'Reputation System',
      description: 'Earn XP and build your developer reputation with quality contributions.'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Showcase your expertise and connect with opportunities in the tech industry.'
    }
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

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Background Overlay */}

      {/* Hero Section */}
      <section 
        className="relative py-24 lg:py-40 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1920')"
        }}
      >
        {/* Background Overlay for hero only */}
        <div className="absolute inset-0 bg-slate-900/80 z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-emerald-900/30 z-0" />

        {/* Animated Particles */}
        <HeroParticles />

        {/* Animated Background Elements */}
        <motion.div 
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          className="absolute top-20 right-10 w-20 h-20 border border-emerald-400/20 rounded-full"
        />
        <motion.div 
          variants={{
            ...floatingVariants,
            animate: {
              ...floatingVariants.animate,
              transition: {
                ...floatingVariants.animate.transition,
                delay: 1
              }
            }
          }}
          initial="initial"
          animate="animate"
          className="absolute bottom-40 left-10 w-16 h-16 border border-blue-400/20 rounded-lg rotate-45"
        />

        {/* SVG Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-[-1]">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-[120px]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.86,22,103.68,29.91,158,21,70.3-11.84,136-48.18,207-52.26,86.65-5.29,172.81,31.93,258,40.71,76.4,7.9,148.75-17.83,221.26-35.55C947.77,3.06,1036.07-1.55,1120,6.58c57.83,5.43,113,21.58,160,43.26V0Z"
              fill="#0f172a"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
              <Code className="h-4 w-4 text-emerald-400 mr-2" />
              <span className="text-emerald-300 text-sm font-medium">Trusted by 50,000+ Developers</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl lg:text-8xl font-bold text-white mb-8 leading-tight"
          >
            Where Developers
            <motion.span 
              className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Find Answers
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl lg:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Join millions of developers asking questions, sharing knowledge, and building the future together.
            Get instant help with code problems and accelerate your programming journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            {user ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 group text-lg"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 group text-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/questions"
                    className="inline-flex items-center px-10 py-5 border-2 border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-300 backdrop-blur-sm text-lg"
                  >
                    Browse Questions
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-8 text-slate-400"
          >
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              <span>4.9/5 Developer Rating</span>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-emerald-400 mr-2" />
              <span>Industry Leading Platform</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-800/30 backdrop-blur-sm border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="bg-white/5 backdrop-blur-md p-8 rounded-2xl text-center border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group"
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full mb-6 group-hover:from-emerald-500/30 group-hover:to-blue-500/30 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="h-8 w-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </motion.div>
                <div className="text-4xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">{stat.value}</div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8"
            >
              <Star className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">Premium Features</span>
            </motion.div>
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Why Choose DevQ&A?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to accelerate your development journey and connect with the global coding community.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-10 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all duration-300 group"
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl mb-8 group-hover:from-emerald-500/30 group-hover:to-blue-500/30 transition-all duration-300"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="h-8 w-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </motion.div>
                <h3 className="text-2xl font-semibold text-white mb-6 group-hover:text-emerald-300 transition-colors">{feature.title}</h3>
                <p className="text-slate-300 text-lg leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-purple-600/20" />
        <div className="absolute inset-0 bg-slate-900/40" />
        
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8"
            >
              <Zap className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-purple-300 text-sm font-medium">Join the Community</span>
            </motion.div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Ready to Level Up Your Coding Skills?
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers who are already accelerating their careers with DevQ&A.
              Start asking questions, sharing knowledge, and building connections today.
            </p>
            {!user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 text-xl shadow-2xl shadow-emerald-500/25 group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;