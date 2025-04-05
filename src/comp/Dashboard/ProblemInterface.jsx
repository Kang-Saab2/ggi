import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Function to get cookie value by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// API configuration - can be changed based on environment
const API_CONFIG = {
  // Set to true to use mock responses instead of real API calls (for development)
  USE_MOCK_API: false,
  // Use a relative URL to work with proxy or direct calls
  BASE_URL: '/api'
};

const ProblemInterface = ({ problem: propProblem, onClose }) => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(propProblem || null);
  const [userSolution, setUserSolution] = useState(propProblem?.userSolution || '');
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState('problem'); // 'problem', 'solution'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Update selected problem when prop changes
  useEffect(() => {
    if (propProblem) {
      setSelectedProblem(propProblem);
      setUserSolution(propProblem.userSolution || '');
      setShowSolution(false);
      setActiveTab('problem');
    }
  }, [propProblem]);
  
  // Fetch problems from API only if no problem provided as prop
  useEffect(() => {
    // Only fetch problems if no problem was provided as prop
    if (!propProblem) {
      fetchProblems();
    }
  }, [propProblem]);
  
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
      
      setProblems(response.data.problems);
      
      // Set the first problem as selected by default if problems exist and no problem was provided
      if (!propProblem && response.data.problems && response.data.problems.length > 0) {
        setSelectedProblem(response.data.problems[0]);
        setUserSolution(response.data.problems[0].userSolution || '');
      }
      
      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch problems');
      setIsLoading(false);
      console.error('Error fetching problems:', error);
    }
  };
  
  // Select a problem
  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    setUserSolution(problem.userSolution || '');
    setShowSolution(false);
    setActiveTab('problem');
  };
  
  // Close problem view
  const handleCloseProblem = () => {
    // Use the onClose prop if provided, otherwise just clear selected problem
    if (onClose && typeof onClose === 'function') {
      onClose();
    } else {
      setSelectedProblem(null);
    }
  };
  
  // Toggle solution view
  const handleToggleSolution = () => {
    setShowSolution(!showSolution);

    if (!showSolution) {
      setActiveTab('solution');
    } else {
      setActiveTab('problem');
    }
  };
  
  // Submit solution
  const handleSubmitSolution = async () => {
    if (selectedProblem) {
      try {
        // Get user email from cookies
        const userEmail = getCookie('user_email');
        
        if (!userEmail) {
          setError('User not authenticated. Please log in again.');
          return;
        }
        
        if (!userSolution.trim()) {
          alert('Please provide a solution before submitting.');
          return;
        }

        // Set loading state if needed
        setIsLoading(true);

        // Debugging: Log what we're sending to the API
        console.log('Submitting solution:', {
          email: userEmail,
          problem_id: selectedProblem.id,
          user_solution: userSolution
        });
        
        // Call the real API
        const apiUrl = `/api/toggle-problem-status`;  // Use the proxied URL
        console.log('Calling API at:', apiUrl);
        
        const response = await axios.get(apiUrl, {
          params: {
            email: userEmail,
            problem_id: selectedProblem.id,
            user_solution: userSolution
          }
        });
        
        // Debugging: Log the response
        console.log('API Response:', response.data);
        // Print API output details for debugging
        console.log('%c API RESPONSE DETAILS ', 'background: #222; color: #bada55; font-size: 16px;');
        console.log('Message:', response.data.message);
        console.log('Is Correct:', response.data.is_correct);
        console.log('Feedback:', response.data.feedback);
        console.log('Analysis:', response.data.analysis);
        console.log('Suggestions:', response.data.suggestions);
        console.log('Full Evaluation:', response.data.full_evaluation);
        console.log('Problem:', response.data.problem);
        
        const data = response.data;
        
        // Update the problem with the response data
        const updatedProblem = {
          ...data.problem,
          solved: true // Always mark as solved regardless of API response
        };
        
        // Update the problem in the problems array
        const updatedProblems = problems.map(p => 
          p.id === selectedProblem.id ? updatedProblem : p
        );
        
        setProblems(updatedProblems);
        setSelectedProblem(updatedProblem);
        
        
        // Show a toast notification instead of an alert
        const feedbackMessage = data.feedback || 'Your solution has been accepted.';
        const toastDiv = document.createElement('div');
        toastDiv.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
        toastDiv.style.animation = 'fadeInOut 3s forwards';
        toastDiv.style.maxWidth = '400px';
        toastDiv.style.overflowWrap = 'break-word';
        toastDiv.innerHTML = `
          <div>
            <span>${feedbackMessage}</span>
          </div>
        `;
        document.body.appendChild(toastDiv);
        
        // Add the animation style if it doesn't exist
        if (!document.getElementById('toast-animation-style')) {
          const style = document.createElement('style');
          style.id = 'toast-animation-style';
          style.innerHTML = `
            @keyframes fadeInOut {
              0% { opacity: 0; transform: translateY(-20px); }
              10% { opacity: 1; transform: translateY(0); }
              90% { opacity: 1; transform: translateY(0); }
              100% { opacity: 0; transform: translateY(-20px); }
            }
          `;
          document.head.appendChild(style);
        }
        
        // Remove the toast after animation completes
        setTimeout(() => {
          if (document.body.contains(toastDiv)) {
            document.body.removeChild(toastDiv);
          }
        }, 3000);
        
        // If onClose is provided, call it to refresh the parent component
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      } catch (error) {
        console.error('Error submitting solution:', error);
        
        // Enhanced error logging
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
        }
        
        alert('Failed to submit solution: ' + (error.response?.data?.message || error.message || 'Please try again.'));
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Render loading state
  if (isLoading && !propProblem) {
    return (
      <div className="flex items-center justify-center h-full">
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
  if (error && !propProblem) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-800 max-w-md mx-auto mt-8">
        <h2 className="text-lg font-medium mb-2">Error</h2>
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Render problem list when no problem is selected (only in standalone mode)
  if (!selectedProblem && !propProblem) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Practice Problems</h2>
        
        {problems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-400 text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No problems found</h3>
            <p className="text-gray-600 mb-6">We couldn't find any practice problems for you.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <div 
                key={problem.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-gray-900">{problem.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      problem.difficulty === 'Hard' ? 'bg-red-100 text-red-800' : 
                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  
                  {problem.category && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {problem.category}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      {problem.solved ? (
                        <span className="flex items-center text-green-600 text-sm font-medium">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Solved
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">Not solved yet</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleSelectProblem(problem)}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
                    >
                      Solve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Render selected problem interface
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleCloseProblem}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
        layoutId={propProblem ? `problem-${propProblem.id}` : `problem-${selectedProblem?.id}`}
      >
        <div className="flex justify-between items-center border-b p-4">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-900">{selectedProblem?.title}</h2>
            <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              selectedProblem?.difficulty === 'Hard' ? 'bg-red-100 text-red-800' : 
              selectedProblem?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-green-100 text-green-800'
            }`}>
              {selectedProblem?.difficulty}
            </span>
            {selectedProblem?.category && (
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedProblem?.category}
              </span>
            )}
          </div>
          <button 
            onClick={handleCloseProblem}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(95vh-4rem)] overflow-hidden">
          {/* Left Panel - Problem statement or Solution */}
          <div className="border-r flex flex-col h-full overflow-hidden">
            {/* Tabs for Problem and Solution */}
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('problem')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeTab === 'problem' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Problem Description
                </button>
                {showSolution && (
                  <button
                    onClick={() => setActiveTab('solution')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'solution' 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Solution
                  </button>
                )}
              </div>
            </div>
            
            {/* Problem statement content */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-6 overflow-y-auto flex-1"
              >
                {activeTab === 'problem' ? (
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900">Problem Statement</h3>
                    <p className="text-gray-700">{selectedProblem?.fullDescription || selectedProblem?.description || "Write a function that solves the given problem."}</p>
                    
                    {/* Examples with input/output */}
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-900">Examples</h4>
                      <div className="mt-3 space-y-4">
                        {(selectedProblem?.examplesList || []).map((example, index) => (
                          <div key={example.id || index} className="bg-gray-50 rounded-lg p-4">
                            <div className="mb-2">
                              <span className="font-semibold text-gray-900">Example {index + 1}:</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Input:</div>
                                <div className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                                  {example.input}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Output:</div>
                                <div className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                                  {example.output}
                                </div>
                              </div>
                            </div>
                            {example.explanation && (
                              <div className="mt-2">
                                <div className="text-sm font-medium text-gray-500 mb-1">Explanation:</div>
                                <div className="text-sm text-gray-700">{example.explanation}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {selectedProblem?.constraints && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-900">Constraints</h4>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
                          {selectedProblem.constraints.split('\n').map((constraint, i) => (
                            <li key={i}>{constraint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedProblem?.hints && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Hints
                        </h4>
                        <div className="mt-2 space-y-2">
                          {(selectedProblem.hints || []).map((hint, i) => (
                            <div key={i} className="p-3 bg-yellow-50 border border-yellow-100 rounded-md text-sm text-yellow-800">
                              <span className="font-medium">Hint {i + 1}:</span> {hint}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Solution
                    </h3>
                    
                    {selectedProblem?.solutionApproach && (
                      <div className="mt-4">
                        <h4 className="text-lg font-semibold text-gray-900">Approach</h4>
                        <p className="text-gray-700 mt-2">{selectedProblem.solutionApproach}</p>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-900">Code</h4>
                      <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto mt-2 border border-gray-200 leading-relaxed">
                        {selectedProblem?.solution}
                      </pre>
                    </div>
                    
                    {selectedProblem?.complexityAnalysis && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-900">Complexity Analysis</h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex">
                            <span className="font-medium text-gray-700 w-36">Time Complexity:</span>
                            <span className="text-gray-600">{selectedProblem.timeComplexity}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium text-gray-700 w-36">Space Complexity:</span>
                            <span className="text-gray-600">{selectedProblem.spaceComplexity}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Right Panel - Code editor */}
          <div className="flex flex-col h-full bg-gray-50">
            <div className="p-4 border-b bg-gray-100">
              <h3 className="text-lg font-medium text-gray-900">Your Solution</h3>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="bg-gray-200 text-xs px-4 py-2 rounded-t-md flex items-center">
                  <span className="font-medium">main.js</span>
                  <div className="ml-auto flex space-x-2">
                    <button className="p-1 hover:bg-gray-300 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-300 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <textarea
                  value={userSolution}
                  onChange={(e) => setUserSolution(e.target.value)}
                  className="w-full flex-1 p-4 font-mono text-sm bg-gray-800 text-gray-200 border-0 rounded-b-md focus:ring-0 focus:outline-none"
                  placeholder="// Write your solution here..."
                  spellCheck="false"
                />
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-between bg-white">
              <button
                onClick={handleToggleSolution}
                className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  showSolution 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
              
              <button
                onClick={handleSubmitSolution}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProblemInterface; 