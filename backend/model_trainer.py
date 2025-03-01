import catboost as cb
import joblib
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error, accuracy_score
import numpy as np
from sklearn.model_selection import cross_val_score

class ModelTrainer:
    def __init__(self):
        self.model = cb.CatBoostRegressor(
            iterations=1000,            # Increased iterations
            learning_rate=0.03,         # Reduced learning rate for better generalization
            depth=6,
            loss_function='RMSE',
            eval_metric='RMSE',
            random_seed=42,
            verbose=False,
            early_stopping_rounds=50,   # Added early stopping
            l2_leaf_reg=3,             # L2 regularization
            bootstrap_type='Bernoulli',
            subsample=0.8              # Added subsampling
        )

    def train_model(self, X_train, y_train, X_val=None, y_val=None):
        eval_set = [(X_val, y_val)] if X_val is not None and y_val is not None else None
        self.model.fit(X_train, y_train, eval_set=eval_set)
        
    def cross_validate(self, X, y, cv=5):
        scores = cross_val_score(self.model, X, y, cv=cv, scoring='neg_root_mean_squared_error')
        return -scores.mean(), scores.std()
        
    def save_model(self, path='stress_model.joblib'):
        joblib.dump(self.model, path)
        
    def load_model(self, path='stress_model.joblib'):
        self.model = joblib.load(path)
        
    def predict(self, X):
        numerical_prediction = self.model.predict(X)
        return self._convert_to_category(numerical_prediction)
    
    def _convert_to_category(self, numerical_prediction):
        categories = []
        for pred in numerical_prediction:
            if pred < 0.67:
                categories.append("low")
            elif pred < 1.33:
                categories.append("mid")
            else:
                categories.append("high")
        return categories
    
    def evaluate_model(self, X_test, y_test):
        # Make predictions
        y_pred = self.model.predict(X_test)
        
        # Calculate regression metrics
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        # Calculate classification accuracy
        y_pred_categories = self._convert_to_category(y_pred)
        y_test_categories = self._convert_to_category(y_test)
        classification_accuracy = accuracy_score(y_test_categories, y_pred_categories)
        
        # Calculate accuracy within different tolerances
        accuracy_05 = np.mean(np.abs(y_test - y_pred) <= 0.5) * 100
        accuracy_03 = np.mean(np.abs(y_test - y_pred) <= 0.3) * 100
        
        # Get feature importance
        feature_importance = dict(zip(
            [f"Feature_{i}" for i in range(len(self.model.feature_importances_))],
            self.model.feature_importances_
        ))
        
        return {
            'MSE': mse,
            'RMSE': rmse,
            'MAE': mae,
            'R2': r2,
            'Classification_Accuracy': classification_accuracy * 100,
            'Accuracy_0.5': accuracy_05,
            'Accuracy_0.3': accuracy_03,
            'Feature_Importance': feature_importance
        } 