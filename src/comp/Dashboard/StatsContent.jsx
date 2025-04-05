import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, FileText, Mic, X, Paperclip, ChevronRight } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Important Note: For production, API keys should be kept on a server, not in frontend code
const API_KEY = "AIzaSyCaeYu0SFqNXySl2haBiOfA58WhgUE_svI";
const MODEL_NAME = "gemini-2.0-flash";

const Chatbot = () => {
  // State variables
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot", timestamp: new Date() },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "user",
      parts: [{ text: "Hello" }],
    },
    {
      role: "model",
      parts: [{ text: "Hello! How can I help you today?" }],
    },
  ]);
  const [chatModel, setChatModel] = useState(null);
  const [chatSession, setChatSession] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  
  // Initialize Gemini AI and chat session
  useEffect(() => {
    const initializeGeminiChat = async () => {
      try {
        // Initialize the Generative AI API
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        // Get the model
        const model = genAI.getGenerativeModel({
          model: MODEL_NAME,
          generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
          }
        });
        
        setChatModel(model);
        
        // Create chat session with initial history
        const chat = model.startChat({
          history: chatHistory,
        });
        
        setChatSession(chat);
        console.log("Chat session initialized");
      } catch (error) {
        console.error("Failed to initialize chat session:", error);
      }
    };
    
    initializeGeminiChat();
  }, []);
  
  // SpeechRecognition setup
  const [recognition, setRecognition] = useState(null);
  
  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript !== '') {
          setInputMessage(prevMessage => prevMessage + finalTranscript);
        } else {
          setTranscript(interimTranscript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      recognitionInstance.onend = () => {
        if (isRecording) {
          recognitionInstance.start();
        }
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle message sending with chat history
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' && !imagePreview && !pdfPreview) return;
    
    const newMessages = [...messages];
    const userMessageText = inputMessage.trim();
    let fileData = null;
    
    // Add user message with text
    if (userMessageText !== '') {
      newMessages.push({
        id: Date.now(),
        text: userMessageText,
        sender: "user",
        timestamp: new Date()
      });
    }
    
    // Add image message if there's an image preview
    if (imagePreview) {
      // Get MIME type from the data URL
      const mimeType = imagePreview.split(';')[0].split(':')[1];
      fileData = {
        type: mimeType,
        data: imagePreview
      };
      
      newMessages.push({
        id: Date.now() + 1,
        image: imagePreview,
        sender: "user",
        timestamp: new Date()
      });
      setImagePreview(null);
    }
    
    // Add PDF message if there's a PDF preview
    if (pdfPreview) {
      fileData = {
        type: 'application/pdf',
        data: pdfPreview.url
      };
      
      newMessages.push({
        id: Date.now() + 2,
        pdf: pdfPreview.url,
        pdfName: pdfPreview.name,
        sender: "user",
        timestamp: new Date()
      });
      setPdfPreview(null);
    }
    
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      if (!chatSession || !chatModel) {
        throw new Error("Chat session not initialized");
      }
      
      // Prepare message parts
      const parts = [];
      
      // Add text part if present
      if (userMessageText) {
        parts.push({ text: userMessageText });
      }
      
      // Add image or PDF file if present
      if (fileData && fileData.type.startsWith('image/')) {
        // For images, create an inline data part
        // Remove the "data:image/jpeg;base64," prefix
        const base64Data = fileData.data.split(',')[1];
        parts.push({
          inlineData: {
            mimeType: fileData.type,
            data: base64Data
          }
        });
      }

      // Send message to chat session
      let result;
      try {
        // Use text parameter for simple text, or parts array for complex content
        if (parts.length === 1 && parts[0].text) {
          result = await chatSession.sendMessage(parts[0].text);
        } else {
          result = await chatSession.sendMessage(parts);
        }
        
        const botResponse = result.response.text();
        
        // Update chat history
        const updatedHistory = [
          ...chatHistory,
          { role: "user", parts: parts.length > 0 ? parts : [{ text: userMessageText || "Image/document shared" }] },
          { role: "model", parts: [{ text: botResponse }] }
        ];
        setChatHistory(updatedHistory);
        
        // Add bot response to messages
        setMessages(prevMessages => [
          ...prevMessages, 
          {
            id: Date.now() + 100,
            text: botResponse,
            formattedText: true, // Flag to indicate this text needs formatting
            sender: "bot",
            timestamp: new Date()
          }
        ]);
      } catch (sessionError) {
        console.error("Session error, recreating chat:", sessionError);
        // If session error, create a new chat session and retry
        if (chatModel) {
          const newChat = chatModel.startChat({
            history: chatHistory,
          });
          
          setChatSession(newChat);
          
          // Retry with new session
          if (parts.length === 1 && parts[0].text) {
            result = await newChat.sendMessage(parts[0].text);
          } else {
            result = await newChat.sendMessage(parts);
          }
          
          const botResponse = result.response.text();
          
          // Update chat history
          const updatedHistory = [
            ...chatHistory,
            { role: "user", parts: parts.length > 0 ? parts : [{ text: userMessageText || "Image/document shared" }] },
            { role: "model", parts: [{ text: botResponse }] }
          ];
          setChatHistory(updatedHistory);
          
          // Add bot response to messages
          setMessages(prevMessages => [
            ...prevMessages, 
            {
              id: Date.now() + 100,
              text: botResponse,
              formattedText: true,
              sender: "bot",
              timestamp: new Date()
            }
          ]);
        } else {
          throw new Error("Chat model not available");
        }
      }
    } catch (error) {
      console.error("Error getting response:", error);
      
      // Add error message
      setMessages(prevMessages => [
        ...prevMessages, 
        {
          id: Date.now() + 100,
          text: fileData 
            ? "I'm having trouble analyzing this file. The file may be too large or in an unsupported format."
            : "Sorry, I encountered an error connecting to the Gemini API. Please try again later.",
          sender: "bot",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Handle recording
  const toggleRecording = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    
    if (!isRecording) {
      // Start recording
      recognition.start();
      setIsRecording(true);
    } else {
      // Stop recording
      recognition.stop();
      setIsRecording(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setIsAttachmentMenuOpen(false);
  };

  // Handle PDF upload
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfPreview({
          url: reader.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
    setIsAttachmentMenuOpen(false);
  };

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    });
  };

  // Learning progress data
  const learningProgress = [
    { subject: "Mathematics", progress: 78 },
    { subject: "Science", progress: 65 },
    { subject: "History", progress: 92 }
  ];
  
  // Achievements data
  const achievements = [
    { title: "Perfect Score", date: "3 days ago", icon: "trophy" },
    { title: "Team Player", date: "1 week ago", icon: "users" }
  ];

  // Format Gemini response for display
  const formatGeminiResponse = (text) => {
    // Return formatted response JSX
    return (
      <div className="gemini-response">
        {text.split('\n').map((line, index) => {
          // Handle numbered lists
          const numberedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
          if (numberedListMatch) {
            return (
              <div key={index} className="flex items-start mb-1">
                <span className="font-medium mr-2">{numberedListMatch[1]}.</span>
                <span>{numberedListMatch[2]}</span>
              </div>
            );
          }
          
          // Handle bullet points
          const bulletMatch = line.match(/^[\*\-•]\s+(.+)$/);
          if (bulletMatch) {
            return (
              <div key={index} className="flex items-start mb-1 ml-1">
                <span className="mr-2">•</span>
                <span>{bulletMatch[1]}</span>
              </div>
            );
          }
          
          // Handle bold text wrapped in ** or __
          let formattedLine = line;
          const boldMatches = [...line.matchAll(/\*\*(.*?)\*\*|__(.*?)__/g)];
          
          if (boldMatches.length > 0) {
            let lastIndex = 0;
            let parts = [];
            
            boldMatches.forEach(match => {
              const matchText = match[1] || match[2];
              const startIndex = match.index;
              
              // Add text before the bold part
              if (startIndex > lastIndex) {
                parts.push(formattedLine.substring(lastIndex, startIndex));
              }
              
              // Add the bold part
              parts.push(<strong key={`bold-${startIndex}`}>{matchText}</strong>);
              
              lastIndex = startIndex + match[0].length;
            });
            
            // Add any remaining text
            if (lastIndex < formattedLine.length) {
              parts.push(formattedLine.substring(lastIndex));
            }
            
            return <div key={index} className="mb-1">{parts}</div>;
          }
          
          // Empty lines become paragraph breaks
          if (line.trim() === '') {
            return <div key={index} className="mb-2"></div>;
          }
          
          // Regular lines
          return <div key={index} className="mb-1">{line}</div>;
        })}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex overflow-hidden">
      {/* Left Panel - Learning Stats */}
      <div className="w-1/4 bg-white shadow-lg p-6 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h1 className="text-indigo-600 text-2xl font-bold mb-1">Learning Statistics</h1>
          <p className="text-gray-600 text-sm">Track your progress across all subjects and activities.</p>
        </div>
        
        {/* Learning Progress Section */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-4 bg-indigo-500 rounded-sm"></div>
            </div>
            <h2 className="font-bold text-lg ml-2">Learning Progress</h2>
          </div>
          
          {learningProgress.map((item, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">{item.subject}</span>
                <span className="text-gray-700 font-medium">{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    item.subject === "Mathematics" ? "bg-indigo-600" :
                    item.subject === "Science" ? "bg-purple-600" : "bg-green-600"
                  }`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Achievements Section */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center mb-4">
            <div className="text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h2 className="font-bold text-lg ml-2">Achievements</h2>
          </div>
          
          {achievements.map((achievement, index) => (
            <div key={index} className={`p-3 rounded-lg mb-3 flex items-center ${
              achievement.icon === "trophy" ? "bg-blue-50" : "bg-purple-50"
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                achievement.icon === "trophy" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
              }`}>
                {achievement.icon === "trophy" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{achievement.title}</h3>
                <p className="text-xs text-gray-500">Earned {achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right Panel - Chatbot */}
      <div className="w-3/4 flex items-center justify-center p-4">
        <div className="flex flex-col h-full max-w-2xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 flex items-center shadow-md">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-lg">
              <span className="text-indigo-600 font-bold text-lg">AI</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Dlearn Ai</h1>
              <div className="flex items-center text-xs text-indigo-200">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
                <span>Online | AI Assistant </span>
              </div>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`max-w-xs md:max-w-md mb-4 ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
              >
                <div 
                  className={`rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-br-none shadow-md' 
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                  }`}
                >
                  {message.formattedText ? (
                    formatGeminiResponse(message.text)
                  ) : (
                    <p>{message.text}</p>
                  )}
                  
                  {message.image && (
                    <div className="mt-2">
                      <img 
                        src={message.image} 
                        alt="Shared content" 
                        className="max-w-full rounded" 
                      />
                    </div>
                  )}
                  
                  {message.pdf && (
                    <div className="mt-2 bg-gray-100 p-2 rounded flex items-center text-gray-700">
                      <FileText size={16} className="mr-2 text-indigo-600" />
                      <span className="text-sm truncate">{message.pdfName}</span>
                    </div>
                  )}
                  
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto max-w-xs md:max-w-md mb-4">
                <div className="bg-white text-gray-800 rounded-lg rounded-bl-none shadow-md p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Voice transcript preview */}
          {isRecording && transcript && (
            <div className="p-2 bg-gray-50 border-t">
              <div className="text-gray-600 text-sm italic flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                Recording: {transcript}
              </div>
            </div>
          )}
          
          {/* Preview Area */}
          {(imagePreview || pdfPreview) && (
            <div className="p-2 bg-gray-50 border-t">
              {imagePreview && (
                <div className="relative inline-block mr-2">
                  <img src={imagePreview} alt="Preview" className="h-16 w-auto rounded border" />
                  <button 
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {pdfPreview && (
                <div className="relative inline-flex items-center bg-gray-100 rounded p-2 border">
                  <FileText size={20} className="text-indigo-600 mr-2" />
                  <span className="text-sm truncate max-w-xs">{pdfPreview.name}</span>
                  <button 
                    onClick={() => setPdfPreview(null)}
                    className="ml-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Input Area */}
          <div className="p-3 bg-white border-t flex items-center">
            <div className="relative">
              <button 
                onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                className="p-2 mr-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Paperclip size={20} />
              </button>
              
              {/* Attachment Menu */}
              {isAttachmentMenuOpen && (
                <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border overflow-hidden z-10">
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center px-4 py-3 hover:bg-gray-100 w-full text-left transition-colors"
                  >
                    <Image size={18} className="mr-2 text-indigo-600" />
                    <span>Share Image</span>
                  </button>
                  <button 
                    onClick={() => pdfInputRef.current.click()}
                    className="flex items-center px-4 py-3 hover:bg-gray-100 w-full text-left transition-colors"
                  >
                    <FileText size={18} className="mr-2 text-indigo-600" />
                    <span>Share PDF</span>
                  </button>
                </div>
              )}
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <input 
                type="file"
                ref={pdfInputRef}
                onChange={handlePdfUpload}
                accept="application/pdf"
                className="hidden"
              />
            </div>
            
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={isLoading}
            />
            
            <button
              onClick={toggleRecording}
              className={`p-2 mx-2 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'}`}
              title={isRecording ? "Stop recording" : "Start voice input"}
              disabled={isLoading}
            >
              <Mic size={20} />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={(inputMessage.trim() === '' && !imagePreview && !pdfPreview) || isLoading}
              className={`p-2 rounded-full transition-colors ${
                (inputMessage.trim() === '' && !imagePreview && !pdfPreview) || isLoading
                  ? 'text-gray-400 bg-gray-100'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          
          {/* Suggestions */}
          <div className="p-3 bg-gray-50 border-t">
            <div className="flex overflow-x-auto pb-2 scrollbar-hide">
              {["What can you help me with?", "Explain a complex topic", "Help me learn coding", "Tell me about AI"].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(suggestion)}
                  className="flex items-center whitespace-nowrap mr-2 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors"
                  disabled={isLoading}
                >
                  {suggestion}
                  <ChevronRight size={14} className="ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;