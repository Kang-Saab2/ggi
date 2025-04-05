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

// Separate NewRoadmapModal into its own component outside the main component
// to prevent re-rendering when parent state changes
const NewRoadmapModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isGenerating, 
  generationError, 
  generationSuccess 
}) => {
  const [languageInput, setLanguageInput] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setLanguageInput('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit(languageInput);
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create New Roadmap</h2>
            <button 
              onClick={onClose}
              className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label htmlFor="language" className="block text-gray-700 font-medium mb-2">
              Programming Language
            </label>
            <input
              type="text"
              id="language"
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              placeholder="e.g. JavaScript, Python, React"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isGenerating || generationSuccess}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the programming language or technology you want to learn
            </p>
          </div>
          
          {generationError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {generationError}
            </div>
          )}
          
          {generationSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-600 text-sm">
              Roadmap successfully generated! Refreshing...
            </div>
          )}
        </div>
        
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 mr-3"
            disabled={isGenerating || generationSuccess}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isGenerating || generationSuccess || !languageInput.trim()}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-lg ${
              isGenerating || generationSuccess || !languageInput.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : generationSuccess ? (
              "Generated!"
            ) : (
              "Create Roadmap"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SubjectsContent = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showNewRoadmapModal, setShowNewRoadmapModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [generationSuccess, setGenerationSuccess] = useState(false);
  
  // State for user roadmaps
  const [programmingSubjects, setProgrammingSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  
  // Video learning modal state
  const [videoData, setVideoData] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [currentModuleInfo, setCurrentModuleInfo] = useState(null);
  
  // Fetch user roadmaps from API
  const fetchUserRoadmaps = async () => {
    try {
      setIsLoading(true);
      setLoadError('');
      
      // Get user email from cookies
      const userEmail = getCookie('user_email');
      
      if (!userEmail) {
        setLoadError('User not authenticated. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      // Call the API to get user roadmaps
      const response = await axios.get('/api/user-roadmaps', {
        params: {
          email: userEmail
        }
      });
      
      setProgrammingSubjects(response.data);
      setIsLoading(false);
    } catch (error) {
      setLoadError(error.response?.data?.message || 'Failed to load roadmaps');
      setIsLoading(false);
      console.error('Error loading roadmaps:', error);
    }
  };
  
  // Fetch roadmaps when component mounts
  useEffect(() => {
    fetchUserRoadmaps();
  }, []);
  
  // Handle modal open/close
  const handleOpenModal = () => setShowNewRoadmapModal(true);
  const handleCloseModal = () => {
    if (!isGenerating) {
      setShowNewRoadmapModal(false);
      setGenerationError('');
      setGenerationSuccess(false);
    }
  };
  
  // Generate new roadmap
  const generateRoadmap = async (languageValue) => {
    try {
      setIsGenerating(true);
      setGenerationError('');
      setGenerationSuccess(false);
      
      // Get user email from cookies
      const userEmail = getCookie('user_email');
      
      if (!userEmail) {
        setGenerationError('User not authenticated. Please log in again.');
        setIsGenerating(false);
        return;
      }
      
      if (!languageValue.trim()) {
        setGenerationError('Please enter a programming language');
        setIsGenerating(false);
        return;
      }
      
      // Call the API to generate roadmap
      const response = await axios.get('/api/generate-roadmap', {
        params: {
          email: userEmail,
          language: languageValue.trim()
        }
      });
      
      setGenerationSuccess(true);
      setIsGenerating(false);
      
      // Close modal after success and reset form
      setTimeout(() => {
        setShowNewRoadmapModal(false);
        setGenerationSuccess(false);
        
        // Fetch updated roadmaps
        fetchUserRoadmaps();
      }, 2000);
      
    } catch (error) {
      setGenerationError(error.response?.data?.message || 'Failed to generate roadmap');
      setIsGenerating(false);
      console.error('Error generating roadmap:', error);
    }
  };

  const closeRoadmap = () => {
    setSelectedSubject(null);
  };
  
  // Handle starting a learning module by fetching video content
  const handleStartLearning = async (subject, section, module) => {
    try {
      // Open modal first and show loading state
      setIsVideoModalOpen(true);
      setIsVideoLoading(true);
      setVideoError('');
      setVideoData(null);
      
      // Store the current module info for later use (marking as complete)
      setCurrentModuleInfo({
        subjectId: subject.id,
        sectionIndex: subject.roadmap.indexOf(section),
        moduleIndex: section.modules.indexOf(module),
        subjectName: subject.name,
        sectionTitle: section.title,
        moduleName: module.name
      });
      
      // Prepare the query parameters
      const params = {
        course_title: subject.name,
        module_title: section.title,
        subtopic: module.name
      };
      
      // Call the API to find learning videos
      const response = await axios.get('/api/find-learning-video', { params });
      
      // Set the video data and loading state
      setVideoData(response.data);
      setIsVideoLoading(false);
      
      console.log('Learning content fetched:', response.data);
    } catch (error) {
      setVideoError(error.response?.data?.message || 'Failed to fetch learning content');
      setIsVideoLoading(false);
      console.error('Error fetching learning content:', error);
    }
  };
  
  // Handle reviewing a completed module
  const handleReviewModule = (subject, section, module) => {
    // Reuse the same function for reviewing
    handleStartLearning(subject, section, module);
  };
  
  // Handle marking a module as complete
  const handleMarkAsComplete = async () => {
    if (currentModuleInfo && videoData) {
      try {
        // Get user email from cookies
        const userEmail = getCookie('user_email');
        
        if (!userEmail) {
          alert('User not authenticated. Please log in again.');
          return;
        }
        
        // Set up the data to send to the API
        const completionData = {
          email: userEmail,
          roadmapId: currentModuleInfo.subjectId,
          sectionIndex: currentModuleInfo.sectionIndex,
          moduleIndex: currentModuleInfo.moduleIndex,
          course: currentModuleInfo.subjectName,
          module: currentModuleInfo.sectionTitle,
          lesson: currentModuleInfo.moduleName
        };
        
        // Show loading indicator (could add a state for this if needed)
        console.log('Updating progress...');
        
        // Call the API to update roadmap progress
        const response = await axios.post('/api/update-roadmap-progress', completionData);
        
        console.log('Progress updated:', response.data);
        
        // Close the video modal
        closeVideoModal();
        
        // Refresh the roadmaps to show updated completion status
        fetchUserRoadmaps();
        
      } catch (error) {
        console.error('Error updating progress:', error);
        alert(error.response?.data?.message || 'Failed to update progress');
      }
    }
  };
  
  // Close video modal
  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setVideoData(null);
    setVideoError('');
    setCurrentModuleInfo(null);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Learning Video Modal Component
  const LearningVideoModal = () => {
    if (!isVideoModalOpen) return null;
    
    // Function to format text content with paragraphs, headers, lists, etc.
    const formatTextContent = (text) => {
      if (!text) return null;
      
      // Split text into paragraphs
      const paragraphs = text.split('\n\n');
      
      return (
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => {
            // Check if paragraph is a header (starts with # or ##)
            if (paragraph.startsWith('# ')) {
              return (
                <h3 key={index} className="text-xl font-bold mt-6 mb-3">
                  {paragraph.substring(2)}
                </h3>
              );
            } else if (paragraph.startsWith('## ')) {
              return (
                <h4 key={index} className="text-lg font-semibold mt-5 mb-2">
                  {paragraph.substring(3)}
                </h4>
              );
            } else if (paragraph.startsWith('- ')) {
              // Handle bullet lists
              const items = paragraph.split('\n- ');
              return (
                <ul key={index} className="list-disc pl-5 space-y-2">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            } else if (paragraph.startsWith('1. ')) {
              // Handle numbered lists
              const items = paragraph.split('\n');
              return (
                <ol key={index} className="list-decimal pl-5 space-y-2">
                  {items.map((item, i) => {
                    const content = item.replace(/^\d+\.\s/, '');
                    return content ? <li key={i}>{content}</li> : null;
                  })}
                </ol>
              );
            } else if (paragraph.startsWith('```')) {
              // Handle code blocks
              const code = paragraph.replace(/```[\w]*\n/, '').replace(/```$/, '');
              return (
                <pre key={index} className="bg-gray-50 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                  {code}
                </pre>
              );
            } else if (paragraph.includes('**')) {
              // Handle paragraphs with bold text
              return (
                <p key={index} className="text-gray-800">
                  {paragraph.split('**').map((part, i) => 
                    i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                  )}
                </p>
              );
            } else {
              // Regular paragraph
              return (
                <p key={index} className="text-gray-800">
                  {paragraph}
                </p>
              );
            }
          })}
        </div>
      );
    };
    
    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div 
          className="bg-white rounded-2xl w-full max-w-4xl max-h-screen overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {isVideoLoading ? 'Loading Content...' : 'Learning Resources'}
              </h2>
              <button 
                onClick={closeVideoModal}
                className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-6 flex-grow overflow-y-auto">
            {isVideoLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="animate-spin h-16 w-16 text-indigo-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg text-gray-600 mb-2">Loading learning resources...</p>
                <p className="text-sm text-gray-500">This may take a moment as we prepare the best content for you.</p>
              </div>
            )}
            
            {videoError && !isVideoLoading && (
              <div className="bg-red-50 text-red-600 p-6 rounded-lg mb-4">
                <p className="font-medium text-lg mb-2">Error Loading Content</p>
                <p>{videoError}</p>
                <button 
                  onClick={closeVideoModal}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            )}
            
            {videoData && !isVideoLoading && !videoError && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {videoData.subtopic} - {videoData.module_title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {videoData.course_title} - Learning Resource
                  </p>
                </div>
                
                {/* Explanation content */}
                {videoData.explanation && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 prose prose-indigo max-w-none">
                    {formatTextContent(videoData.explanation)}
                  </div>
                )}
                
                {/* Additional information about the learning path */}
                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <h4 className="font-medium mb-2">Learning Path</h4>
                  <p><span className="text-gray-600">Course:</span> {videoData.course_title}</p>
                  <p><span className="text-gray-600">Module:</span> {videoData.module_title}</p>
                  <p><span className="text-gray-600">Topic:</span> {videoData.subtopic}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t bg-gray-50 flex justify-end">
            <button 
              onClick={closeVideoModal}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 mr-3"
            >
              {isVideoLoading ? 'Cancel' : 'Close'}
            </button>
            {videoData && !isVideoLoading && !videoError && (
              <button 
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                onClick={handleMarkAsComplete}
              >
                Mark as Completed
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Render roadmap modal with improved UI
  const RoadmapModal = ({ subject }) => {
    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          // Prevent the click from bubbling up and closing the modal
          e.stopPropagation();
        }}
      >
        <motion.div 
          className="bg-white rounded-2xl w-full max-w-4xl max-h-screen overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-gradient-to-r p-6" style={{ backgroundImage: `linear-gradient(to right, ${subject.color}22, ${subject.color}44)` }}>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mr-5 shadow-md" style={{ backgroundColor: subject.color }}>
                  {subject.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{subject.name}</h2>
                  <p className="text-gray-600 mt-1">{subject.description}</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  closeRoadmap();
                }}
                className="rounded-full w-10 h-10 flex items-center justify-center bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <h3 className="text-xl font-bold">Your Learning Journey</h3>
              <div className="flex items-center">
                <div className="h-2 w-32 bg-gray-200 rounded-full mr-3">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                  ></div>
                </div>
                <span className="font-medium">{subject.progress}% Complete</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto p-6 flex-grow">
            <div className="space-y-12">
              {subject.roadmap.map((section, idx) => (
                <div key={idx} className="relative">
                  <div className="flex items-start mb-6">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0 mr-4 shadow-md"
                      style={{ backgroundColor: subject.color }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{section.title}</h4>
                      <p className="text-gray-600 mt-1">{section.description}</p>
                    </div>
                  </div>
                  
                  <div className="ml-6 pl-10 border-l-2 border-dashed" style={{ borderColor: `${subject.color}88` }}>
                    {section.modules.map((module, midx) => (
                      <motion.div 
                        key={midx} 
                        className="mb-6 relative"
                        initial={{ x: -10, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: midx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div 
                          className="absolute -left-16 w-6 h-6 rounded-full border-4"
                          style={{ 
                            backgroundColor: module.completed ? subject.color : 'white',
                            borderColor: module.completed ? subject.color : `${subject.color}50`
                          }}
                        >
                          {module.completed && (
                            <div className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</div>
                          )}
                        </div>
                        
                        <div 
                          className={`bg-white rounded-xl p-5 shadow-sm border-l-4 hover:shadow-md transition-shadow`}
                          style={{ borderColor: module.completed ? subject.color : 'transparent' }}
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-lg">{module.name}</h5>
                            <span 
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                module.completed 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {module.completed ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-2">{module.description}</p>
                          {module.completed ? (
                            <button 
                              className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReviewModule(subject, section, module);
                              }}
                            >
                              Review Again
                            </button>
                          ) : (
                            <button 
                              className="mt-3 px-4 py-2 text-white rounded-lg text-sm"
                              style={{ backgroundColor: subject.color }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartLearning(subject, section, module);
                              }}
                            >
                              Start Learning
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 border-t flex justify-end bg-gray-50">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeRoadmap();
              }}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 mr-3"
            >
              Close
            </button>
            <button 
              className="px-6 py-3 text-white rounded-lg"
              style={{ backgroundColor: subject.color }}
              onClick={(e) => {
                e.stopPropagation();
                const nextIncompleteModule = findNextIncompleteModule(subject);
                if (nextIncompleteModule) {
                  handleStartLearning(
                    subject, 
                    nextIncompleteModule.section, 
                    nextIncompleteModule.module
                  );
                } else {
                  alert(`All modules in ${subject.name} are completed!`);
                }
              }}
            >
              Continue Learning
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  // Helper function to find the next incomplete module
  const findNextIncompleteModule = (subject) => {
    for (const section of subject.roadmap) {
      for (const module of section.modules) {
        if (!module.completed) {
          return { section, module };
        }
      }
    }
    return null; // All modules completed
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-xl font-medium text-gray-700">Loading your learning path...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to load roadmaps</h2>
          <p className="text-gray-600 mb-6">{loadError}</p>
          <button 
            onClick={fetchUserRoadmaps}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Your Learning Path</h2>
            <p className="text-gray-600 mt-2">Track your programming journey with these subjects</p>
          </div>
          <div>
            <button 
              onClick={handleOpenModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              New Roadmap
            </button>
          </div>
        </div>
        
        {programmingSubjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-400 text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No roadmaps found</h3>
            <p className="text-gray-600 mb-6">You haven't created any learning roadmaps yet.</p>
            <button 
              onClick={handleOpenModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Your First Roadmap
            </button>
          </div>
        ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {programmingSubjects.map((subject) => (
            <motion.div 
              key={subject.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4" style={{ backgroundColor: subject.color }}>
                    {subject.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{subject.name}</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{subject.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Progress</span>
                    <span>{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {subject.completed}/{subject.lessons} lessons completed
                  </p>
                </div>
                
                <div className="flex justify-between">
                    <button 
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextIncompleteModule = findNextIncompleteModule(subject);
                        if (nextIncompleteModule) {
                          handleStartLearning(
                            subject, 
                            nextIncompleteModule.section, 
                            nextIncompleteModule.module
                          );
                        } else {
                          alert(`All modules in ${subject.name} are completed!`);
                        }
                      }}
                    >
                    Continue Learning
                  </button>
                  <button 
                    onClick={() => setSelectedSubject(subject)}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
                  >
                    View Roadmap
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}
      </div>
      
      {/* Modals */}
      <AnimatePresence>
      {selectedSubject && <RoadmapModal subject={selectedSubject} />}
      </AnimatePresence>
      
      {/* Learning Video Modal */}
      <AnimatePresence>
        <LearningVideoModal />
      </AnimatePresence>
      
      {/* New Roadmap Modal */}
      <NewRoadmapModal
        isOpen={showNewRoadmapModal}
        onClose={handleCloseModal}
        onSubmit={generateRoadmap}
        isGenerating={isGenerating}
        generationError={generationError}
        generationSuccess={generationSuccess}
      />
    </div>
  );
};

export default SubjectsContent;