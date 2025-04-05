import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProblemInterface from './ProblemInterface';
import axios from 'axios';

// Function to get cookie value by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const ProblemsContent = () => {
  const [filter, setFilter] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeProblem, setActiveProblem] = useState(null);
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streak, setStreak] = useState(0);
  
  // Fetch problems from API
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get user email from cookies
        const userEmail = getCookie('user_email');
        
        if (!userEmail) {
          setError('User not authenticated. Please log in again.');
          setIsLoading(false);
          return;
        }
        
        // Call the API to get problems
        const response = await axios.get('/api/generate-problems', {
          params: {
            email: userEmail
          }
        });
        
        setProblems(response.data.problems || []);
        setStreak(response.data.streak || 0);
        setIsLoaded(true);
        setIsLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch problems');
        setIsLoading(false);
        console.error('Error fetching problems:', error);
      }
    };
    
    fetchProblems();
  }, []);
  
  // Filter problems based on selection - Using lowercase for comparison
  const filteredProblems = problems.filter(problem => {
    if (filter === 'all') return true;
    if (filter === 'solved') return problem.solved;
    if (filter === 'unsolved') return !problem.solved;
    if (filter === 'easy' || filter === 'medium' || filter === 'hard') {
      return problem.difficulty.toLowerCase() === filter.toLowerCase();
    }
    return true;
  });

  // Group problems by category
  const categories = [...new Set(problems.map(p => p.category || 'Uncategorized'))];
  
  // Calculate stats
  const solvedCount = problems.filter(p => p.solved).length;
  const completionPercentage = problems.length ? Math.round((solvedCount / problems.length) * 100) : 0;
  
  // Handle opening a problem
  const handleOpenProblem = (problem) => {
    setActiveProblem(problem);
  };
  
  // Close problem view
  const handleCloseProblem = () => {
    setActiveProblem(null);
    // Refresh problems after closing to get updated status
    fetchProblemsData();
  };
  
  // Function to refresh problems data
  const fetchProblemsData = async () => {
    try {
      // Get user email from cookies
      const userEmail = getCookie('user_email');
      
      if (!userEmail) {
        return;
      }
      
      // Call the API to get updated problems
      const response = await axios.get('/api/generate-problems', {
        params: {
          email: userEmail
        }
      });
      
      setProblems(response.data.problems || []);
      setStreak(response.data.streak || 0);
    } catch (error) {
      console.error('Error refreshing problems:', error);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-xl font-medium text-gray-700">Loading problems...</h2>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen bg-gray-50">
        <div className="bg-red-50 p-6 rounded-lg text-red-800 max-w-md">
          <h2 className="text-lg font-medium mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with subtle reveal animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm"
      >
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <motion.h1 
            className="text-3xl font-bold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Practice Problems
          </motion.h1>
          <motion.p 
            className="mt-1 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Improve your skills through targeted challenges
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats row with counter animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-lg font-medium text-gray-700 mb-4">Your Progress</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-500"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Total Problems</div>
                  <CountUp value={problems.length} className="text-xl font-semibold text-gray-900" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Solved</div>
                  <CountUp value={solvedCount} className="text-xl font-semibold text-gray-900" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-purple-500"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Completion</div>
                  <div className="relative pt-1">
                    <div className="flex items-center">
                      <CountUp value={completionPercentage} className="text-xl font-semibold text-gray-900" suffix="%" />
                      <div className="ml-3 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercentage}%` }}
                          transition={{ delay: 0.5, duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* <motion.div 
              className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-yellow-500"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Streak</div>
                  <CountUp value={streak} className="text-xl font-semibold text-gray-900" suffix=" days" />
                </div>
              </div>
            </motion.div> */}
          </div>
        </motion.div>

        {/* Filter controls with staggered reveal */}
        <motion.div 
          className="mb-8 bg-white rounded-lg shadow-sm p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-lg font-medium text-gray-700 mb-4">Filter Problems</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All', color: 'blue' },
              { id: 'solved', label: 'Solved', color: 'green' },
              { id: 'unsolved', label: 'Unsolved', color: 'gray' },
              { id: 'easy', label: 'Easy', color: 'green' },
              { id: 'medium', label: 'Medium', color: 'yellow' },
              { id: 'hard', label: 'Hard', color: 'red' }
            ].map((option, index) => (
              <motion.button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`relative overflow-hidden px-4 py-2 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  filter === option.id
                    ? option.color === 'blue' ? 'bg-blue-600 text-white focus:ring-blue-500' :
                      option.color === 'green' ? 'bg-green-600 text-white focus:ring-green-500' :
                      option.color === 'yellow' ? 'bg-yellow-600 text-white focus:ring-yellow-500' :
                      option.color === 'red' ? 'bg-red-600 text-white focus:ring-red-500' :
                      'bg-gray-600 text-white focus:ring-gray-500'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1), duration: 0.4 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {option.label}
                {filter === option.id && (
                  <motion.span
                    className="absolute inset-0 bg-white"
                    initial={{ scale: 0, opacity: 0.3 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Problem listing with staggered animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {categories.map((category, catIndex) => {
              const categoryProblems = filteredProblems.filter(p => (p.category || 'Uncategorized') === category);
              if (categoryProblems.length === 0) return null;
              
              return (
                <motion.div 
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * catIndex, duration: 0.5 }}
                  className="mb-8"
                >
                  <div className="flex items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-700">{category}</h2>
                    <div className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {categoryProblems.length}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {categoryProblems.map((problem, index) => (
                      <motion.div
                        key={problem.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index + 0.2, duration: 0.4 }}
                        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                        layoutId={`problem-${problem.id || index}`}
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center">
                                {problem.solved && (
                                  <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500 }}
                                    className="mr-2 flex items-center justify-center rounded-full bg-green-100 w-6 h-6"
                                  >
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </motion.span>
                                )}
                                <h3 className="text-lg font-medium text-gray-900">{problem.title}</h3>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {problem.description || "Test your problem-solving skills with this challenge"}
                              </p>
                            </div>
                            <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                problem.difficulty === 'Hard' ? 'bg-red-100 text-red-800' : 
                                problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'
                              }`}>
                                {problem.difficulty}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                problem.solved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {problem.solved ? 'Solved' : 'Unsolved'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                                problem.solved 
                                  ? 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200' 
                                  : 'text-white bg-indigo-600 hover:bg-indigo-700'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                              onClick={() => handleOpenProblem(problem)}
                            >
                              {problem.solved ? (
                                <>
                                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Review Solution
                                </>
                              ) : (
                                <>
                                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                  </svg>
                                  Solve Now
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                        <motion.div 
                          className={`h-1 ${
                            problem.difficulty === 'Hard' ? 'bg-red-500' : 
                            problem.difficulty === 'Medium' ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                          style={{ transformOrigin: "left" }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredProblems.length === 0 && (
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No problems found</h3>
            <p className="text-gray-500 mb-4">No problems match your current filter criteria.</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter('all')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear filters
            </motion.button>
          </motion.div>
        )}
      </div>
      
      {/* Use the ProblemInterface component for the active problem */}
      {activeProblem && (
        <ProblemInterface
          problem={activeProblem}
          onClose={handleCloseProblem}
        />
      )}
    </div>
  );
};

// CountUp component for animated number transitions
const CountUp = ({ value, className = "", suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0; // Ensure we have a valid number
    if (start === end) return;
    
    // Get animation duration based on value size
    const duration = Math.min(Math.max(Math.log(end) * 100, 500), 2000);
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      setDisplayValue(Math.floor(start));
      
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      }
    }, 16);
    
    return () => {
      clearInterval(timer);
    };
  }, [value]);

  return <div className={className}>{displayValue}{suffix}</div>;
};

export default ProblemsContent;