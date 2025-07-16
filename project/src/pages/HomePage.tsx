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
  HelpCircle,
  Brain,
  Trophy,
  Rocket
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
      icon: HelpCircle,
      title: 'Ask Questions',
      description: 'Get help with your coding challenges from experienced developers in the community.'
    },
    {
      icon: Brain,
      title: 'Share Knowledge',
      description: 'Help others by sharing your expertise and contributing to the developer community.'
    },
    {
      icon: Trophy,
      title: 'Earn Reputation',
      description: 'Build your developer reputation through quality questions, answers, and contributions.'
    },
    {
      icon: Rocket,
      title: 'Learn & Grow',
      description: 'Accelerate your learning journey with real-world solutions and expert insights.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Full Stack Developer',
      company: 'TechCorp',
      content: 'DevQ&A helped me solve complex React issues that I couldn\'t find answers to anywhere else. The community is incredibly helpful!',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Marcus Johnson',
      role: 'Backend Engineer',
      company: 'StartupXYZ',
      content: 'I\'ve learned more from answering questions here than from any tutorial. It\'s amazing how teaching others improves your own skills.',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Elena Rodriguez',
      role: 'DevOps Engineer',
      company: 'CloudTech',
      content: 'The quality of answers and the speed of responses on DevQ&A is unmatched. It\'s become my go-to resource for technical problems.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
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
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden  ">
      {/* Hero Section */}
      <section 
        className="relative py-24 lg:py-40 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1920')"
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-slate-900/85 z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/60 to-purple-900/40 z-0" />

        {/* Animated Particles */}
        <HeroParticles />

        {/* Animated Background Elements */}
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
                delay: 1
              }
            }
          }}
          initial="initial"
          animate="animate"
          className="absolute bottom-40 left-10 w-16 h-16 border border-purple-400/20 rounded-lg rotate-45 z-10"
        />


        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
              <Code className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">Trusted by 50,000+ Developers</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl lg:text-8xl font-bold text-white mb-8 leading-tight"
          >
            WHERE DEVELOPERS
            <motion.span 
              className="block bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              FIND ANSWERS
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl lg:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Join the world's largest developer community. Ask questions, share knowledge, 
            and accelerate your coding journey with expert help from experienced developers.
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
                  className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 group text-lg"
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
                    className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 group text-lg"
                  >
                    Ask a Question
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
              <Award className="h-5 w-5 text-blue-400 mr-2" />
              <span>Industry Leading Platform</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: "url('')"
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/20 to-indigo-600/30 z-0" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 z-10">
          <HeroParticles />
        </div>

        {/* Floating Elements */}
        <motion.div 
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          className="absolute top-20 left-10 w-12 h-12 border border-blue-400/20 rounded-full z-10"
        />
        <motion.div 
          variants={{
            ...floatingVariants,
            animate: {
              ...floatingVariants.animate,
              transition: {
                ...floatingVariants.animate.transition,
                delay: 2
              }
            }
          }}
          initial="initial"
          animate="animate"
          className="absolute bottom-20 right-10 w-16 h-16 border border-purple-400/20 rounded-lg rotate-45 z-10"
        />


        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-20">
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
                className="bg-white/5 backdrop-blur-md p-8 rounded-2xl text-center border border-white/10 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mb-6 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </motion.div>
                <div className="text-4xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">{stat.value}</div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="relative py-28 overflow-hidden"
        style={{
          backgroundImage: "url('')"
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-slate-900/35 z-0" />
        <div className="absolute inset-0 bg-gradient-to-bl from-purple-600/25 via-blue-600/30 to-indigo-600/25 z-0" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 z-10">
          <HeroParticles />
        </div>

        {/* Floating Elements */}
        <motion.div 
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          className="absolute top-32 right-20 w-24 h-24 border border-purple-400/20 rounded-full z-10"
        />
        <motion.div 
          variants={{
            ...floatingVariants,
            animate: {
              ...floatingVariants.animate,
              transition: {
                ...floatingVariants.animate.transition,
                delay: 1.5
              }
            }
          }}
          initial="initial"
          animate="animate"
          className="absolute bottom-32 left-20 w-20 h-20 border border-blue-400/20 rounded-lg rotate-45 z-10"
        />


        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-20">
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
              className="inline-flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8"
            >
              <Star className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-purple-300 text-sm font-medium">Community Features</span>
            </motion.div>
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              How DevQ&A Works
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to get help, share knowledge, and grow as a developer in one powerful platform.
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
                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-10 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300 group"
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-8 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </motion.div>
                <h3 className="text-2xl font-semibold text-white mb-6 group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                <p className="text-slate-300 text-lg leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        className="relative py-28 overflow-hidden"
        style={{
          backgroundImage: "url()"
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-slate-900/45 z-0" />
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-blue-600/35 z-0" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 z-10">
          <HeroParticles />
        </div>

        {/* Floating Elements */}
        <motion.div 
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          className="absolute top-40 left-16 w-18 h-18 border border-indigo-400/20 rounded-full z-10"
        />
        <motion.div 
          variants={{
            ...floatingVariants,
            animate: {
              ...floatingVariants.animate,
              transition: {
                ...floatingVariants.animate.transition,
                delay: 0.5
              }
            }
          }}
          initial="initial"
          animate="animate"
          className="absolute bottom-40 right-16 w-14 h-14 border border-purple-400/20 rounded-lg rotate-45 z-10"
        />


        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-20">
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
              className="inline-flex items-center px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8"
            >
              <Users className="h-4 w-4 text-indigo-400 mr-2" />
              <span className="text-indigo-300 text-sm font-medium">Developer Stories</span>
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Loved by Developers Worldwide
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              See how DevQ&A is helping developers solve problems, learn new skills, and advance their careers.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/50 hover:bg-slate-800/60 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-slate-400 text-sm">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative py-28 overflow-hidden"
        style={{
          backgroundImage: "url('')"
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-slate-900/50 z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-purple-600/10 to-indigo-600/10 z-0" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 z-10">
          <HeroParticles />
        </div>

        {/* Floating Elements */}
        <motion.div 
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          className="absolute top-24 left-24 w-20 h-20 border border-blue-400/30 rounded-full z-10"
        />
        <motion.div 
          variants={{
            ...floatingVariants,
            animate: {
              ...floatingVariants.animate,
              transition: {
                ...floatingVariants.animate.transition,
                delay: 2.5
              }
            }
          }}
          initial="initial"
          animate="animate"
          className="absolute bottom-24 right-24 w-16 h-16 border border-purple-400/30 rounded-lg rotate-45 z-10"
        />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center z-20">
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
              className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8"
            >
              <Zap className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">Join the Community</span>
            </motion.div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Ready to Get Your Questions Answered?
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers who are already getting help, sharing knowledge, 
              and building their careers with DevQ&A. Your next breakthrough is just a question away.
            </p>
            {!user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 text-xl shadow-2xl shadow-blue-500/25 group"
                >
                  Start Asking Questions
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