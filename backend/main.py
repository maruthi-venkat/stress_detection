from data_processor import DataProcessor
from model_trainer import ModelTrainer
from db_handler import DatabaseHandler
from questionnaire import StressQuestionnaire

def train_or_load_model():
    data_processor = DataProcessor()
    model_trainer = ModelTrainer()
    
    try:
        # Try to load existing model
        model_trainer.load_model()
        print("Loaded existing model.")
        # Load data for evaluation
        X_train, X_val, X_test, y_train, y_val, y_test = data_processor.load_and_preprocess_data('StressLevelDataset.csv')
        evaluate_and_print_metrics(model_trainer, X_test, y_test)
    except:
        print("Training new model...")
        # Load and preprocess data
        X_train, X_val, X_test, y_train, y_val, y_test = data_processor.load_and_preprocess_data('StressLevelDataset.csv')
        
        # Perform cross-validation
        cv_score, cv_std = model_trainer.cross_validate(X_train, y_train)
        print(f"\nCross-validation RMSE: {cv_score:.4f} (+/- {cv_std:.4f})")
        
        # Train model with validation set
        model_trainer.train_model(X_train, y_train, X_val, y_val)
        model_trainer.save_model()
        print("Model trained and saved.")
        
        # Evaluate model
        evaluate_and_print_metrics(model_trainer, X_test, y_test)
    
    return data_processor, model_trainer

def evaluate_and_print_metrics(model_trainer, X_test, y_test):
    print("\nModel Evaluation Metrics:")
    print("-" * 50)
    
    metrics = model_trainer.evaluate_model(X_test, y_test)
    
    print(f"Mean Squared Error (MSE): {metrics['MSE']:.4f}")
    print(f"Root Mean Squared Error (RMSE): {metrics['RMSE']:.4f}")
    print(f"Mean Absolute Error (MAE): {metrics['MAE']:.4f}")
    print(f"R-squared Score (R2): {metrics['R2']:.4f}")
    print(f"Classification Accuracy: {metrics['Classification_Accuracy']:.2f}%")
    print(f"Accuracy within 0.5 stress level: {metrics['Accuracy_0.5']:.2f}%")
    print(f"Accuracy within 0.3 stress level: {metrics['Accuracy_0.3']:.2f}%")
    
    print("\nTop 5 Most Important Features:")
    sorted_features = sorted(
        metrics['Feature_Importance'].items(), 
        key=lambda x: x[1], 
        reverse=True
    )[:5]
    for feature, importance in sorted_features:
        print(f"{feature}: {importance:.4f}")
    print("-" * 50)

def main():
    # Initialize components
    data_processor, model_trainer = train_or_load_model()
    db_handler = DatabaseHandler()
    questionnaire = StressQuestionnaire()
    
    # Convert string prediction to float value
    stress_level_mapping = {
        'low': 1.0,
        'mid': 2.0,
        'high': 3.0
    }
    
    while True:
        # Conduct questionnaire
        user_responses = questionnaire.conduct_questionnaire()
        
        # Preprocess user input
        processed_input = data_processor.preprocess_user_input(user_responses)
        
        # Get prediction
        prediction = model_trainer.predict(processed_input)[0]
        
        # Convert prediction to float
        stress_level_float = stress_level_mapping.get(prediction, 2.0)  # default to 2.0 if unknown
        
        # Save to database
        db_handler.save_response(user_responses, stress_level_float)
        
        # Display results
        print(f"\nBased on your responses, your stress level is: {prediction}")
        print("\nStress Level Categories:")
        print("- Low: Minimal stress levels, maintaining good mental health")
        print("- Mid: Moderate stress levels, may need some stress management")
        print("- High: High stress levels, consider seeking professional support")
        
        # Ask if user wants to do another assessment
        if input("\nWould you like to do another assessment? (y/n): ").lower() != 'y':
            break

if __name__ == "__main__":
    main() 