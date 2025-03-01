import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

class DataProcessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.feature_columns = [
            'anxiety_level', 'self_esteem', 'mental_health_history', 
            'depression', 'headache', 'blood_pressure', 'sleep_quality',
            'breathing_problem', 'noise_level', 'living_conditions',
            'safety', 'basic_needs', 'academic_performance', 'study_load',
            'teacher_student_relationship', 'future_career_concerns',
            'social_support', 'peer_pressure', 'extracurricular_activities',
            'bullying'
        ]

    def load_and_preprocess_data(self, file_path):
        # Load the dataset
        df = pd.read_csv(file_path)
        
        # Split features and target
        X = df[self.feature_columns]
        y = df['stress_level']
        
        # Scale the features
        X_scaled = self.scaler.fit_transform(X)
        
        # Split into train, validation, and test sets
        X_train, X_temp, y_train, y_temp = train_test_split(
            X_scaled, y, test_size=0.3, random_state=42
        )
        
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.5, random_state=42
        )
        
        return X_train, X_val, X_test, y_train, y_val, y_test

    def preprocess_user_input(self, user_responses):
        # Convert user responses to DataFrame
        df = pd.DataFrame([user_responses], columns=self.feature_columns)
        
        # Scale the input
        scaled_input = self.scaler.transform(df)
        
        return scaled_input 