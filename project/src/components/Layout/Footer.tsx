import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HelpCircle, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 shadow-inner z-40"
    >
      {/* Background Visuals for Consistency with Header */}
      <div className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1920')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-indigo-600/10" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-2 left-10 w-2 h-2 bg-blue-400/20 rounded-full animate-pulse" />
        <div className="absolute top-4 right-20 w-1 h-1 bg-purple-400/30 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-2 left-1/3 w-1.5 h-1.5 bg-indigo-400/20 rounded-full animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/20">
                <HelpCircle className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                DevQ&A
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              The ultimate platform for developers to ask questions, share knowledge, and build amazing things together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/questions" className="text-slate-400 hover:text-white transition-colors">Questions</Link></li>
              <li><Link to="/tags" className="text-slate-400 hover:text-white transition-colors">Tags</Link></li>
              <li><Link to="/leaderboard" className="text-slate-400 hover:text-white transition-colors">Leaderboard</Link></li>
              <li><Link to="/codemated" className="text-slate-400 hover:text-white transition-colors">CodeMated</Link></li>
              <li><Link to="/users" className="text-slate-400 hover:text-white transition-colors">Users</Link></li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/help" className="text-slate-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/guidelines" className="text-slate-400 hover:text-white transition-colors">Guidelines</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <motion.a whileHover={{ scale: 1.1 }} href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </motion.a>
              <motion.a whileHover={{ scale: 1.1 }} href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </motion.a>
              <motion.a whileHover={{ scale: 1.1 }} href="#" className="text-slate-400 hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">© 2025 DevQ&A. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0 text-sm">
            <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
