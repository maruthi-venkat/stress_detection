from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class DatabaseHandler:
    def __init__(self):
        self.client = MongoClient(os.getenv('MONGODB_URI'))
        self.db = self.client['stress_assessment']
        self.responses = self.db['user_responses']

    def save_response(self, user_responses, stress_level):
        document = {
            'timestamp': datetime.now(),
            'responses': user_responses,
            'predicted_stress_level': float(stress_level)
        }
        return self.responses.insert_one(document)

    def get_all_responses(self):
        return list(self.responses.find({}, {'_id': 0})) 

    def __del__(self):
        if hasattr(self, 'client'):
            self.client.close()