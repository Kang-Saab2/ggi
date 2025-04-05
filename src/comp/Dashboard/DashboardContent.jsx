import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Award, Play, Brain, Book, Clock } from 'lucide-react';
import { XPChart, StreakGraph, TopicProgress } from './ChartComponents';
import Header from './Header';

const DashboardContent = ({ userData }) => {
  return (
    <>
     {/* <Header userData={userData} /> */}
      {/* Hero section (based on the Dlear design) */}
      <motion.div 
        className="bg-gradient-to-r from-gray-100 to-gray-200 py-12 px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              The best<br />
              University Courses<br />
              for better world
            </motion.h1>
            <motion.p 
              className="text-gray-600 mb-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Thousands of students are already studying in Dlearn!
            </motion.p>
            <motion.button 
              onClick={() => alert('Discover more courses clicked')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 font-medium transition-all"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Discover More Course
            </motion.button>
          </div>
          
          {/* Position decorative elements similar to the design */}
          <motion.div 
            className="absolute top-0 left-12 text-emerald-500 opacity-40"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <path d="M60 0C80 20 100 40 100 60S80 100 60 100 20 80 20 60 40 20 60 0z" fill="currentColor" />
            </svg>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-0 right-0 bg-orange-400 opacity-30 w-32 h-32 rounded-full -mb-16 -mr-16"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          ></motion.div>
        </div>
      </motion.div>
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Daily Challenge */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl p-4 mb-6 shadow-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Daily Challenge</h2>
              <p className="text-emerald-100">Keep the streak going! Current streak: {userData.streak} 🔥</p>
              
              {/* Streak visualization */}
              <StreakGraph />
            </div>
            <motion.button 
              onClick={() => alert('Daily challenge clicked!')}
              className="bg-white text-emerald-600 font-medium py-2 px-4 rounded-lg hover:bg-emerald-50 transition-colors shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {userData.dailyCompleted ? 'Completed ✓' : 'Attempt Now'}
            </motion.button>
          </div>
        </motion.div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* XP & Rank */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Award className="text-indigo-500" size={24} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">XP & Rank</h3>
            <p className="text-center text-gray-600">XP: {userData.xp} | Rank: #{userData.rank}</p>
          </motion.div>
          
          {/* Quiz Attempts */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Play className="text-purple-500" size={24} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Quiz Attempts</h3>
            <p className="text-center text-gray-600">
              Completed: {userData.quizAttempts.completed} | Pending: {userData.quizAttempts.pending}
            </p>
          </motion.div>
          
          {/* Progress */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Calendar className="text-emerald-500" size={24} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <motion.div 
                className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full h-4" 
                style={{ width: `${userData.progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${userData.progress}%` }}
                transition={{ duration: 1 }}
              ></motion.div>
            </div>
            <p className="text-center text-gray-600">{userData.progress}% Complete</p>
          </motion.div>
        </div>
        
        {/* Today's Agenda */}
        <motion.div 
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 shadow-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-amber-800">Today's Agenda</h2>
              <p className="text-amber-600">Auto-generated tasks based on your progress.</p>
            </div>
            <motion.button 
              onClick={() => alert('View tasks clicked!')}
              className="bg-white text-amber-600 border border-amber-400 font-medium py-2 px-4 rounded-lg hover:bg-amber-50 transition-colors shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Tasks
            </motion.button>
          </div>
          
          <div className="mt-4 space-y-2">
            <motion.div 
              className="bg-white p-3 rounded-lg flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ x: 5 }}
            >
              <div className="p-2 bg-purple-100 rounded-full mr-3">
                <Brain size={16} className="text-purple-600" />
              </div>
              <span className="flex-grow">Complete Algebra practice set</span>
              <span className="text-sm text-gray-500">30 min</span>
            </motion.div>
            
            <motion.div 
              className="bg-white p-3 rounded-lg flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ x: 5 }}
            >
              <div className="p-2 bg-indigo-100 rounded-full mr-3">
                <Play size={16} className="text-indigo-600" />
              </div>
              <span className="flex-grow">Take Geometry quiz</span>
              <span className="text-sm text-gray-500">15 min</span>
            </motion.div>
            
            <motion.div 
              className="bg-white p-3 rounded-lg flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ x: 5 }}
            >
              <div className="p-2 bg-emerald-100 rounded-full mr-3">
                <Book size={16} className="text-emerald-600" />
              </div>
              <span className="flex-grow">Review Calculus notes</span>
              <span className="text-sm text-gray-500">20 min</span>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Popular Courses Section (From Dlear design) */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6">Popular Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userData.popularCourses.map((course, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl overflow-hidden shadow-sm transition-all"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + (index * 0.1) }}
                whileHover={{ y: -10, scale: 1.02, shadow: "lg" }}
              >
                <div className="relative">
                  <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                  {/* <div className="absolute top-4 right-4 bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                    {course.price}
                  </div> */}
                </div>
                <div className="p-4">
                  <div className="text-pink-500 text-sm mb-2">{course.category}</div>
                  <h3 className="font-bold text-lg mb-4">{course.title}</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-indigo-500 mr-1">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span className="text-sm text-gray-600">{course.students}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-1">{course.rating}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-amber-500">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" strokeWidth="0" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* <div className="mt-6 flex justify-center">
            <motion.button 
              onClick={() => alert('View all courses clicked!')}
              className="border border-indigo-500 text-indigo-500 px-6 py-2 rounded-full hover:bg-indigo-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Courses
            </motion.button>
          </div> */}
        </motion.div>
        
        {/* Continue Learning */}
        <motion.div 
          className="bg-purple-500 rounded-xl p-4 mb-6 shadow-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Continue Learning</h2>
              <p className="text-purple-100">Resume your last watched topic or quiz.</p>
            </div>
            <motion.button 
              onClick={() => alert('Resume learning clicked!')}
              className="bg-white text-purple-600 font-medium py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resume
            </motion.button>
          </div>
          
          <motion.div 
            className="mt-4 bg-purple-600 bg-opacity-50 p-3 rounded-lg"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center">
              <div className="p-2 bg-white rounded-full mr-3">
                <Play size={16} className="text-purple-600" />
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-medium">Advanced Calculus: Derivatives</h4>
                <div className="w-full bg-purple-700 rounded-full h-1 mt-2">
                  <motion.div 
                    className="bg-white rounded-full h-1" 
                    style={{ width: '65%' }}
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1, delay: 1.2 }}
                  ></motion.div>
                </div>
                <p className="text-purple-200 text-xs mt-1">65% complete • 12 minutes left</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Two column layout for bottom sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* XP Growth Chart */}
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <h2 className="text-xl font-bold mb-2">Growth Chart</h2>
            <p className="text-gray-500 text-sm mb-4">Your learning progress over the past week</p>
            <XPChart learningHistory={userData.learningHistory} />
          </motion.div>
          
          {/* Topic Progress */}
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <h2 className="text-xl font-bold mb-2">Topic Progress</h2>
            <p className="text-gray-500 text-sm mb-4">Your progress across different subjects</p>
            <TopicProgress topicProgress={userData.topicProgress} />
          </motion.div>
        </div>
        
        {/* Upcoming Quizzes */}
        <motion.div 
          className="mt-6 bg-white rounded-xl p-6 shadow-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upcoming Quizzes</h2>
            <motion.button 
              onClick={() => alert('View all quizzes clicked!')}
              className="text-indigo-500 hover:text-indigo-700 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All
            </motion.button>
          </div>
          
          <div className="space-y-3">
            {userData.upcomingQuizzes.map((quiz, index) => (
              <motion.div 
                key={index} 
                className="border border-gray-200 p-3 rounded-lg flex justify-between items-center hover:border-indigo-300 transition-colors"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.6 + (index * 0.1) }}
                whileHover={{ x: 5 }}
              >
                <div>
                  <h4 className="font-medium">{quiz.title}</h4>
                  <p className="text-sm text-gray-500">Date: {new Date(quiz.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    quiz.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 
                    quiz.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {quiz.difficulty}
                  </span>
                  <motion.button 
                    onClick={() => alert(`Prepare for ${quiz.title}`)}
                    className="ml-3 text-indigo-500 hover:text-indigo-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Recent Achievements */}
        <motion.div 
          className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 shadow-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.7 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Achievements</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {userData.recentAchievements.map((achievement, index) => (
              <motion.div 
                key={index} 
                className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.8 + (index * 0.1) }}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h4 className="font-medium text-black">{achievement.title}</h4>
                <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Friend Activity */}
        {/* <motion.div 
          className="mt-6 bg-white rounded-xl p-6 shadow-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.9 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Friend Activity</h2>
            <motion.button 
              onClick={() => alert('View all friends clicked!')}
              className="text-indigo-500 hover:text-indigo-700 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All
            </motion.button>
          </div>
          
          <div className="space-y-3">
            {userData.friendActivity.map((friend, index) => (
              <motion.div 
                key={index} 
                className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 2.0 + (index * 0.1) }}
                whileHover={{ x: 5 }}
              >
                <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full mr-3" />
                <div className="flex-grow">
                  <p>
                    <span className="font-medium">{friend.name}</span>
                    <span className="text-gray-600"> {friend.action}</span>
                  </p>
                  <p className="text-xs text-gray-500">{friend.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </>
  );
};

export default DashboardContent; 