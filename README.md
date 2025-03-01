# Stress Detection System using CatBoost

A web-based stress detection and management system that uses the CatBoost machine learning algorithm to assess and monitor stress levels. The system provides personalized recommendations and connects users with mental health professionals.

## Features

- 🔐 User Authentication System
- 📊 Stress Level Assessment
- 📈 Historical Stress Level Tracking
- 💡 Personalized Recommendations
- 👨‍⚕️ Professional Help Directory
- 📱 Responsive Dashboard
- 🔒 Secure Data Storage with MongoDB Atlas

## Tech Stack

### Backend
- Python 3.x
- Flask (Web Framework)
- CatBoost (Machine Learning)
- MongoDB Atlas (Database)
- JWT (Authentication)

### Frontend
- React.js
- Material-UI
- Chart.js
- Axios

## Installation

### Prerequisites
- Python 3.x
- Node.js
- MongoDB Atlas Account
- Git

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd Stress_detection_CATboost
```

2. Create and activate virtual environment
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Unix or MacOS
source venv/bin/activate
```

3. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Configure environment variables
Create a `.env` file in the backend directory with:
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET_KEY=your_secret_key
```

### Frontend Setup

1. Install dependencies
```bash
cd frontend
npm install
```

2. Start development server
```bash
npm start
```

## Running the Application

1. Start the backend server
```bash
cd backend
python app.py
```

2. Start the frontend development server (in a new terminal)
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
Stress_detection_CATboost/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── db_handler.py          # Database operations
│   ├── data_processor.py      # Data preprocessing
│   ├── model_trainer.py       # CatBoost model
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/         # API services
│   │   └── App.js            # Main React app
│   └── package.json          # Node.js dependencies
└── README.md
```

## API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `POST /api/stress-assessment` - Submit stress assessment
- `GET /api/user-history` - Get user's assessment history
- `GET /api/doctors` - Get list of mental health professionals

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- Environment variables for sensitive data
- Password hashing with bcrypt
- JWT-based authentication
- MongoDB Atlas security features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- CatBoost team for their machine learning library
- MongoDB Atlas for database hosting
- Material-UI for the frontend components
