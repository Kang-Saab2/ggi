# Flask Authentication API

A simple Flask API for user signup and login using SQLite database.

## Setup

1. Install dependencies:
```
pip install -r requirements.txt
```

2. Run the application:
```
python app.py
```

The server will start on http://localhost:5000

## API Endpoints

### Signup
- URL: `/signup`
- Method: `GET`
- URL Parameters:
  - `name` (required): User's full name
  - `email` (required): User's email address
  - `password` (required): User's password
  - `interest` (optional): User's interest
- Example:
  ```
  http://localhost:5000/signup?name=John%20Doe&email=user@example.com&password=yourpassword&interest=technology
  ```
- Success Response: `201 Created`
  ```json
  {
    "message": "User created successfully"
  }
  ```

### Login
- URL: `/login`
- Method: `GET`
- URL Parameters:
  - `email` (required): User's email address
  - `password` (required): User's password
- Example:
  ```
  http://localhost:5000/login?email=user@example.com&password=yourpassword
  ```
- Success Response: `200 OK`
  ```json
  {
    "message": "Login successful",
    "email": "user@example.com",
    "name": "John Doe",
    "interest": "technology"
  }
  ```

### Save Quiz Score
- URL: `/save-quiz`
- Method: `GET`
- URL Parameters:
  - `email` (required): User's email address
  - `quiz_title` (required): The name of the quiz
  - `score` (required): The score achieved (e.g., "4/5")
- Example:
  ```
  http://localhost:5000/save-quiz?email=user@example.com&quiz_title=JavaScript&score=4/5
  ```
- Success Response: `201 Created`
  ```json
  {
    "message": "Quiz score saved successfully"
  }
  ```

### Get User's Quizzes
- URL: `/get-quizzes`
- Method: `GET`
- URL Parameters:
  - `email` (required): User's email address
- Example:
  ```
  http://localhost:5000/get-quizzes?email=user@example.com
  ```
- Success Response: `200 OK`
  ```json
  [
    {
      "title": "JavaScript",
      "icon": "<Code className=\"text-yellow-500\" size={16} />",
      "bgColor": "bg-yellow-100",
      "textColor": "text-yellow-600",
      "timeAgo": "2 days ago",
      "score": "4/5"
    },
    {
      "title": "Python",
      "icon": "<Code className=\"text-blue-600\" size={16} />",
      "bgColor": "bg-blue-100",
      "textColor": "text-blue-600",
      "timeAgo": "5 days ago",
      "score": "3/5"
    }
  ]
  ```

### Generate Roadmap
- URL: `/generate-roadmap`
- Method: `GET`
- URL Parameters:
  - `email` (required): User's email address
  - `language` (required): Programming language or subject for the roadmap
- Example:
  ```
  http://localhost:5000/generate-roadmap?email=user@example.com&language=JavaScript
  ```
- Success Response: `201 Created`
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "name": "JavaScript Fundamentals",
    "icon": "💻",
    "color": "#F7DF1E",
    "progress": 0,
    "completed": 0,
    "lessons": 12,
    "description": "Master the core concepts of JavaScript programming language.",
    "roadmap": [
      {
        "title": "JavaScript Basics",
        "description": "Build a solid foundation with core JavaScript concepts",
        "modules": [
          { "name": "Variables & Data Types", "completed": false, "description": "Learn about var, let, const, and primitive vs reference types" },
          { "name": "Operators & Expressions", "completed": false, "description": "Master arithmetic, comparison, logical, and assignment operators" },
          { "name": "Control Flow", "completed": false, "description": "Understand if/else statements, switch cases, and loops" },
          { "name": "Functions", "completed": false, "description": "Create reusable code blocks with parameters and return values" }
        ]
      },
      // more sections...
    ]
  }
  ```

### Get User's Roadmaps
- URL: `/get-roadmaps`
- Method: `GET`
- URL Parameters:
  - `email` (required): User's email address
- Example:
  ```
  http://localhost:5000/get-roadmaps?email=user@example.com
  ```
- Success Response: `200 OK`
  ```json
  [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "JavaScript Fundamentals",
      "icon": "💻",
      "color": "#F7DF1E",
      "progress": 0,
      "completed": 0,
      "lessons": 12,
      "description": "Master the core concepts of JavaScript programming language.",
      "roadmap": [
        // roadmap structure...
      ]
    },
    // more roadmaps...
  ]
  ```

### Get User's Roadmaps (Simplified Format)
- URL: `/user-roadmaps`
- Method: `GET`
- URL Parameters:
  - `email` (required): User's email address
- Example:
  ```
  http://localhost:5000/user-roadmaps?email=user@example.com
  ```
- Success Response: `200 OK`
  ```json
  [
    {
      "id": 1,
      "name": "JavaScript Fundamentals",
      "icon": "💻",
      "color": "#F7DF1E",
      "progress": 0,
      "completed": 13,
      "lessons": 20,
      "description": "Master the core concepts of JavaScript programming language.",
      "roadmap": [
        {
          "title": "JavaScript Basics",
          "description": "Build a solid foundation with core JavaScript concepts",
          "modules": [
            { "name": "Variables & Data Types", "completed": true, "description": "Learn about var, let, const, and primitive vs reference types" },
            { "name": "Operators & Expressions", "completed": true, "description": "Master arithmetic, comparison, logical, and assignment operators" },
            { "name": "Control Flow", "completed": true, "description": "Understand if/else statements, switch cases, and loops" },
            { "name": "Functions", "completed": true, "description": "Create reusable code blocks with parameters and return values" }
          ]
        },
        // more sections...
      ]
    },
    // more roadmaps...
  ]
  ```

### Generate Learning Content
- URL: `/find-learning-video`
- Method: `GET`
- URL Parameters:
  - `course_title` (required): The title of the course
  - `module_title` (required): The title of the module
  - `subtopic` (required): The specific subtopic to generate content about
- Example:
  ```
  http://localhost:5000/find-learning-video?course_title=JavaScript&module_title=DOM%20Manipulation&subtopic=Event%20Listeners
  ```
- Success Response: `200 OK`
  ```json
  {
    "course_title": "JavaScript",
    "module_title": "DOM Manipulation",
    "subtopic": "Event Listeners",
    "explanation": "Event listeners are a fundamental concept in JavaScript DOM manipulation... [educational content continues]"
  }
  ```
- Error Response: `500 Internal Server Error`
  ```json
  {
    "message": "Error generating explanation: [error details]"
  }
  ```

### Update Roadmap Progress
- URL: `/update-roadmap-progress`
- Method: `GET` or `POST`
- Parameters:
  - `email` (required): User's email address
  - `roadmapId` (required): ID of the roadmap to update
  - `sectionIndex` (required): Index of the section in the roadmap (0-based)
  - `moduleIndex` (required): Index of the module in the section (0-based)
  - `course` (optional): Course name for reference
  - `module` (optional): Module name for reference
  - `lesson` (optional): Lesson name for reference
- Example GET:
  ```
  http://localhost:5000/update-roadmap-progress?email=user@example.com&roadmapId=4&sectionIndex=0&moduleIndex=0&course=Networking%20Fundamentals&module=Beginner:%20Foundations%20of%20Networking&lesson=Introduction%20to%20Networking
  ```
- Example POST:
  ```json
  {
    "email": "user@example.com",
    "roadmapId": 4,
    "sectionIndex": 0,
    "moduleIndex": 0,
    "course": "Networking Fundamentals",
    "module": "Beginner: Foundations of Networking",
    "lesson": "Introduction to Networking"
  }
  ```
- Success Response: `200 OK`
  ```json
  {
    "message": "Roadmap progress updated successfully",
    "roadmap": {
      "id": 4,
      "name": "Networking Fundamentals",
      "progress": 25,
      "completed": 5,
      "lessons": 20,
      "course": "Networking Fundamentals",
      "module": "Beginner: Foundations of Networking",
      "lesson": "Introduction to Networking",
      "updated_section_index": 0,
      "updated_module_index": 0
    }
  }
  ```

### Generate Programming Problems
- URL: `/generate-problems`
- Method: `GET`
- URL Parameters:
  - `email` (required): User's email address
- Example:
  ```
  http://localhost:5000/generate-problems?email=user@example.com
  ```
- Success Response (for new problems): `200 OK`
  ```json
  {
    "message": "Problems generated successfully",
    "problems": [
      {
        "id": 1,
        "title": "Square root of complex numbers",
        "difficulty": "Hard",
        "solved": false,
        "category": "Algebra",
        "solution": "The square root of a complex number can be found using the formula: sqrt(a + bi) = sqrt((a^2 + b^2)/2) + i * sqrt((a^2 + b^2)/2) * sign(b)",
        "examplesList": [
          {
            "id": 1,
            "input": "2 + 3i",
            "output": "1.67 + 0.89i",
            "explanation": "Using the formula sqrt(2 + 3i) = sqrt((2^2 + 3^2)/2) + i * sqrt((2^2 + 3^2)/2) * sign(3)"
          },
          {
            "id": 2,
            "input": "5 - 12i",
            "output": "3.61 - 1.66i",
            "explanation": "Using the formula sqrt(5 - 12i) = sqrt((5^2 + 12^2)/2) + i * sqrt((5^2 + 12^2)/2) * sign(-12)"
          }
        ]
      },
      {
        "id": 2,
        "title": "Merge Sort Algorithm",
        "difficulty": "Medium",
        "solved": false,
        "category": "Algorithms",
        "solution": "Divide the array into two halves, recursively sort them, and then merge the sorted halves.",
        "examplesList": [
          {
            "id": 1,
            "input": "[38, 27, 43, 3, 9, 82, 10]",
            "output": "[3, 9, 10, 27, 38, 43, 82]",
            "explanation": "The array is divided into subarrays and then merged back in sorted order."
          }
        ]
      }
      // Additional problems...
    ]
  }
  ```
- Success Response (for existing problems): `200 OK`
  ```json
  {
    "message": "Found existing problems",
    "problems": [
      // Array of problem objects as shown above
    ]
  }
  ```
- Error Response: `404 Not Found` or `500 Internal Server Error`
  ```json
  {
    "message": "Error message explaining the issue"
  }
  ```

### Toggle Problem Solved Status
- URL: `/toggle-problem-status`
- Method: `GET` or `POST`
- Parameters:
  - `email` (required): User's email address
  - `problem_id` (required): ID of the problem to toggle
- Example GET:
  ```
  http://localhost:5000/toggle-problem-status?email=user@example.com&problem_id=1
  ```
- Example POST:
  ```json
  {
    "email": "user@example.com",
    "problem_id": 1
  }
  ```
- Success Response: `200 OK`
  ```json
  {
    "message": "Problem marked as solved",
    "problem": {
      "id": 1,
      "title": "Square root of complex numbers",
      "difficulty": "Hard",
      "solved": true,
      "category": "Algebra",
      "solution": "The square root of a complex number can be found using the formula...",
      "examplesList": [
        // Examples as shown above
      ]
    }
  }
  ```
- Error Response: `404 Not Found` or `500 Internal Server Error`
  ```json
  {
    "message": "Error message explaining the issue"
  }
  ```

### Toggle Problem Solved Status with Solution Validation
- URL: `/toggle-problem-status`
- Method: `GET` or `POST`
- Parameters:
  - `email` (required): User's email address
  - `problem_id` (required): ID of the problem to toggle
  - `user_solution` (required for validation): The user's solution to be validated
- Example GET:
  ```
  http://localhost:5000/toggle-problem-status?email=user@example.com&problem_id=1&user_solution=function%20solve(a%2C%20b)%20%7B%20return%20Math.sqrt(a*a%20%2B%20b*b)%3B%20%7D
  ```
- Example POST:
  ```json
  {
    "email": "user@example.com",
    "problem_id": 1,
    "user_solution": "function solve(a, b) { return Math.sqrt(a*a + b*b); }"
  }
  ```
- Success Response (Correct Solution): `200 OK`
  ```json
  {
    "message": "Problem marked as solved",
    "problem": {
      "id": 1,
      "title": "Square root of complex numbers",
      "difficulty": "Hard",
      "solved": true,
      "category": "Algebra",
      "solution": "The square root of a complex number can be found using the formula...",
      "examplesList": [
        // Examples as shown above
      ]
    },
    "is_correct": true,
    "feedback": "Your solution correctly implements the formula for finding the square root of a complex number...",
    "suggestions": ""
  }
  ```
- Success Response (Incorrect Solution): `200 OK`
  ```json
  {
    "message": "Solution is incorrect",
    "problem": {
      "id": 1,
      "title": "Square root of complex numbers",
      "difficulty": "Hard",
      "solved": false,
      "category": "Algebra",
      "solution": "The square root of a complex number can be found using the formula...",
      "examplesList": [
        // Examples as shown above
      ]
    },
    "is_correct": false,
    "feedback": "Your solution doesn't account for the complex part of the number...",
    "suggestions": "Consider how to handle both the real and imaginary parts separately..."
  }
  ```
- Error Response (No Solution Provided): `400 Bad Request`
  ```json
  {
    "message": "No solution provided",
    "problem": {
      // Problem details
    },
    "feedback": "Please provide a solution to validate"
  }
  ```
- Error Response: `404 Not Found` or `500 Internal Server Error`
  ```json
  {
    "message": "Error message explaining the issue"
  }
  ```

### Toggle Problem Solved Status with Enhanced Solution Validation
- URL: `/toggle-problem-status`
- Method: `GET` or `POST`
- Parameters:
  - `email` (required): User's email address
  - `problem_id` (required): ID of the problem to toggle
  - `user_solution` (required for validation): The user's solution to be validated
- Example GET:
  ```
  http://localhost:5000/toggle-problem-status?email=user@example.com&problem_id=1&user_solution=function%20solve(a%2C%20b)%20%7B%20return%20Math.sqrt(a*a%20%2B%20b*b)%3B%20%7D
  ```
- Example POST:
  ```json
  {
    "email": "user@example.com",
    "problem_id": 1,
    "user_solution": "function solve(a, b) { return Math.sqrt(a*a + b*b); }"
  }
  ```
- Success Response (Correct Solution): `200 OK`
  ```json
  {
    "message": "Problem marked as solved",
    "problem": {
      "id": 1,
      "title": "Square root of complex numbers",
      "difficulty": "Hard",
      "solved": true,
      "category": "Algebra",
      "solution": "The square root of a complex number can be found using the formula...",
      "examplesList": [
        // Examples as shown above
      ]
    },
    "is_correct": true,
    "analysis": "I traced through the solution with the example inputs. For input '2 + 3i', the solution correctly calculates...",
    "feedback": "Your solution correctly implements the formula for finding the square root of a complex number...",
    "suggestions": "",
    "full_evaluation": "VERDICT: CORRECT\nANALYSIS: [detailed step-by-step analysis]..."
  }
  ```
- Success Response (Incorrect Solution): `200 OK`
  ```json
  {
    "message": "Solution is incorrect",
    "problem": {
      "id": 1,
      "title": "Square root of complex numbers",
      "difficulty": "Hard",
      "solved": false,
      "category": "Algebra",
      "solution": "The square root of a complex number can be found using the formula...",
      "examplesList": [
        // Examples as shown above
      ]
    },
    "is_correct": false,
    "analysis": "For the input '2 + 3i', your solution produces '2.6457 + 0.5665i', but the expected output is '1.67 + 0.89i'...",
    "feedback": "Your solution doesn't correctly implement the formula for complex square roots...",
    "suggestions": "Make sure to implement the specific formula mentioned in the problem: sqrt(a + bi) = sqrt((a^2 + b^2)/2) + i * sqrt((a^2 + b^2)/2) * sign(b)",
    "full_evaluation": "VERDICT: INCORRECT\nANALYSIS: [detailed step-by-step analysis]..."
  }
  ```
- Error Response (No Solution Provided): `400 Bad Request`
  ```json
  {
    "message": "No solution provided",
    "problem": {
      // Problem details
    },
    "feedback": "Please provide a solution to validate"
  }
  ```
- Error Response: `404 Not Found` or `500 Internal Server Error`
  ```json
  {
    "message": "Error message explaining the issue"
  }
  ```

### Get User's Problems
- URL: `/get-problems`
- Method: `GET`
- URL Parameters:
  - `email` (required): User's email address
- Example:
  ```
  http://localhost:5000/get-problems?email=user@example.com
  ```
- Success Response: `200 OK`
  ```json
  {
    "message": "Problems retrieved successfully",
    "problems": [
      {
        "id": 1,
        "title": "Square root of complex numbers",
        "difficulty": "Hard",
        "solved": true,
        "category": "Algebra",
        "solution": "The square root of a complex number can be found using the formula...",
        "examplesList": [
          // Examples as shown above
        ]
      },
      // Additional problems...
    ]
  }
  ```
- Empty Response: `200 OK`
  ```json
  {
    "message": "No problems found for this user",
    "problems": []
  }
  ```
- Error Response: `404 Not Found` or `500 Internal Server Error`
  ```json
  {
    "message": "Error message explaining the issue"
  }
  ```

### Test Solution Validation
- URL: `/test-solution-validation`
- Method: `GET` or `POST`
- Parameters:
  - `email` (required): User's email address
  - `problem_id` (required): ID of the problem to validate against
  - `user_solution` (required): The user's solution to be validated
- Example GET:
  ```
  http://localhost:5000/test-solution-validation?email=user@example.com&problem_id=1&user_solution=function%20solve(a%2C%20b)%20%7B%20return%20Math.sqrt(a*a%20%2B%20b*b)%3B%20%7D
  ```
- Example POST:
  ```json
  {
    "email": "user@example.com",
    "problem_id": 1,
    "user_solution": "function solve(a, b) { return Math.sqrt(a*a + b*b); }"
  }
  ```
- Success Response: `200 OK`
  ```json
  {
    "problem_title": "Square root of complex numbers",
    "problem_description": "The square root of a complex number can be found using the formula...",
    "user_solution": "function solve(a, b) { return Math.sqrt(a*a + b*b); }",
    "gemini_raw_response": "VERDICT: INCORRECT\nANALYSIS: [detailed analysis...]\nFEEDBACK: [feedback...]\nSUGGESTIONS: [suggestions...]",
    "verdict": "INCORRECT",
    "verification_applied": true,
    "examples": [
      {
        "id": 1,
        "input": "2 + 3i",
        "output": "1.67 + 0.89i",
        "explanation": "Using the formula sqrt(2 + 3i)..."
      }
    ]
  }
  ```
- Error Response: `404 Not Found` or `500 Internal Server Error`
  ```json
  {
    "message": "Error message explaining the issue"
  }
  ```

### Generate Programming Quiz
- URL: `/generate-quiz`
- Method: `GET`
- No parameters required
- Example:
  ```
  http://localhost:5000/generate-quiz
  ```
- Success Response: `200 OK`
  ```json
  {
    "questions": [
      {
        "question": "Which of the following is NOT a valid way to declare a variable in JavaScript?",
        "options": ["let x = 10;", "const x = 10;", "var x = 10;", "int x = 10;"],
        "correctAnswer": 3
      },
      {
        "question": "What is the output of print(type([]) is list) in Python?",
        "options": ["True", "False", "TypeError", "None"],
        "correctAnswer": 0
      },
      {
        "question": "Which React hook is used to perform side effects in a functional component?",
        "options": ["useState", "useEffect", "useContext", "useReducer"],
        "correctAnswer": 1
      },
      {
        "question": "What does CSS stand for?",
        "options": ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
        "correctAnswer": 2
      },
      {
        "question": "Which data structure follows the Last-In-First-Out (LIFO) principle?",
        "options": ["Queue", "Stack", "Linked List", "Tree"],
        "correctAnswer": 1
      }
    ]
  }
  ```
- Error Response: `500 Internal Server Error`
  ```json
  {
    "message": "Error generating quiz: [error details]"
  }
  ```

### Get Specific Roadmap
- URL: `/get-roadmap/<roadmap_id>`
- Method: `GET`
- URL Parameters: None (roadmap ID is in the path)
- Example:
  ```
  http://localhost:5000/get-roadmap/1
  ```
- Success Response: `200 OK`
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "name": "JavaScript Fundamentals",
    "icon": "💻",
    "color": "#F7DF1E",
    "progress": 0,
    "completed": 0,
    "lessons": 12,
    "description": "Master the core concepts of JavaScript programming language.",
    "roadmap": [
      // roadmap structure...
    ]
  }
  ```

### Update Module Status
- URL: `/update-module-status`
- Method: `GET`
- URL Parameters:
  - `roadmap_id` (required): ID of the roadmap
  - `section_index` (required): Index of the section in the roadmap (0-based)
  - `module_index` (required): Index of the module in the section (0-based)
  - `completed` (required): "true" or "false" to mark completion status
- Example:
  ```
  http://localhost:5000/update-module-status?roadmap_id=1&section_index=0&module_index=0&completed=true
  ```
- Success Response: `200 OK`
  ```json
  {
    "message": "Module status updated successfully",
    "roadmap": {
      // updated roadmap structure...
    }
  }
  ```

## Troubleshooting

### Common Issues

#### Error: `module 'google.generativeai' has no attribute 'models'`

This error occurs when using an outdated version of the Google Generative AI library. The API structure has changed in newer versions.

**Solution:**
1. Update the library to the latest version:
   ```
   pip install -U google-generativeai
   ```
2. If you're still experiencing issues, check the [Google AI documentation](https://ai.google.dev/api/rest) for the latest API usage guidelines.

#### Model Availability Issues

Some Gemini models might not be available depending on your region or access level. If you encounter errors related to model availability:

1. Check available models:
   ```python
   import google.generativeai as genai
   genai.configure(api_key='YOUR_API_KEY')
   for m in genai.list_models():
       print(m.name)
   ```
2. Make sure to use a model that's available in your region and for your account. 