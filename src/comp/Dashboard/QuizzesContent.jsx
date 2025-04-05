import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Clock, Award, CheckCircle, AlertTriangle, BookOpen, Code, Database, Server, Monitor, Cpu, Layers, Layout } from 'lucide-react';
import axios from 'axios';

// Function to get cookie value by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const QuizzesContent = () => {
  // Available quiz categories with icons and details - Only programming languages
  const availableQuizzes = [
    {
      id: 1,
      title: "JavaScript",
      icon: <Code className="text-yellow-500" size={20} />,
      questions: 5,
      difficulty: "Medium",
      timeLimit: 360, // seconds
      description: "Test your knowledge of JavaScript fundamentals, ES6 features, and common patterns.",
      completionRate: 72,
      background: "from-yellow-400 to-yellow-600"
    },
    {
      id: 2,
      title: "Python",
      icon: <Code className="text-blue-600" size={20} />,
      questions: 5,
      difficulty: "Medium",
      timeLimit: 400, // seconds
      description: "Explore Python syntax, libraries, and best practices for coding.",
      completionRate: 77,
      background: "from-blue-400 to-blue-600"
    },
    {
      id: 3,
      title: "Java",
      icon: <Code className="text-orange-600" size={20} />,
      questions: 5,
      difficulty: "Hard",
      timeLimit: 350, // seconds
      description: "Challenge yourself with Java programming concepts and OOP principles.",
      completionRate: 65,
      background: "from-orange-500 to-orange-700"
    },
    {
      id: 4,
      title: "SQL",
      icon: <Database className="text-green-600" size={20} />,
      questions: 5,
      difficulty: "Medium",
      timeLimit: 240, // seconds
      description: "Test your database query skills and SQL knowledge.",
      completionRate: 81,
      background: "from-green-500 to-green-700"
    },
    {
      id: 5,
      title: "HTML/CSS",
      icon: <Monitor className="text-pink-500" size={20} />,
      questions: 5,
      difficulty: "Easy",
      timeLimit: 300, // seconds
      description: "Evaluate your web development frontend skills and knowledge.",
      completionRate: 85,
      background: "from-pink-400 to-pink-600"
    },
    {
      id: 6,
      title: "Node.js",
      icon: <Server className="text-green-500" size={20} />,
      questions: 5,
      difficulty: "Hard",
      timeLimit: 360, // seconds
      description: "Test your server-side JavaScript knowledge with Node.js concepts.",
      completionRate: 68,
      background: "from-green-600 to-teal-600"
    },
    // New programming language quizzes
    {
      id: 7,
      title: "C++",
      icon: <Cpu className="text-blue-500" size={20} />,
      questions: 5,
      difficulty: "Hard",
      timeLimit: 350, // seconds
      description: "Test your knowledge of C++ programming, memory management, and OOP concepts.",
      completionRate: 60,
      background: "from-blue-600 to-indigo-700"
    },
    {
      id: 8,
      title: "TypeScript",
      icon: <Code className="text-blue-400" size={20} />,
      questions: 5,
      difficulty: "Medium",
      timeLimit: 360, // seconds
      description: "Evaluate your understanding of TypeScript's type system and advanced features.",
      completionRate: 74,
      background: "from-blue-400 to-blue-500"
    },
    {
      id: 9,
      title: "React",
      icon: <Layers className="text-cyan-500" size={20} />,
      questions: 5,
      difficulty: "Medium",
      timeLimit: 400, // seconds
      description: "Test your React knowledge including hooks, components, and state management.",
      completionRate: 76,
      background: "from-cyan-400 to-cyan-600"
    }
  ];

  // Quiz data organized by programming language
  const allQuizData = {
    // JavaScript questions
    "JavaScript": [
    {
      id: 1,
        question: "Which of the following is not a JavaScript data type?",
        options: ["Number", "String", "Boolean", "Float"],
        correctAnswer: "Float",
        category: "JavaScript"
    },
    {
      id: 2,
        question: "What does the 'typeof' operator return for an array in JavaScript?",
        options: ["array", "object", "Array", "list"],
        correctAnswer: "object",
        category: "JavaScript"
    },
    {
      id: 3,
        question: "Which method is used to add an element to the end of an array in JavaScript?",
        options: ["push()", "append()", "addToEnd()", "insert()"],
        correctAnswer: "push()",
        category: "JavaScript"
    },
    {
      id: 4,
        question: "What is the correct way to create a function in JavaScript?",
        options: ["function = myFunction()", "function myFunction()", "function:myFunction()", "create function myFunction()"],
        correctAnswer: "function myFunction()",
        category: "JavaScript"
    },
    {
      id: 5,
        question: "Which operator is used for strict equality comparison in JavaScript?",
        options: ["==", "===", "=", "equals()"],
        correctAnswer: "===",
        category: "JavaScript"
      }
    ],
    
    // Python questions
    "Python": [
      {
        id: 1,
        question: "Which Python library is commonly used for data manipulation and analysis?",
        options: ["NumPy", "Requests", "Pandas", "Django"],
        correctAnswer: "Pandas",
        category: "Python"
      },
      {
        id: 2,
        question: "Which of the following is not a valid way to create a list in Python?",
        options: ["[]", "list()", "array()", "list([])"],
        correctAnswer: "array()",
        category: "Python"
      },
      {
        id: 3,
        question: "What is the correct way to comment a single line in Python?",
        options: ["// comment", "/* comment */", "# comment", "<!-- comment -->"],
        correctAnswer: "# comment",
        category: "Python"
      },
      {
        id: 4,
        question: "What does the 'pip' command do in Python?",
        options: ["Installs packages", "Prints output", "Creates projects", "Imports modules"],
        correctAnswer: "Installs packages",
        category: "Python"
      },
      {
        id: 5,
        question: "Which of the following is used for string formatting in Python 3?",
        options: [".format()", "printf()", "sprintf()", "str()"],
        correctAnswer: ".format()",
        category: "Python"
      }
    ],
    
    // Java questions
    "Java": [
      {
        id: 1,
        question: "In Java, which keyword is used to inherit a class?",
        options: ["implements", "extends", "inherits", "using"],
        correctAnswer: "extends",
        category: "Java"
      },
      {
        id: 2,
        question: "What is the entry point method for a Java application?",
        options: ["start()", "run()", "main()", "execute()"],
        correctAnswer: "main()",
        category: "Java"
      },
      {
        id: 3,
        question: "Which of the following is not a Java access modifier?",
        options: ["public", "private", "protected", "friend"],
        correctAnswer: "friend",
        category: "Java"
      },
      {
        id: 4,
        question: "What does JVM stand for?",
        options: ["Java Virtual Machine", "Java Visual Machine", "Java Variable Method", "Java Verified Module"],
        correctAnswer: "Java Virtual Machine",
        category: "Java"
      },
      {
        id: 5,
        question: "Which collection class allows duplicate elements in Java?",
        options: ["HashSet", "TreeSet", "ArrayList", "HashMap"],
        correctAnswer: "ArrayList",
        category: "Java"
      }
    ],
    
    // SQL questions
    "SQL": [
      {
        id: 1,
        question: "Which SQL command is used to retrieve data from a database?",
        options: ["GET", "OPEN", "FETCH", "SELECT"],
        correctAnswer: "SELECT",
        category: "SQL"
      },
      {
        id: 2,
        question: "Which SQL clause is used to filter records?",
        options: ["FROM", "WHERE", "HAVING", "GROUP BY"],
        correctAnswer: "WHERE",
        category: "SQL"
      },
      {
        id: 3,
        question: "What is the purpose of the JOIN clause in SQL?",
        options: ["To create a new table", "To combine rows from two or more tables", "To add columns to a table", "To delete data from tables"],
        correctAnswer: "To combine rows from two or more tables",
        category: "SQL"
      },
      {
        id: 4,
        question: "Which SQL keyword is used to sort the result set?",
        options: ["SORT BY", "ORDER BY", "ARRANGE BY", "GROUP BY"],
        correctAnswer: "ORDER BY",
        category: "SQL"
      },
      {
        id: 5,
        question: "Which SQL function is used to count the number of rows in a result set?",
        options: ["COUNT()", "SUM()", "NUM()", "TOTAL()"],
        correctAnswer: "COUNT()",
        category: "SQL"
      }
    ],
    
    // HTML/CSS questions
    "HTML/CSS": [
      {
        id: 1,
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctAnswer: "<a>",
        category: "HTML/CSS"
      },
      {
        id: 2,
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Sheets"],
        correctAnswer: "Cascading Style Sheets",
        category: "HTML/CSS"
      },
      {
        id: 3,
        question: "Which CSS property is used to change the text color?",
        options: ["text-color", "font-color", "color", "text-style"],
        correctAnswer: "color",
        category: "HTML/CSS"
      },
      {
        id: 4,
        question: "Which HTML tag is used for creating a table?",
        options: ["<table>", "<tab>", "<tbl>", "<grid>"],
        correctAnswer: "<table>",
        category: "HTML/CSS"
      },
      {
        id: 5,
        question: "What is the correct CSS syntax for making all paragraph elements bold?",
        options: ["p {text-size: bold;}", "p {font-weight: bold;}", "p.all {font: bold;}", "<p style='font-bold'>"],
        correctAnswer: "p {font-weight: bold;}",
        category: "HTML/CSS"
      }
    ],
    
    // Node.js questions
    "Node.js": [
      {
        id: 1,
        question: "Which of the following is not a core module in Node.js?",
        options: ["fs", "http", "path", "jquery"],
        correctAnswer: "jquery",
        category: "Node.js"
      },
      {
        id: 2,
        question: "What does the 'npm' stand for in Node.js?",
        options: ["Node Package Manager", "New Package Manager", "Node Process Manager", "Node Project Manager"],
        correctAnswer: "Node Package Manager",
        category: "Node.js"
      },
      {
        id: 3,
        question: "Which function is used to include modules in a Node.js application?",
        options: ["import", "require", "include", "attach"],
        correctAnswer: "require",
        category: "Node.js"
      },
      {
        id: 4,
        question: "What is the default package manager for Node.js?",
        options: ["yarn", "npm", "pnpm", "bower"],
        correctAnswer: "npm",
        category: "Node.js"
      },
      {
        id: 5,
        question: "Which method is used to start a Node.js server listening on a specified port?",
        options: ["server.start()", "server.begin()", "server.listen()", "server.activate()"],
        correctAnswer: "server.listen()",
        category: "Node.js"
      }
    ],
    
    // C++ questions
    "C++": [
      {
        id: 1,
        question: "Which of the following is not a feature of C++?",
        options: ["Object-Oriented Programming", "Automatic Garbage Collection", "Multiple Inheritance", "Operator Overloading"],
        correctAnswer: "Automatic Garbage Collection",
        category: "C++"
      },
      {
        id: 2,
        question: "What is the correct way to create a pointer in C++?",
        options: ["int ptr = &x;", "int *ptr = &x;", "ptr int = &x;", "int &ptr = x;"],
        correctAnswer: "int *ptr = &x;",
        category: "C++"
      },
      {
        id: 3,
        question: "Which C++ keyword is used to allocate memory for a single object?",
        options: ["malloc", "alloc", "new", "create"],
        correctAnswer: "new",
        category: "C++"
      },
      {
        id: 4,
        question: "What is the purpose of the 'virtual' keyword in C++?",
        options: ["Create virtual machines", "Enable function overriding in derived classes", "Make variables volatile", "Define abstract classes"],
        correctAnswer: "Enable function overriding in derived classes",
        category: "C++"
      },
      {
        id: 5,
        question: "Which C++ concept allows a class to have multiple parents?",
        options: ["Multiple Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
        correctAnswer: "Multiple Inheritance",
        category: "C++"
      }
    ],
    
    // TypeScript questions
    "TypeScript": [
      {
        id: 1,
        question: "Which of the following is not a basic type in TypeScript?",
        options: ["number", "string", "boolean", "character"],
        correctAnswer: "character",
        category: "TypeScript"
      },
      {
        id: 2,
        question: "What symbol is used to define an interface in TypeScript?",
        options: ["class", "interface", "type", "struct"],
        correctAnswer: "interface",
        category: "TypeScript"
      },
      {
        id: 3,
        question: "What is the syntax for defining an optional property in a TypeScript interface?",
        options: ["property?", "property: optional", "?property", "optional property"],
        correctAnswer: "property?",
        category: "TypeScript"
      },
      {
        id: 4,
        question: "What TypeScript feature allows you to define a type as a set of possible values?",
        options: ["Interfaces", "Classes", "Union Types", "Generics"],
        correctAnswer: "Union Types",
        category: "TypeScript"
      },
      {
        id: 5,
        question: "What is the purpose of the 'as' keyword in TypeScript?",
        options: ["Type Assertion", "Type Declaration", "Type Conversion", "Type Inheritance"],
        correctAnswer: "Type Assertion",
        category: "TypeScript"
      }
    ],
    
    // React questions
    "React": [
      {
        id: 1,
        question: "What function is used to update state in functional components?",
        options: ["this.state()", "useState()", "this.setState()", "changeState()"],
        correctAnswer: "useState()",
        category: "React"
      },
      {
        id: 2,
        question: "Which hook is used for side effects in React?",
        options: ["useEffect", "useSideEffect", "useChange", "useImpact"],
        correctAnswer: "useEffect",
        category: "React"
      },
      {
        id: 3,
        question: "What does JSX stand for?",
        options: ["JavaScript XML", "JavaScript Extension", "JavaScript Syntax", "Java XML"],
        correctAnswer: "JavaScript XML",
        category: "React"
      },
      {
        id: 4,
        question: "Which of the following is a React lifecycle method?",
        options: ["onRender()", "componentWillUpdate()", "onMount()", "renderComponent()"],
        correctAnswer: "componentWillUpdate()",
        category: "React"
      },
      {
        id: 5,
        question: "What is the correct way to render a list of items in React?",
        options: [
          "items.forEach(item => <div>{item}</div>)",
          "for(let i=0; i<items.length; i++) { <div>{items[i]}</div> }",
          "items.map(item => <div key={item.id}>{item}</div>)",
          "<for item in items><div>{item}</div></for>"
        ],
        correctAnswer: "items.map(item => <div key={item.id}>{item}</div>)",
        category: "React"
      }
    ]
  };

  // State variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null); // 'correct', 'incorrect', or null
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [quizSaved, setQuizSaved] = useState(false);
  const [savingError, setSavingError] = useState('');
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Current question
  const currentQuestion = quizData[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (!quizStarted || quizCompleted || answerStatus) return;
    
    const timer = timeLeft > 0 && setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    if (timeLeft === 0) {
      handleNextQuestion();
    }

    return () => clearInterval(timer);
  }, [timeLeft, quizStarted, quizCompleted, answerStatus]);

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (answerStatus || !quizStarted || quizCompleted) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correctAnswer;
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Automatically move to next question after 1.5 seconds
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  // Save quiz results to backend
  const saveQuizResults = async () => {
    try {
      // Get user email from cookies
      const userEmail = getCookie('user_email');
      
      if (!userEmail || !activeQuiz) {
        setSavingError('User not authenticated or quiz information missing');
        return;
      }
      
      // Call the API to save the quiz result
      const response = await axios.get('/api/save-quiz', {
        params: {
          email: userEmail,
          quiz_title: activeQuiz.title,
          score: `${score}/${quizData.length}`
        }
      });
      
      setQuizSaved(true);
      setSavingError('');
      console.log('Quiz saved successfully');
    } catch (error) {
      setSavingError(error.response?.data?.message || 'Failed to save quiz results');
      console.error('Error saving quiz:', error);
    }
  };

  // Handle moving to next question
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setTimeLeft(30);
    
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
      // Save quiz results when quiz is completed
      saveQuizResults();
    }
  };

  // Start the quiz
  const startQuiz = (quizId = null) => {
    if (quizId) {
      const quiz = availableQuizzes.find(q => q.id === quizId);
      setActiveQuiz(quiz);
      setSelectedQuiz(null);
      setShowQuizDetails(false);
      
      // Set quiz questions based on selected quiz
      if (quiz && allQuizData[quiz.title]) {
        setQuizData(allQuizData[quiz.title]);
      }
    }
    
    setQuizStarted(true);
    setTimeLeft(30);
    setScore(0);
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setAnswerStatus(null);
  };

  // Restart the quiz
  const restartQuiz = () => {
    startQuiz();
  };

  // Back to quiz selection
  const backToQuizzes = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setActiveQuiz(null);
  };

  // Open quiz details
  const openQuizDetails = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizDetails(true);
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get icon for quiz based on title
  const getQuizIcon = (quizTitle) => {
    const iconMap = {
      'JavaScript': <Code className="text-yellow-500" size={16} />,
      'Python': <Code className="text-blue-600" size={16} />,
      'Java': <Code className="text-orange-600" size={16} />,
      'SQL': <Database className="text-green-600" size={16} />,
      'HTML/CSS': <Monitor className="text-pink-500" size={16} />,
      'Node.js': <Server className="text-green-500" size={16} />,
      'C++': <Cpu className="text-blue-500" size={16} />,
      'TypeScript': <Code className="text-blue-400" size={16} />,
      'React': <Layers className="text-cyan-500" size={16} />
    };
    
    return iconMap[quizTitle] || <Code className="text-gray-500" size={16} />;
  };
  
  // Get background color based on quiz title
  const getQuizBgColor = (quizTitle) => {
    const bgMap = {
      'JavaScript': 'bg-yellow-100',
      'Python': 'bg-blue-100',
      'Java': 'bg-orange-100',
      'SQL': 'bg-green-100',
      'HTML/CSS': 'bg-pink-100',
      'Node.js': 'bg-emerald-100',
      'C++': 'bg-indigo-100',
      'TypeScript': 'bg-blue-100',
      'React': 'bg-cyan-100'
    };
    
    return bgMap[quizTitle] || 'bg-gray-100';
  };

  // Fetch user's quiz history
  const fetchQuizHistory = async () => {
    try {
      setIsLoadingQuizzes(true);
      setLoadError('');
      
      // Get user email from cookies
      const userEmail = getCookie('user_email');
      
      if (!userEmail) {
        setLoadError('User not authenticated');
        setIsLoadingQuizzes(false);
        return;
      }
      
      // Call the API to get quiz history
      const response = await axios.get('/api/get-quizzes', {
        params: {
          email: userEmail
        }
      });
      
      setRecentQuizzes(response.data);
      setIsLoadingQuizzes(false);
    } catch (error) {
      setLoadError(error.response?.data?.message || 'Failed to load quiz history');
      setIsLoadingQuizzes(false);
      console.error('Error loading quiz history:', error);
    }
  };
  
  // Fetch quiz history when component mounts
  useEffect(() => {
    fetchQuizHistory();
  }, []);

  // Update quiz history after completing a new quiz
  useEffect(() => {
    if (quizSaved) {
      fetchQuizHistory();
    }
  }, [quizSaved]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-indigo-700">Programming Quiz Center</h2>
        <p className="text-gray-600 mb-8">Test your programming skills with quizzes across various languages and frameworks.</p>
        
        {!quizStarted ? (
          <>
            {showQuizDetails && selectedQuiz ? (
              <motion.div 
                className="bg-white rounded-xl p-8 shadow-md mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <button 
                    onClick={() => setShowQuizDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ← Back to quizzes
                  </button>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedQuiz.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 
                    selectedQuiz.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                    'bg-green-100 text-green-700'
                  }`}>
                    {selectedQuiz.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${selectedQuiz.background} mr-4`}>
                    {selectedQuiz.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{selectedQuiz.title} Quiz</h3>
                </div>
                
                <p className="text-gray-600 mb-6">{selectedQuiz.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                    <Book className="text-indigo-500 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Questions</p>
                      <p className="font-medium">{selectedQuiz.questions}</p>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                    <Clock className="text-indigo-500 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Time Limit</p>
                      <p className="font-medium">{formatTime(selectedQuiz.timeLimit)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                    <Award className="text-indigo-500 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Completion Rate</p>
                      <p className="font-medium">{selectedQuiz.completionRate}%</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => startQuiz(selectedQuiz.id)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                >
                  Start Quiz
                </button>
              </motion.div>
            ) : (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BookOpen className="mr-2 text-indigo-600" size={20} />
                  Available Programming Quizzes
                </h3>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {availableQuizzes.map((quiz, index) => (
                    <motion.div 
                      key={index} 
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      whileHover={{ y: -5 }}
                    >
                      <div className={`h-2 bg-gradient-to-r ${quiz.background}`}></div>
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-gray-100 mr-3">
                              {quiz.icon}
                            </div>
                            <h4 className="font-semibold text-lg">{quiz.title} Quiz</h4>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            quiz.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 
                            quiz.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {quiz.difficulty}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-500 mb-4">
                          <div className="flex items-center mb-1">
                            <Book size={14} className="mr-1" />
                            <span>{quiz.questions} questions</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{formatTime(quiz.timeLimit)}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <Award size={14} className="mr-1" />
                            <span>{quiz.completionRate}% completion rate</span>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => openQuizDetails(quiz)}
                              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              Details
                            </button>
                            <button 
                              onClick={() => startQuiz(quiz.id)}
                              className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
                            >
                              Start
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Recent Quizzes - Loaded from API */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle className="mr-2 text-emerald-600" size={20} />
                Recently Completed
              </h3>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="space-y-4">
                  {isLoadingQuizzes ? (
                    <div className="flex justify-center items-center py-8">
                      <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      </div>
                  ) : loadError ? (
                    <div className="text-center py-6 text-red-500">
                      {loadError}
                      </div>
                  ) : recentQuizzes.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      No quiz history found. Complete a quiz to see your results here.
                    </div>
                  ) : (
                    recentQuizzes.slice(0, 3).map((quiz, index, arr) => (
                      <div key={quiz.id || index} className={`flex items-center justify-between py-3 ${index < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center">
                          <div className={`p-2 rounded-full ${getQuizBgColor(quiz.title)} mr-3`}>
                            {getQuizIcon(quiz.title)}
                      </div>
                      <div>
                            <h4 className="font-medium">{quiz.title} Quiz</h4>
                            <p className="text-xs text-gray-500">
                              {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : 'Recently completed'}
                            </p>
                      </div>
                    </div>
                    <div className="text-right">
                          <div className="font-semibold text-lg">{quiz.score}</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        ) : quizCompleted ? (
          <motion.div 
            className="bg-white rounded-xl p-8 shadow-md text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              {activeQuiz && (
                <div className="flex justify-center items-center mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${activeQuiz.background} mr-3`}>
                    {activeQuiz.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{activeQuiz.title} Quiz</h3>
                </div>
              )}
              <h3 className="text-2xl font-semibold">Quiz Completed!</h3>
            </div>
            
            <div className="relative mb-8">
              <svg className="w-40 h-40 mx-auto" viewBox="0 0 100 100">
                <circle 
                  className="text-gray-200" 
                  strokeWidth="8" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                />
                <circle 
                  className="text-indigo-600" 
                  strokeWidth="8" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / quizData.length)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl font-bold text-indigo-600">{score}/{quizData.length}</div>
              </div>
            </div>
            
            <div className="mb-8 text-center">
              <p className="text-gray-600 mb-2">
                {score === quizData.length 
                  ? "Perfect score! You're a coding expert!" 
                  : score >= quizData.length / 2 
                    ? "Good job! Keep practicing to improve your coding skills." 
                    : "Keep learning and try again to master this programming language!"}
              </p>
              
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 mb-2">
                <Clock className="mr-1" size={16} />
                Time taken: 3:24
              </div>
              
              {/* Display quiz saving status */}
              {savingError ? (
                <div className="mt-3 text-red-500 text-sm">
                  {savingError} - Your progress could not be saved.
                </div>
              ) : quizSaved ? (
                <div className="mt-3 text-green-500 text-sm">
                  Your quiz results have been saved!
                </div>
              ) : (
                <div className="mt-3 text-indigo-500 text-sm flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving your results...
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-4">
              <button 
                onClick={backToQuizzes}
                className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                Back to Quizzes
              </button>
              <button 
                onClick={restartQuiz}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="bg-white rounded-xl p-8 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Quiz Info */}
            {activeQuiz && (
              <div className="flex items-center mb-6">
                <div className={`p-3 rounded-full bg-gradient-to-r ${activeQuiz.background} mr-3`}>
                  {activeQuiz.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{activeQuiz.title} Quiz</h3>
                  <p className="text-sm text-gray-500">
                    {activeQuiz.difficulty} • {activeQuiz.questions} questions
                  </p>
                </div>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Question {currentQuestionIndex + 1}/{quizData.length}</span>
                <span className={timeLeft <= 10 ? "text-red-500 font-medium" : ""}>
                  {timeLeft} seconds left
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Timer Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
              <div 
                className={`h-1.5 rounded-full ${timeLeft <= 10 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${(timeLeft / 30) * 100}%`, transition: 'width 1s linear' }}
              ></div>
            </div>
            
            {/* Category Tag */}
            {currentQuestion && (
              <>
            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mb-4">
              {currentQuestion.category}
            </span>
            
            {/* Question */}
            <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
            
            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    selectedAnswer === option
                      ? option === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-red-100 border-2 border-red-500'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={answerStatus !== null}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 * index }}
                  whileHover={answerStatus === null ? { scale: 1.01 } : {}}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-800 rounded-full mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                    {selectedAnswer === option && option === currentQuestion.correctAnswer && (
                      <span className="ml-auto text-green-600">
                        <CheckCircle size={20} />
                      </span>
                    )}
                    {selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                      <span className="ml-auto text-red-600">
                        <AlertTriangle size={20} />
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* Current Score */}
            <div className="mt-6 flex justify-between items-center">
              <button 
                onClick={backToQuizzes}
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <span>Exit Quiz</span>
              </button>
              <div className="text-gray-600">
                Score: <span className="font-bold text-indigo-600">{score}</span>
              </div>
            </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizzesContent;