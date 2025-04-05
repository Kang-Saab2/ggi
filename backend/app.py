from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json
from datetime import datetime, timedelta
import google.generativeai as genai
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this in production
app.config['GEMINI_API_KEY'] = 'AIzaSyB_ymO980AOnpl9V188IXAePlqBl8ddiRA'  # Gemini API key

# Initialize Gemini API
genai.configure(api_key=app.config['GEMINI_API_KEY'])

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    interest = db.Column(db.String(200), nullable=True)
    quizzes = db.relationship('Quiz', backref='user', lazy=True)
    roadmaps = db.relationship('Roadmap', backref='user', lazy=True)
    problems = db.relationship('Problem', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    score = db.Column(db.String(10), nullable=False)  # e.g., "4/5"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Quiz {self.title} - {self.score}>'
    
    def to_dict(self):
        time_diff = datetime.utcnow() - self.created_at
        days_ago = time_diff.days
        time_ago = f"{days_ago} days ago" if days_ago > 0 else "Today"
        
        icon_map = {
            "JavaScript": "<Code className=\"text-yellow-500\" size={16} />",
            "Python": "<Code className=\"text-blue-600\" size={16} />",
            "Java": "<Code className=\"text-orange-500\" size={16} />",
            "C++": "<Code className=\"text-purple-500\" size={16} />",
            "HTML/CSS": "<Code className=\"text-green-500\" size={16} />",
            "React": "<Code className=\"text-blue-400\" size={16} />",
            "Node.js": "<Code className=\"text-green-600\" size={16} />",
            "SQL": "<Database className=\"text-blue-500\" size={16} />",
        }
        
        color_map = {
            "JavaScript": {"bg": "bg-yellow-100", "text": "text-yellow-600"},
            "Python": {"bg": "bg-blue-100", "text": "text-blue-600"},
            "Java": {"bg": "bg-orange-100", "text": "text-orange-600"},
            "C++": {"bg": "bg-purple-100", "text": "text-purple-600"},
            "HTML/CSS": {"bg": "bg-green-100", "text": "text-green-600"},
            "React": {"bg": "bg-blue-100", "text": "text-blue-400"},
            "Node.js": {"bg": "bg-green-100", "text": "text-green-600"},
            "SQL": {"bg": "bg-blue-100", "text": "text-blue-500"},
        }
        
        bg_color = color_map.get(self.title, {"bg": "bg-gray-100"})["bg"]
        text_color = color_map.get(self.title, {"text": "text-gray-600"})["text"]
        
        return {
            "title": self.title,
            "icon": icon_map.get(self.title, "<Code className=\"text-gray-500\" size={16} />"),
            "bgColor": bg_color,
            "textColor": text_color,
            "timeAgo": time_ago,
            "score": self.score
        }

class Problem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    difficulty = db.Column(db.String(50), nullable=False)
    solved = db.Column(db.Boolean, default=False)
    category = db.Column(db.String(100), nullable=False)
    solution = db.Column(db.Text, nullable=False)
    examples = db.Column(db.Text, nullable=False)  # Stored as JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Problem {self.title} - {self.difficulty}>'
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "difficulty": self.difficulty,
            "solved": self.solved,
            "category": self.category,
            "solution": self.solution,
            "examplesList": json.loads(self.examples)
        }

class Roadmap(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    icon = db.Column(db.String(10), nullable=False, default="💻")
    color = db.Column(db.String(20), nullable=False, default="#4285F4")
    progress = db.Column(db.Integer, default=0)
    completed = db.Column(db.Integer, default=0)
    lessons = db.Column(db.Integer, default=0)
    description = db.Column(db.String(500), nullable=False)
    roadmap_data = db.Column(db.Text, nullable=False)  # JSON string of roadmap data
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    email = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<Roadmap {self.name}>'
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "icon": self.icon,
            "color": self.color,
            "progress": self.progress,
            "completed": self.completed,
            "lessons": self.lessons,
            "description": self.description,
            "roadmap": json.loads(self.roadmap_data)
        }

with app.app_context():
    db.create_all()

def generate_roadmap_with_gemini(language):
    """Generate a learning roadmap using Gemini API"""
    # Create a GenerativeModel object instead of using models.get_model
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    prompt = f"""Create a detailed learning roadmap for {language} programming language.
    Structure the response as a JSON object with the following format:
    
    {{
      "name": "{language} Fundamentals",
      "icon": "💻",
      "color": "#4285F4", // Use an appropriate color for {language}
      "description": "A brief description of {language} and this roadmap.",
      "progress": 0,
      "completed": 0,
      "lessons": 20,
      "roadmap": [
        {{
          "title": "Section title",
          "description": "Section description",
          "modules": [
            {{ 
              "name": "Module name", 
              "completed": false, 
              "description": "Brief description of what will be learned"
            }},
            // More modules...
          ]
        }},
        // More sections...
      ]
    }}
    
    Include at least 3 sections (beginner, intermediate, advanced) with 4 modules each.
    Make sure to provide appropriate, accurate information for learning {language}.
    Each module should have a clear, concise description.
    Set all modules as 'completed: false' by default.
    Return ONLY the JSON object without any additional text."""
    
    # Use the generate_content method directly on the model
    response = model.generate_content(prompt)
    
    # Parse the JSON from the response
    try:
        # Clean the response if needed
        response_text = response.text
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        roadmap_data = json.loads(response_text)
        
        # Count total lessons
        lessons_count = 0
        for section in roadmap_data.get("roadmap", []):
            lessons_count += len(section.get("modules", []))
        
        return {
            "name": roadmap_data.get("name"),
            "icon": roadmap_data.get("icon", "💻"),
            "color": roadmap_data.get("color", "#4285F4"),
            "description": roadmap_data.get("description"),
            "lessons": lessons_count,
            "roadmap": roadmap_data.get("roadmap", [])
        }
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        print(f"Response received: {response.text}")
        # Return a fallback roadmap
        return generate_fallback_roadmap(language)

def generate_fallback_roadmap(language):
    """Generate a basic fallback roadmap if the API call fails"""
    color_map = {
        "javascript": "#F7DF1E",
        "python": "#3776AB",
        "java": "#007396",
        "c#": "#68217A",
        "c++": "#00599C",
        "php": "#777BB4",
        "ruby": "#CC342D",
        "swift": "#FA7343",
        "go": "#00ADD8",
        "rust": "#DEA584"
    }
    
    color = color_map.get(language.lower(), "#4285F4")
    
    roadmap = {
        "name": f"{language} Fundamentals",
        "icon": "💻",
        "color": color,
        "description": f"Learn the fundamentals of {language} programming language.",
        "lessons": 12,
        "roadmap": [
            {
                "title": f"{language} Basics",
                "description": f"Build a solid foundation with core {language} concepts",
                "modules": [
                    {"name": "Setup & Installation", "completed": False, "description": f"Setup your development environment for {language}"},
                    {"name": "Syntax & Basic Constructs", "completed": False, "description": "Learn the basic syntax and programming constructs"},
                    {"name": "Variables & Data Types", "completed": False, "description": "Understanding data types and variable declaration"},
                    {"name": "Functions", "completed": False, "description": "Create reusable code blocks"}
                ]
            },
            {
                "title": f"Intermediate {language}",
                "description": "Expand your skills with more complex features",
                "modules": [
                    {"name": "Data Structures", "completed": False, "description": "Working with arrays, lists, and complex data structures"},
                    {"name": "Error Handling", "completed": False, "description": "Handle and manage errors in your code"},
                    {"name": "File I/O", "completed": False, "description": "Reading from and writing to files"},
                    {"name": "Package Management", "completed": False, "description": "Using libraries and dependencies"}
                ]
            },
            {
                "title": f"Advanced {language}",
                "description": "Master professional development techniques",
                "modules": [
                    {"name": "Design Patterns", "completed": False, "description": "Implementing common design patterns"},
                    {"name": "Testing", "completed": False, "description": "Writing tests and ensuring code quality"},
                    {"name": "Performance Optimization", "completed": False, "description": "Making your code faster and more efficient"},
                    {"name": "Advanced Topics", "completed": False, "description": f"Specialized {language} features and frameworks"}
                ]
            }
        ]
    }
    
    return roadmap

@app.route('/signup', methods=['GET'])
def signup():
    # Get parameters from URL
    name = request.args.get('name')
    email = request.args.get('email')
    password = request.args.get('password')
    interest = request.args.get('interest', '')
    
    # Check if required fields are present
    if not name or not email or not password:
        return jsonify({'message': 'Name, email and password are required'}), 400
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 409
    
    # Create new user
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(name=name, email=email, password=hashed_password, interest=interest)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['GET'])
def login():
    # Get parameters from URL
    email = request.args.get('email')
    password = request.args.get('password')
    
    # Check if required fields are present
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    # Find user
    user = User.query.filter_by(email=email).first()
    
    # Check if user exists and password is correct
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Return user email on successful login
    return jsonify({
        'message': 'Login successful', 
        'email': user.email,
        'name': user.name,
        'interest': user.interest
    }), 200

@app.route('/save-quiz', methods=['GET'])
def save_quiz():
    # Get parameters from URL
    email = request.args.get('email')
    quiz_title = request.args.get('quiz_title')
    score = request.args.get('score')
    
    # Check if required fields are present
    if not email or not quiz_title or not score:
        return jsonify({'message': 'Email, quiz title, and score are required'}), 400
    
    # Find user
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Create and save quiz
    new_quiz = Quiz(title=quiz_title, score=score, user_id=user.id)
    db.session.add(new_quiz)
    db.session.commit()
    
    return jsonify({'message': 'Quiz score saved successfully'}), 201

@app.route('/get-quizzes', methods=['GET'])
def get_quizzes():
    # Get email parameter from URL
    email = request.args.get('email')
    
    # Check if email is provided
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    
    # Find user
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Get user's quizzes, ordered by creation date (newest first)
    quizzes = Quiz.query.filter_by(user_id=user.id).order_by(Quiz.created_at.desc()).all()
    
    # Convert quizzes to the requested format
    quiz_data = [quiz.to_dict() for quiz in quizzes]
    
    return jsonify(quiz_data), 200

@app.route('/generate-roadmap', methods=['GET'])
def generate_roadmap():
    # Get parameters from URL
    email = request.args.get('email')
    language = request.args.get('language')
    
    # Check if required fields are present
    if not email or not language:
        return jsonify({'message': 'Email and language are required'}), 400
    
    # Find user
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    try:
        # Generate roadmap with Gemini API
        roadmap_data = generate_roadmap_with_gemini(language)
        
        # Create new roadmap
        new_roadmap = Roadmap(
            name=roadmap_data.get('name'),
            icon=roadmap_data.get('icon'),
            color=roadmap_data.get('color'),
            description=roadmap_data.get('description'),
            lessons=roadmap_data.get('lessons'),
            roadmap_data=json.dumps(roadmap_data.get('roadmap')),
            user_id=user.id,
            email=email
        )
        
        db.session.add(new_roadmap)
        db.session.commit()
        
        # Return the complete roadmap
        return jsonify(new_roadmap.to_dict()), 201
    
    except Exception as e:
        return jsonify({'message': f'Error generating roadmap: {str(e)}'}), 500

@app.route('/get-roadmaps', methods=['GET'])
def get_roadmaps():
    # Get email parameter from URL
    email = request.args.get('email')
    
    # Check if email is provided
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    
    # Find user
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Get user's roadmaps, ordered by creation date (newest first)
    roadmaps = Roadmap.query.filter_by(user_id=user.id).order_by(Roadmap.created_at.desc()).all()
    
    # Convert roadmaps to the requested format
    roadmap_data = [roadmap.to_dict() for roadmap in roadmaps]
    
    return jsonify(roadmap_data), 200

@app.route('/get-roadmap/<int:roadmap_id>', methods=['GET'])
def get_roadmap(roadmap_id):
    # Find the roadmap
    roadmap = Roadmap.query.get(roadmap_id)
    if not roadmap:
        return jsonify({'message': 'Roadmap not found'}), 404
    
    # Return the roadmap
    return jsonify(roadmap.to_dict()), 200

@app.route('/update-module-status', methods=['GET'])
def update_module_status():
    # Get parameters from URL
    roadmap_id = request.args.get('roadmap_id')
    section_index = request.args.get('section_index')
    module_index = request.args.get('module_index')
    completed = request.args.get('completed')
    
    # Check if required fields are present
    if not roadmap_id or section_index is None or module_index is None or completed is None:
        return jsonify({'message': 'Roadmap ID, section index, module index, and completed status are required'}), 400
    
    # Convert to appropriate types
    try:
        roadmap_id = int(roadmap_id)
        section_index = int(section_index)
        module_index = int(module_index)
        completed = completed.lower() == 'true'
    except ValueError:
        return jsonify({'message': 'Invalid parameter types'}), 400
    
    # Find the roadmap
    roadmap = Roadmap.query.get(roadmap_id)
    if not roadmap:
        return jsonify({'message': 'Roadmap not found'}), 404
    
    # Update the module status
    try:
        roadmap_data = json.loads(roadmap.roadmap_data)
        
        # Ensure indices are valid
        if section_index < 0 or section_index >= len(roadmap_data):
            return jsonify({'message': 'Invalid section index'}), 400
        
        section = roadmap_data[section_index]
        if module_index < 0 or module_index >= len(section.get('modules', [])):
            return jsonify({'message': 'Invalid module index'}), 400
        
        # Update the completed status
        section['modules'][module_index]['completed'] = completed
        
        # Count completed modules
        completed_count = 0
        total_modules = 0
        for section in roadmap_data:
            for module in section.get('modules', []):
                total_modules += 1
                if module.get('completed'):
                    completed_count += 1
        
        # Update the roadmap
        roadmap.roadmap_data = json.dumps(roadmap_data)
        roadmap.completed = completed_count
        roadmap.lessons = total_modules
        roadmap.progress = int((completed_count / total_modules) * 100) if total_modules > 0 else 0
        
        db.session.commit()
        
        return jsonify({'message': 'Module status updated successfully', 'roadmap': roadmap.to_dict()}), 200
    except Exception as e:
        return jsonify({'message': f'Error updating module status: {str(e)}'}), 500

@app.route('/user-roadmaps', methods=['GET'])
def user_roadmaps():
    # Get email parameter from URL
    email = request.args.get('email')
    
    # Check if email is provided
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    
    # Find user
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Get user's roadmaps, ordered by creation date (newest first)
    roadmaps = Roadmap.query.filter_by(user_id=user.id).order_by(Roadmap.created_at.desc()).all()
    
    # Create the simplified format
    simplified_roadmaps = []
    for roadmap in roadmaps:
        roadmap_data = {
            "id": roadmap.id,
            "name": roadmap.name,
            "icon": roadmap.icon,
            "color": roadmap.color,
            "progress": roadmap.progress,
            "completed": roadmap.completed,
            "lessons": roadmap.lessons,
            "description": roadmap.description,
            "roadmap": json.loads(roadmap.roadmap_data)
        }
        simplified_roadmaps.append(roadmap_data)
    
    return jsonify(simplified_roadmaps), 200

@app.route('/find-learning-video', methods=['GET'])
def find_learning_video():
    course_title = request.args.get('course_title')
    module_title = request.args.get('module_title')
    subtopic = request.args.get('subtopic')
    
    if not course_title or not module_title or not subtopic:
        return jsonify({"message": "Missing required parameters"}), 400
    
    try:
        # Create the model
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # Generate educational content
        prompt = f"""
        Generate a comprehensive educational explanation about {subtopic} in the context of {course_title}, 
        specifically within the {module_title} module.
        
        Include key concepts, definitions, and important aspects that learners should understand.
        
        The explanation should be structured with an introduction, main points, and a conclusion.
        Make it between 300-500 words, educational, and accessible to learners.
        """
        
        response = model.generate_content(prompt)
        explanation = response.text
        
        return jsonify({
            "course_title": course_title,
            "module_title": module_title,
            "subtopic": subtopic,
            "explanation": explanation
        })
    
    except Exception as e:
        return jsonify({"message": f"Error generating explanation: {str(e)}"}), 500

@app.route('/update-roadmap-progress', methods=['GET', 'POST'])
def update_roadmap_progress():
    # Get parameters - support both GET and POST methods
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        roadmap_id = data.get('roadmapId')
        section_index = data.get('sectionIndex')
        module_index = data.get('moduleIndex')
        course = data.get('course')
        module = data.get('module')
        lesson = data.get('lesson')
    else:  # GET method
        email = request.args.get('email')
        roadmap_id = request.args.get('roadmapId')
        section_index = request.args.get('sectionIndex')
        module_index = request.args.get('moduleIndex')
        course = request.args.get('course')
        module = request.args.get('module')
        lesson = request.args.get('lesson')
    
    # Validate required parameters
    if not email or roadmap_id is None or section_index is None or module_index is None:
        return jsonify({
            'message': 'Email, roadmapId, sectionIndex, and moduleIndex are required'
        }), 400
    
    # Convert numeric parameters to integers
    try:
        roadmap_id = int(roadmap_id)
        section_index = int(section_index)
        module_index = int(module_index)
    except ValueError:
        return jsonify({'message': 'Invalid parameter types'}), 400
    
    # Find the user
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Find the roadmap
    roadmap = Roadmap.query.get(roadmap_id)
    if not roadmap:
        return jsonify({'message': 'Roadmap not found'}), 404
    
    # Verify the roadmap belongs to the user
    if roadmap.user_id != user.id:
        return jsonify({'message': 'Roadmap does not belong to this user'}), 403
    
    # Update the module status
    try:
        roadmap_data = json.loads(roadmap.roadmap_data)
        
        # Ensure indices are valid
        if section_index < 0 or section_index >= len(roadmap_data):
            return jsonify({'message': 'Invalid section index'}), 400
        
        section = roadmap_data[section_index]
        if module_index < 0 or module_index >= len(section.get('modules', [])):
            return jsonify({'message': 'Invalid module index'}), 400
        
        # Set this module as completed
        section['modules'][module_index]['completed'] = True
        
        # Count completed modules
        completed_count = 0
        total_modules = 0
        for section in roadmap_data:
            for module in section.get('modules', []):
                total_modules += 1
                if module.get('completed'):
                    completed_count += 1
        
        # Update the roadmap
        roadmap.roadmap_data = json.dumps(roadmap_data)
        roadmap.completed = completed_count
        roadmap.lessons = total_modules
        roadmap.progress = int((completed_count / total_modules) * 100) if total_modules > 0 else 0
        
        db.session.commit()
        
        # Return success response with updated roadmap
        return jsonify({
            'message': 'Roadmap progress updated successfully',
            'roadmap': {
                'id': roadmap.id,
                'name': roadmap.name,
                'progress': roadmap.progress,
                'completed': roadmap.completed,
                'lessons': roadmap.lessons,
                'course': course,
                'module': module,
                'lesson': lesson,
                'updated_section_index': section_index,
                'updated_module_index': module_index
            }
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error updating roadmap progress: {str(e)}'}), 500

@app.route('/generate-problems', methods=['GET'])
def generate_problems():
    email = request.args.get('email')
    
    if not email:
        return jsonify({"message": "Email parameter is required"}), 400
    
    # Find the user
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Check if problems already exist for this user
    existing_problems = Problem.query.filter_by(user_id=user.id).all()
    if existing_problems:
        # Return the existing problems
        return jsonify({
            "message": "Found existing problems",
            "problems": [problem.to_dict() for problem in existing_problems]
        })
    
    # Get user's roadmaps to extract content for problem generation
    roadmaps = Roadmap.query.filter_by(user_id=user.id).all()
    if not roadmaps:
        return jsonify({"message": "No roadmaps found for this user"}), 404
    
    # Extract topics from roadmaps to generate relevant problems
    topics = []
    for roadmap in roadmaps:
        roadmap_data = json.loads(roadmap.roadmap_data)
        if 'roadmap' in roadmap_data:
            for section in roadmap_data['roadmap']:
                if 'title' in section:
                    topics.append(section['title'])
                if 'modules' in section:
                    for module in section['modules']:
                        if 'name' in module:
                            topics.append(module['name'])
    
    # Prepare topics for prompt (limit to prevent too long prompts)
    topics_text = ", ".join(topics[:10])
    
    try:
        # Create the model
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # Generate programming problems based on roadmap content
        prompt = f"""
        You are an expert computer science educator. Generate 4 programming problems based on the following topics from a user's learning roadmap: {topics_text}.

        For each problem, create:
        1. A clear title that describes the problem
        2. A difficulty level (Easy, Medium, or Hard)
        3. A specific category (e.g., Algorithms, Data Structures, Mathematics, etc.)
        4. A detailed solution approach
        5. 2-3 examples with input, output, and explanation

        Format the response as a JSON array where each object has the following fields:
        - id: number (1, 2, 3, 4)
        - title: string (descriptive problem name)
        - difficulty: string (Easy, Medium, or Hard)
        - solved: boolean (always false)
        - category: string (problem category)
        - solution: string (detailed solution approach)
        - examplesList: array of example objects with:
          - id: number (sequential)
          - input: string (sample input)
          - output: string (expected output)
          - explanation: string (explanation of how the output was derived)

        IMPORTANT: Ensure all examples are clear, correct, and properly formatted. The solution should be understandable but challenging appropriate to the difficulty level.
        """
        
        response = model.generate_content(prompt)
        
        # Parse the response text to extract the JSON array
        # The response might contain markdown code block, so we need to extract just the JSON part
        response_text = response.text
        
        # Find JSON array in the response
        import re
        json_match = re.search(r'\[\s*{.+}\s*\]', response_text, re.DOTALL)
        
        if json_match:
            problems_json = json_match.group(0)
        else:
            # If we can't extract the exact JSON, try to use the whole response
            problems_json = response_text
        
        try:
            # Try to parse the JSON
            problems_data = json.loads(problems_json)
            
            # Save problems to database
            saved_problems = []
            for problem_data in problems_data:
                # Ensure all required fields are present
                if not all(key in problem_data for key in ['title', 'difficulty', 'category', 'solution', 'examplesList']):
                    continue
                
                # Create new problem
                new_problem = Problem(
                    title=problem_data['title'],
                    difficulty=problem_data['difficulty'],
                    solved=False,
                    category=problem_data['category'],
                    solution=problem_data['solution'],
                    examples=json.dumps(problem_data['examplesList']),
                    user_id=user.id
                )
                
                db.session.add(new_problem)
                saved_problems.append(new_problem)
            
            db.session.commit()
            
            # Return the newly created problems
            return jsonify({
                "message": "Problems generated successfully",
                "problems": [problem.to_dict() for problem in saved_problems]
            })
            
        except json.JSONDecodeError:
            # If JSON parsing fails, generate a simpler response
            default_problems = [
                {
                    "id": 1,
                    "title": "String Reversal Algorithm",
                    "difficulty": "Easy",
                    "solved": False,
                    "category": "Strings",
                    "solution": "Iterate from the end of the string to the beginning, appending each character to a new string.",
                    "examplesList": [
                        {
                            "id": 1,
                            "input": "hello",
                            "output": "olleh",
                            "explanation": "Reversed all characters from the input string."
                        },
                        {
                            "id": 2,
                            "input": "world",
                            "output": "dlrow",
                            "explanation": "Reversed all characters from the input string."
                        }
                    ]
                },
                {
                    "id": 2,
                    "title": "Finding Maximum Value",
                    "difficulty": "Easy",
                    "solved": False,
                    "category": "Arrays",
                    "solution": "Initialize a variable with the first element and iterate through the array, updating the variable if a larger value is found.",
                    "examplesList": [
                        {
                            "id": 1,
                            "input": "[3, 7, 2, 9, 1]",
                            "output": "9",
                            "explanation": "9 is the largest value in the array."
                        },
                        {
                            "id": 2,
                            "input": "[-5, -2, -8, -1]",
                            "output": "-1",
                            "explanation": "-1 is the largest value in the array."
                        }
                    ]
                },
                {
                    "id": 3,
                    "title": "Check for Palindrome",
                    "difficulty": "Medium",
                    "solved": False,
                    "category": "Strings",
                    "solution": "Compare characters from both ends moving inward. If any pair doesn't match, it's not a palindrome.",
                    "examplesList": [
                        {
                            "id": 1,
                            "input": "radar",
                            "output": "true",
                            "explanation": "Reading from left to right or right to left results in the same word."
                        },
                        {
                            "id": 2,
                            "input": "hello",
                            "output": "false",
                            "explanation": "Reading from right to left gives 'olleh', which is different from 'hello'."
                        }
                    ]
                },
                {
                    "id": 4,
                    "title": "Binary Search Implementation",
                    "difficulty": "Medium",
                    "solved": False,
                    "category": "Algorithms",
                    "solution": "Compare the target value to the middle element of the array. If they are not equal, narrow the search to the left or right half based on whether the target is less than or greater than the middle element.",
                    "examplesList": [
                        {
                            "id": 1,
                            "input": "nums = [1, 3, 5, 7, 9], target = 5",
                            "output": "2",
                            "explanation": "The value 5 is found at index 2."
                        },
                        {
                            "id": 2,
                            "input": "nums = [1, 3, 5, 7, 9], target = 4",
                            "output": "-1",
                            "explanation": "The value 4 is not in the array, so return -1."
                        }
                    ]
                }
            ]
            
            # Save default problems to database
            saved_problems = []
            for problem_data in default_problems:
                # Create new problem
                new_problem = Problem(
                    title=problem_data['title'],
                    difficulty=problem_data['difficulty'],
                    solved=False,
                    category=problem_data['category'],
                    solution=problem_data['solution'],
                    examples=json.dumps(problem_data['examplesList']),
                    user_id=user.id
                )
                
                db.session.add(new_problem)
                saved_problems.append(new_problem)
            
            db.session.commit()
            
            # Return the default problems
            return jsonify({
                "message": "Generated default problems due to JSON parsing error",
                "problems": [problem.to_dict() for problem in saved_problems]
            })
    
    except Exception as e:
        return jsonify({"message": f"Error generating problems: {str(e)}"}), 500

@app.route('/toggle-problem-status', methods=['GET'])
def toggle_problem_status():
    """Validate user solution and toggle the solved status of a specific problem"""
     # GET
    email = request.args.get('email')
    problem_id = request.args.get('problem_id')
    user_solution = request.args.get('user_solution', '')
    
    if not email or not problem_id:
        return jsonify({"message": "Email and problem_id parameters are required"}), 400
    
    try:
        # Find the user
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        # Find the problem
        problem = Problem.query.filter_by(id=problem_id, user_id=user.id).first()
        if not problem:
            return jsonify({"message": "Problem not found for this user"}), 404
        
        # If no user solution is provided and the problem is already solved, just toggle it off
        if not user_solution and problem.solved:
            problem.solved = False
            db.session.commit()
            return jsonify({
                "message": "Problem marked as unsolved",
                "problem": problem.to_dict(),
                "feedback": "Status updated without solution validation"
            })
        
        # If user provided a solution, validate it with Gemini API
        if user_solution:
            # Prepare problem context
            examples = json.loads(problem.examples)
            examples_text = "\n".join([
                f"Example {ex['id']}:\nInput: {ex['input']}\nExpected Output: {ex['output']}\nExplanation: {ex['explanation']}"
                for ex in examples
            ])
            
            # Create test cases text from examples
            test_cases = []
            for ex in examples:
                test_cases.append(f"Input: {ex['input']}, Expected Output: {ex['output']}")
            
            # Add a few edge cases based on the problem category if possible
            edge_cases = []
            if "array" in problem.category.lower() or "list" in problem.category.lower():
                edge_cases.extend(["Empty array", "Single element array", "Very large array"])
            elif "string" in problem.category.lower():
                edge_cases.extend(["Empty string", "Single character string", "String with special characters"])
            elif "number" in problem.category.lower() or "math" in problem.category.lower():
                edge_cases.extend(["Zero", "Negative numbers", "Very large numbers", "Decimal numbers"])
            
            problem_context = f"""
            Problem Title: {problem.title}
            Difficulty: {problem.difficulty}
            Category: {problem.category}
            
            Problem Description: 
            {problem.solution}
            
            Examples:
            {examples_text}
            
            User's Solution: 
            {user_solution}
            """
            
            # Create model
            model = genai.GenerativeModel("gemini-2.0-flash")
            
            # Generate validation prompt with stronger guidelines
            prompt = f"""
            You are a strict programming instructor evaluating a student's solution to a coding problem.
            You must be critical and thorough in your evaluation.
            
            Carefully review the following:
            {problem_context}
            
            IMPORTANT: Be extremely critical and assume the solution is INCORRECT unless you can PROVE it is correct.
            The default verdict should be INCORRECT.
            
            Evaluate the user's solution with the following strict criteria:
            1. Is the solution syntactically correct for the implied programming language?
            2. Does it correctly implement the exact algorithm or approach described in the problem?
            3. Does it handle ALL test cases correctly? Trace through each example step by step.
            4. Would it handle edge cases such as: {', '.join(edge_cases)}?
            5. Is it efficient and optimized as required by the problem difficulty?
            6. Does it have any logical errors or bugs?
            
            For each example, trace through the execution of the user's solution with the given input and verify it produces the exact expected output.
            
            Only mark as CORRECT if ALL of the following are true:
            - The solution has NO syntax errors
            - The solution handles ALL test cases and produces EXACTLY the expected output
            - The solution uses the CORRECT approach as specified in the problem
            - The solution would handle all reasonable edge cases
            - The solution has appropriate time and space complexity for the problem difficulty
            
            Respond with:
            1. VERDICT: "CORRECT" only if you have rigorously verified all criteria above are met. Otherwise, "INCORRECT".
            2. ANALYSIS: Step-by-step analysis of how the solution performs on each test case.
            3. FEEDBACK: Detailed explanation supporting your verdict.
            4. SUGGESTIONS: If incorrect, provide hints on how to improve without giving the full solution.
            
            Remember, you must be STRICT and CRITICAL in your evaluation. When in doubt, mark as INCORRECT.
            """
            
            # Get validation response
            response = model.generate_content(prompt)
            validation_text = response.text
            
            # Print the full Gemini response for debugging
            print("\n-------- GEMINI VALIDATION RESPONSE --------")
            print(f"Problem ID: {problem_id}")
            print(f"User solution: {user_solution[:50]}..." if len(user_solution) > 50 else f"User solution: {user_solution}")
            print("\nGemini response:")
            print(validation_text)
            print("-------------------------------------------\n")
            
            # Simplified validation logic: Check for VERDICT: CORRECT or VERDICT: INCORRECT directly
            is_correct = "VERDICT: CORRECT" in validation_text.upper()
            
            # Extract analysis (new section)
            analysis_match = re.search(r'ANALYSIS:(.*?)(?:FEEDBACK:|VERDICT:|SUGGESTIONS:|$)', validation_text, re.DOTALL | re.IGNORECASE)
            analysis = analysis_match.group(1).strip() if analysis_match else ""
            
            # Extract feedback
            feedback_match = re.search(r'FEEDBACK:(.*?)(?:SUGGESTIONS:|ANALYSIS:|VERDICT:|$)', validation_text, re.DOTALL | re.IGNORECASE)
            feedback = feedback_match.group(1).strip() if feedback_match else validation_text
            
            # If no clear feedback section, look for content after VERDICT
            if not feedback_match:
                verdict_position = validation_text.upper().find("VERDICT:")
                if verdict_position > -1:
                    remaining_text = validation_text[verdict_position + 8:].strip()  # 8 is the length of "VERDICT:"
                    feedback = remaining_text
            
            # Extract suggestions
            suggestions_match = re.search(r'SUGGESTIONS:(.*?)$', validation_text, re.DOTALL | re.IGNORECASE)
            suggestions = suggestions_match.group(1).strip() if suggestions_match else ""

            # Update problem status based on validation
            if is_correct:
                problem.solved = True
                message = "Problem marked as solved"
            else:
                problem.solved = False
                message = "Solution is incorrect"
            
            db.session.commit()
            
            return jsonify({
                "message": message,
                "problem": problem.to_dict(),
                "is_correct": is_correct,
                "analysis": analysis,
                "feedback": feedback,
                "suggestions": suggestions,
                "full_evaluation": validation_text[:1000] if len(validation_text) > 1000 else validation_text  # Limit size of full evaluation
            })
        else:
            # No solution provided, don't change status
            return jsonify({
                "message": "No solution provided",
                "problem": problem.to_dict(),
                "feedback": "Please provide a solution to validate"
            }), 400
    
    except Exception as e:
        return jsonify({"message": f"Error validating solution: {str(e)}"}), 500

@app.route('/get-problems', methods=['GET'])
def get_problems():
    """Get all problems for a user"""
    email = request.args.get('email')
    
    if not email:
        return jsonify({"message": "Email parameter is required"}), 400
    
    try:
        # Find the user
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        # Get all problems for the user
        problems = Problem.query.filter_by(user_id=user.id).all()
        
        if not problems:
            return jsonify({
                "message": "No problems found for this user",
                "problems": []
            })
        
        return jsonify({
            "message": "Problems retrieved successfully",
            "problems": [problem.to_dict() for problem in problems]
        })
    
    except Exception as e:
        return jsonify({"message": f"Error retrieving problems: {str(e)}"}), 500

@app.route('/test-solution-validation', methods=['GET', 'POST'])
def test_solution_validation():
    """Test endpoint to see raw Gemini validation responses for a solution"""
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        problem_id = data.get('problem_id')
        user_solution = data.get('user_solution', '')
    else:  # GET
        email = request.args.get('email')
        problem_id = request.args.get('problem_id')
        user_solution = request.args.get('user_solution', '')
    
    if not email or not problem_id or not user_solution:
        return jsonify({"message": "Email, problem_id, and user_solution parameters are required"}), 400
    
    try:
        # Find the user
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        # Find the problem
        problem = Problem.query.filter_by(id=problem_id, user_id=user.id).first()
        if not problem:
            return jsonify({"message": "Problem not found for this user"}), 404
        
        # Prepare problem context
        examples = json.loads(problem.examples)
        examples_text = "\n".join([
            f"Example {ex['id']}:\nInput: {ex['input']}\nExpected Output: {ex['output']}\nExplanation: {ex['explanation']}"
            for ex in examples
        ])
        
        # Create test cases text from examples
        test_cases = []
        for ex in examples:
            test_cases.append(f"Input: {ex['input']}, Expected Output: {ex['output']}")
        
        # Add a few edge cases based on the problem category if possible
        edge_cases = []
        if "array" in problem.category.lower() or "list" in problem.category.lower():
            edge_cases.extend(["Empty array", "Single element array", "Very large array"])
        elif "string" in problem.category.lower():
            edge_cases.extend(["Empty string", "Single character string", "String with special characters"])
        elif "number" in problem.category.lower() or "math" in problem.category.lower():
            edge_cases.extend(["Zero", "Negative numbers", "Very large numbers", "Decimal numbers"])
        
        problem_context = f"""
        Problem Title: {problem.title}
        Difficulty: {problem.difficulty}
        Category: {problem.category}
        
        Problem Description: 
        {problem.solution}
        
        Examples:
        {examples_text}
        
        User's Solution: 
        {user_solution}
        """
        
        # Create model
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # Generate validation prompt with stronger guidelines
        prompt = f"""
        You are a strict programming instructor evaluating a student's solution to a coding problem.
        You must be critical and thorough in your evaluation.
        
        Carefully review the following:
        {problem_context}
        
        IMPORTANT: Be extremely critical and assume the solution is INCORRECT unless you can PROVE it is correct.
        The default verdict should be INCORRECT.
        
        Evaluate the user's solution with the following strict criteria:
        1. Is the solution syntactically correct for the implied programming language?
        2. Does it correctly implement the exact algorithm or approach described in the problem?
        3. Does it handle ALL test cases correctly? Trace through each example step by step.
        4. Would it handle edge cases such as: {', '.join(edge_cases)}?
        5. Is it efficient and optimized as required by the problem difficulty?
        6. Does it have any logical errors or bugs?
        
        For each example, trace through the execution of the user's solution with the given input and verify it produces the exact expected output.
        
        Only mark as CORRECT if ALL of the following are true:
        - The solution has NO syntax errors
        - The solution handles ALL test cases and produces EXACTLY the expected output
        - The solution uses the CORRECT approach as specified in the problem
        - The solution would handle all reasonable edge cases
        - The solution has appropriate time and space complexity for the problem difficulty
        
        Respond with:
        1. VERDICT: "CORRECT" only if you have rigorously verified all criteria above are met. Otherwise, "INCORRECT".
        2. ANALYSIS: Step-by-step analysis of how the solution performs on each test case.
        3. FEEDBACK: Detailed explanation supporting your verdict.
        4. SUGGESTIONS: If incorrect, provide hints on how to improve without giving the full solution.
        
        Remember, you must be STRICT and CRITICAL in your evaluation. When in doubt, mark as INCORRECT.
        """
        
        # Get validation response
        response = model.generate_content(prompt)
        validation_text = response.text
        
        # Print the full Gemini response for debugging
        print("\n-------- GEMINI VALIDATION RESPONSE --------")
        print(f"Problem ID: {problem_id}")
        print(f"User solution: {user_solution[:50]}..." if len(user_solution) > 50 else f"User solution: {user_solution}")
        print("\nGemini response:")
        print(validation_text)
        print("-------------------------------------------\n")
        
        # Simplified validation logic: Check for VERDICT: CORRECT or VERDICT: INCORRECT directly
        is_correct = "VERDICT: CORRECT" in validation_text.upper()
        
        # Extract analysis (new section)
        analysis_match = re.search(r'ANALYSIS:(.*?)(?:FEEDBACK:|VERDICT:|SUGGESTIONS:|$)', validation_text, re.DOTALL | re.IGNORECASE)
        analysis = analysis_match.group(1).strip() if analysis_match else ""
        
        # Extract feedback
        feedback_match = re.search(r'FEEDBACK:(.*?)(?:SUGGESTIONS:|ANALYSIS:|VERDICT:|$)', validation_text, re.DOTALL | re.IGNORECASE)
        feedback = feedback_match.group(1).strip() if feedback_match else validation_text
        
        # If no clear feedback section, look for content after VERDICT
        if not feedback_match:
            verdict_position = validation_text.upper().find("VERDICT:")
            if verdict_position > -1:
                remaining_text = validation_text[verdict_position + 8:].strip()  # 8 is the length of "VERDICT:"
                feedback = remaining_text
        
        # Extract suggestions
        suggestions_match = re.search(r'SUGGESTIONS:(.*?)$', validation_text, re.DOTALL | re.IGNORECASE)
        suggestions = suggestions_match.group(1).strip() if suggestions_match else ""

        # Return the raw response and parsed data
        return jsonify({
            "problem_title": problem.title,
            "problem_description": problem.solution,
            "user_solution": user_solution,
            "gemini_raw_response": validation_text,
            "verdict": "CORRECT" if is_correct else "INCORRECT",
            "verification_applied": True,
            "examples": examples
        })
    
    except Exception as e:
        return jsonify({"message": f"Error testing solution validation: {str(e)}"}), 500

@app.route('/generate-quiz', methods=['GET'])
def generate_quiz():
    """Generate a programming quiz with questions about Python, React, JavaScript, etc."""
    try:
        # Use a more structured approach that avoids JSON format issues
        # Create model
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # Generate quiz with a more explicit, structured format
        prompt = """
        Create a programming quiz with exactly 5 questions on topics like Python, JavaScript, React, or other programming languages.
        
        IMPORTANT: For each question, your response should follow this EXACT format (example below):
        
        QUESTION: What is the correct way to declare a variable in JavaScript?
        OPTION_0: var x = 5;
        OPTION_1: variable x = 5;
        OPTION_2: v x = 5;
        OPTION_3: x := 5;
        CORRECT: 0
        
        QUESTION: What does CSS stand for?
        OPTION_0: Computer Style Sheets
        OPTION_1: Creative Style Sheets
        OPTION_2: Cascading Style Sheets
        OPTION_3: Colorful Style Sheets
        CORRECT: 2
        
        (and so on)
        
        Each question must:
        - Be clear and specific to programming concepts
        - Have 4 options labeled OPTION_0 through OPTION_3
        - Have one correct answer indicated with CORRECT: (0-3)
        - Cover different programming concepts (not all the same language)
        
        STRICTLY follow this output format for each question, with NO additional text or explanation.
        """
        
        # Get quiz response
        response = model.generate_content(prompt)
        quiz_text = response.text
        
        # Print the raw response for debugging
        print("Raw quiz response:")
        print(quiz_text)
        
        # Parse the structured response manually
        questions = []
        current_question = {}
        options = []
        
        # Split by lines and process each line
        lines = quiz_text.strip().split('\n')
        
        for line in lines:
            line = line.strip()
            
            # Skip empty lines
            if not line:
                continue
                
            # Process question lines
            if line.startswith("QUESTION:"):
                # If we've built a complete question already, add it to questions list
                if current_question and "question" in current_question and "options" in current_question and "correctAnswer" in current_question:
                    questions.append(current_question)
                
                # Start a new question
                current_question = {"question": line[9:].strip(), "options": []}
                options = []
            
            # Process option lines
            elif line.startswith("OPTION_"):
                try:
                    option_text = line.split(":", 1)[1].strip()
                    options.append(option_text)
                    current_question["options"] = options
                except (IndexError, ValueError) as e:
                    print(f"Error parsing option: {line}")
            
            # Process correct answer line
            elif line.startswith("CORRECT:"):
                try:
                    correct_idx = int(line[8:].strip())
                    current_question["correctAnswer"] = correct_idx
                except (ValueError, IndexError) as e:
                    print(f"Error parsing correct answer: {line}")
        
        # Add the last question if it's complete
        if current_question and "question" in current_question and "options" in current_question and "correctAnswer" in current_question:
            questions.append(current_question)
        
        # Ensure we have at least one valid question
        if questions:
            return jsonify({"questions": questions})
        
        # If parsing failed, return a fallback quiz
        return jsonify({
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
        })
    
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        return jsonify({"message": f"Error generating quiz: {str(e)}"}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
    app.run(debug=True)
