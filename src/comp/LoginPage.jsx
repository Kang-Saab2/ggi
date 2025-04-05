import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Function to set a cookie
const setCookie = (name, value, days) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + value + expires + '; path=/';
};

// Remove the baseURL setting since we're using Vite's proxy
// const API_BASE_URL = 'http://127.0.0.1:5000';
// axios.defaults.baseURL = API_BASE_URL;

const AuthPage = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [techInterest, setTechInterest] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Sample image placeholders for the carousel
  const carouselImages = [
   "https://images.unsplash.com/photo-1584697964328-b1e7f63dca95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   "https://images.unsplash.com/photo-1565598621680-94ac0c22b148?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   "https://backtheme.com/products/html/dlear/assets/images/course/1.jpg"
  ];

  // Auto rotate carousel images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login request using GET with URL parameters
        const response = await axios.get(`/api/login`, {
          params: {
            email,
            password
          }
        });
        
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
          email: response.data.email,
          name: response.data.name,
          interest: response.data.interest
        }));
        
        // Save email in a cookie that expires in 7 days
        setCookie('user_email', response.data.email, 7);
        
        // Update authentication state
        setIsLoggedIn(true);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        // Signup request using GET with URL parameters
        const response = await axios.get(`/api/signup`, {
          params: {
            name,
            email,
            password,
            interest: techInterest
          }
        });
        
        // Show success and switch to login form
        alert('Signup successful! Please login with your credentials.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during authentication. Please try again. ' + 
                (err.message ? `(${err.message})` : ''));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center mb-8">
            <div className="text-blue-600 text-3xl font-bold mr-2">dlearn.</div>
            <div className="h-8 w-8">
              <svg viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>

          <motion.h2 
            key={isLogin ? 'login-title' : 'signup-title'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-gray-800 mb-6"
          >
            {isLogin ? 'Welcome Back' : 'Join Our Community'}
          </motion.h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-200"
            >
              {error}
            </motion.div>
          )}

          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </motion.div>
            )}

            <div>
              <label className="block text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-gray-700 mb-1">Tech Interest for Guidance</label>
                <input
                  type="text"
                  value={techInterest}
                  onChange={(e) => setTechInterest(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. Web Development, AI, Data Science"
                  required={!isLogin}
                />
              </motion.div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600'} text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                isLogin ? 'Login' : 'Sign Up'
              )}
            </motion.button>
          </motion.form>

          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={toggleForm}
                className="text-blue-600 font-medium hover:underline"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right side - Image/Illustration */}
      <div className="hidden md:block md:w-1/2 bg-blue-50">
        <motion.div 
          className="h-full w-full flex flex-col justify-center items-center p-12"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="max-w-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-3xl font-bold text-gray-800 mb-4">Unlock Your Learning Potential</div>
            <p className="text-gray-600 mb-8">Join thousands of students already studying at Dlear University for all ages!</p>
            
            {/* Image Carousel */}
            <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8 shadow-lg">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={carouselImages[currentImageIndex]}
                  alt={`Educational content ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
              
              {/* Carousel indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {carouselImages.map((_, i) => (
                  <motion.button
                    key={i}
                    className={`h-2 rounded-full ${i === currentImageIndex ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'}`}
                    onClick={() => setCurrentImageIndex(i)}
                    whileHover={{ scale: 1.2 }}
                    animate={{ 
                      backgroundColor: i === currentImageIndex ? "#2563EB" : "#D1D5DB",
                      width: i === currentImageIndex ? 32 : 8
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>

            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
              whileHover={{ y: -5, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="p-6">
                <div className="text-sm text-blue-600 font-medium mb-2">Programming &amp; Technology</div>
                <div className="text-lg font-bold text-gray-800 mb-4">Master Modern Web Development</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-gray-600">4.9</span>
                  </div>
                  <div className="text-blue-600 font-bold">$29</div>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <motion.div 
                className="h-2 w-2 rounded-full bg-blue-600"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div 
                className="h-2 w-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
              />
              <motion.div 
                className="h-2 w-2 rounded-full bg-yellow-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;