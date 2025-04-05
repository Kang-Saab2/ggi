import React from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart2, User, Award, Users, Settings, LogOut, Play, Book, Brain, Trophy, ChevronLeft, ChevronRight, ExternalLink, Globe, MessageCircle, FileText } from 'lucide-react';
import dlearnLogo from '../../assets/dlearn-logo.png';

const Sidebar = ({ userData, activeSection, setActiveSection, isCollapsed, handleLogout, setIframeUrl }) => {
  const handleIframeNavigation = (url) => {
    setIframeUrl(url);
    setActiveSection('iframe');
  };

  return (
    <motion.div 
      className={`h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`p-4 flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
        {!isCollapsed && <img src={dlearnLogo} alt="Dlearn Logo" className="h-8" />}
        {isCollapsed && <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">D</div>}
      </div>
      
      {!isCollapsed && (
        <div className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3">
              {userData.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-medium">{userData.name}</h2>
              <p className="text-xs text-gray-500">Student</p>
            </div>
          </div>
        </div>
      )}
      
      {isCollapsed && (
        <div className="p-2 flex justify-center">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
            {userData.name.charAt(0)}
          </div>
        </div>
      )}
      
      <nav className={`px-4 mt-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`flex items-center w-full p-3 rounded-lg ${activeSection === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Home size={18} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Dashboard</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('stats')}
              className={`flex items-center w-full p-3 rounded-lg ${activeSection === 'stats' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <MessageCircle size={18} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Ask a Doubt</span>}
            </button>
          </li>
          {/* <li>
            <button
              onClick={() => setActiveSection('profile')}
              className={`flex items-center w-full p-3 rounded-lg ${activeSection === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <User size={18} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Profile</span>}
            </button>
          </li> */}
          <li>
            <button
              onClick={() => setActiveSection('subjects')}
              className={`flex items-center w-full p-3 rounded-lg ${activeSection === 'subjects' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Book size={18} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Subjects</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('quizzes')}
              className={`flex items-center w-full p-3 rounded-lg ${activeSection === 'quizzes' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Trophy size={18} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Quizzes</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => window.open('http://localhost:5174/', '_blank')}
              className={`flex items-center w-full p-3 rounded-lg ${activeSection === 'battles' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Award size={18} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Quiz Battles</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => window.open('http://localhost:5175/interview/', '_blank')}
              className={`flex items-center w-full p-3 rounded-lg ${activeSection === 'battles' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Play size={18} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Ai Interview</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('problems')}
              className={`flex items-center w-full p-3 rounded-lg ${activeSection === 'problems' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Brain size={18} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Problems</span>}
            </button>
          </li>
          
          {/* New iframe option */}
          <li>
            <button
              onClick={() => handleIframeNavigation('http://localhost:5175/dashboard')}
              className={`flex items-center w-full p-3 rounded-lg ${activeSection === 'iframe' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'} ${isCollapsed ? 'justify-center' : ''}`}
            >
              <FileText size={18} className={isCollapsed ? '' : 'mr-3'} />
              {!isCollapsed && <span>Resume & Job</span>}
            </button>
          </li>
          
        </ul>
      </nav>
      
      <div className={`absolute bottom-4 ${isCollapsed ? 'left-0 right-0 flex justify-center' : 'left-4 w-56'}`}>
        <button
          onClick={() => {
            if (handleLogout && typeof handleLogout === 'function') {
              handleLogout();
            } else {
              document.cookie = 'user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            }
          }}
          className={`flex items-center p-3 rounded-lg hover:bg-gray-50 text-red-500 ${isCollapsed ? 'justify-center w-10 h-10' : 'w-full'}`}
        >
          <LogOut size={18} className={isCollapsed ? '' : 'mr-3'} />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar; 