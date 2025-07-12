import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code, 
  Users, 
  MessageSquare, 
  Award, 
  ArrowRight, 
  CheckCircle,
  Zap,
  BookOpen,
  Star,
  TrendingUp
} from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Ask & Answer',
      description: 'Get help from the community and share your knowledge with others.',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Collaborative Learning',
      description: 'Learn together with developers and students from around the world.',
      color: 'text-green-600'
    },
    {
      icon: Award,
      title: 'Earn Recognition',
      description: 'Build your reputation with XP, streaks, and achievement badges.',
      color: 'text-yellow-600'
    },
    {
      icon: Code,
      title: 'Code-Focused',
      description: 'Designed specifically for programming questions and technical discussions.',
      color: 'text-purple-600'
    }
  ];

  const benefits = [
    'Get answers from experienced developers',
    'Build your programming knowledge',
    'Earn XP and unlock achievements',
    'Connect with like-minded learners',
    'Access a growing knowledge base',
    'Participate in real-time discussions'
  ];

  const stats = [
    { value: '50K+', label: 'Questions Answered' },
    { value: '15K+', label: 'Active Users' },
    { value: '95%', label: 'Success Rate' },
    { value: '24/7', label: 'Community Support' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">StackIt</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section 
          className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-20 sm:py-32"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1 
                className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Learn. Share.{' '}
                <motion.span 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Grow.
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Join thousands of developers and students in a collaborative learning platform 
                where knowledge flows freely and everyone grows together.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="group inline-flex items-center px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
                  >
                    <Zap className="mr-2 group-hover:text-yellow-400 transition-colors" size={20} />
                    Start Learning
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button className="group inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold text-lg">
                    <BookOpen className="mr-2 group-hover:text-blue-600 transition-colors" size={20} />
                    Learn More
                  </button>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  >
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="py-20 bg-gray-50"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Why Choose StackIt?
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Built by developers, for developers. Experience the future of collaborative learning.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <feature.icon className={`${feature.color} mb-4`} size={32} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section 
          className="py-20 bg-white"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Everything you need to accelerate your learning
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Join a community that values knowledge sharing, continuous learning, and mutual growth.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Star className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Earn XP & Level Up</h3>
                        <p className="text-gray-600 text-sm">Track your progress and achievements</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Build Your Reputation</h3>
                        <p className="text-gray-600 text-sm">Get recognized for your contributions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <Users className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Connect & Collaborate</h3>
                        <p className="text-gray-600 text-sm">Network with fellow developers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-20 bg-gradient-to-br from-gray-900 to-black"
          variants={itemVariants}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Ready to start your learning journey?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of developers who are already growing their skills on StackIt.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                <Zap className="mr-2" size={20} />
                Get Started Free
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">StackIt</span>
              </div>
              <p className="text-gray-400">
                Empowering developers and students through collaborative learning.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Ask Questions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Browse Topics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chat Rooms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Achievements</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Code of Conduct</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Moderators</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StackIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;