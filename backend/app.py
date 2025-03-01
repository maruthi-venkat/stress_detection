from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from datetime import datetime
import bcrypt
import numpy as np
import os
from data_processor import DataProcessor
from model_trainer import ModelTrainer
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
jwt = JWTManager(app)

# MongoDB Atlas connection
MONGODB_URI = os.getenv('MONGODB_URI')
try:
    client = MongoClient(MONGODB_URI)
    # Verify connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB Atlas!")
except Exception as e:
    print(f"Error connecting to MongoDB Atlas: {str(e)}")
    raise e

db = client['stress_assessment']

# Initialize components
data_processor = DataProcessor()
model_trainer = ModelTrainer()

# Load and preprocess data to fit the scaler
try:
    print("Loading dataset and fitting scaler...")
    X_train, _, _, y_train, _, _ = data_processor.load_and_preprocess_data('StressLevelDataset.csv')
    print("Dataset loaded and scaler fitted successfully!")
except Exception as e:
    print(f"Error loading dataset: {str(e)}")

# Load the trained model
try:
    print("Loading model...")
    model_trainer.load_model()
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {str(e)}")

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if db.users.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already exists'}), 400
    
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    user = {
        'email': data['email'],
        'password': hashed_password,
        'name': data['name'],
        'created_at': datetime.utcnow()
    }
    
    db.users.insert_one(user)
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = db.users.find_one({'email': data['email']})
    
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({'token': access_token, 'user': {'email': user['email'], 'name': user['name']}}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/stress-assessment', methods=['POST'])
@jwt_required()
def submit_assessment():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'answers' not in data:
            return jsonify({'error': 'No answers provided'}), 400
            
        answers = data['answers']
        print("Received answers:", answers)
        
        # Map questionnaire answers to feature names
        feature_mapping = {
            'anxiety_level': 'q1',
            'self_esteem': 'q2',
            'mental_health_history': 'q3',
            'depression': 'q4',
            'headache': 'q5',
            'blood_pressure': 'q6',
            'sleep_quality': 'q7',
            'breathing_problem': 'q8',
            'noise_level': 'q9',
            'living_conditions': 'q10',
            'safety': 'q11',
            'basic_needs': 'q12',
            'academic_performance': 'q13',
            'study_load': 'q14',
            'teacher_student_relationship': 'q15',
            'future_career_concerns': 'q16',
            'social_support': 'q17',
            'peer_pressure': 'q18',
            'extracurricular_activities': 'q19',
            'bullying': 'q20'
        }
        
        # Create dictionary with proper feature names
        user_responses = {}
        for feature, q_num in feature_mapping.items():
            value = answers.get(q_num, 0)
            if not isinstance(value, (int, float)):
                try:
                    value = float(value)
                except (ValueError, TypeError):
                    value = 0
            user_responses[feature] = value
            
        print("Mapped features:", user_responses)
        
        # Preprocess the input using the same scaler used during training
        scaled_input = data_processor.preprocess_user_input(user_responses)
        print("Scaled input:", scaled_input)
        
        # Make prediction using the model
        try:
            prediction = model_trainer.predict(scaled_input)[0]  # This will return 'low', 'mid', or 'high'
            print(f"Prediction result: {prediction}")
            
        except Exception as e:
            print(f"Prediction error: {str(e)}")
            return jsonify({'error': 'Error making prediction'}), 500
        
        # Store assessment in database
        assessment = {
            'user_id': user_id,
            'answers': answers,
            'processed_features': user_responses,
            'stress_level': prediction,
            'timestamp': datetime.utcnow()
        }
        
        db.assessments.insert_one(assessment)
        
        return jsonify({
            'message': 'Assessment submitted successfully',
            'stress_level': prediction.capitalize()
        }), 201
        
    except Exception as e:
        print(f"Error in assessment submission: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/user-history', methods=['GET'])
@jwt_required()
def get_user_history():
    user_id = get_jwt_identity()
    assessments = list(db.assessments.find(
        {'user_id': user_id},
        {'_id': 0, 'answers': 1, 'stress_level': 1, 'timestamp': 1}
    ))
    return jsonify(assessments), 200

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    doctors = list(db.doctors.find({}, {'_id': 0}))
    return jsonify(doctors), 200

if __name__ == '__main__':
    # Add some sample doctors if none exist
    if db.doctors.count_documents({}) == 0:
        sample_doctors = [
            {
                'name': 'Dr. Sarah Johnson',
                'specialization': 'Psychiatrist',
                'experience': '15 years',
                'rating': 4.8,
                'image': 'doctor1.jpg',
                'bio': 'Specializes in stress and anxiety management'
            },
            {
                'name': 'Dr. Michael Chen',
                'specialization': 'Clinical Psychologist',
                'experience': '12 years',
                'rating': 4.7,
                'image': 'doctor2.jpg',
                'bio': 'Expert in cognitive behavioral therapy'
            }
        ]
        db.doctors.insert_many(sample_doctors)
    
    app.run(debug=True)
