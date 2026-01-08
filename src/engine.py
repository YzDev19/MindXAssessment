import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score

class ComplianceEngine:
    def __init__(self, data_path):
        # Load data once when the class is initialized
        self.data = pd.read_csv(data_path)
        self.model_pipeline = None
        self.target_intensity = None

    def train_model(self):
        # Identifying categorical and numerical columns_
        X = self.data[['ship_type', 'distance', 'fuel_consumption']]
        y = self.data['CO2_emissions']
        
        # Create preprocessing pipelines
        preprocessor = ColumnTransformer(
            transformers=[
                ('cat', OneHotEncoder(), ['ship_type']),
                ('num', 'passthrough', ['distance', 'fuel_consumption'])
            ])
        
        # pipeline
        self.model_pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('regressor', LinearRegression())
        ])
        
        # Split data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train the model
        self.model_pipeline.fit(X_train, y_train)
        
        # Make predictions
        y_pred = self.model_pipeline.predict(X_test)
        
        # Evaluate the model
        score = r2_score(y_test, y_pred)
        print(f"Model Training Done")
        print(f'R^2 Score: {score}')
        
        return score

    def calculate_compliance(self):
        # Calculate GHG Intensity
        self.data['GHG Intensity'] = self.data['CO2_emissions'] / self.data['distance']

        # Regulatory Compliance (5% reduction)
        current_avg_intensity = self.data['GHG Intensity'].mean()
        self.target_intensity = current_avg_intensity * 0.95

        print(f"Current Fleet Average: {current_avg_intensity:.2f}")
        print(f"2026 Compliance Target: {self.target_intensity:.2f}")

        # Compliance Balance Calc
        self.data['Compliance Balance'] = self.target_intensity - self.data['GHG Intensity'] 
        self.data['Status'] = self.data['Compliance Balance'].apply(lambda x: 'Surplus' if x >= 0 else 'Deficit') 

    def save_results(self, output_path):
        self.data.to_csv(output_path, index=False)
        print(f"Compliance data saved to {output_path}")

if __name__ == "__main__":
    # Initialize the engine
    engine = ComplianceEngine('data/mindx test dataset.csv')
    
    # Run the steps
    engine.train_model()
    engine.calculate_compliance()
    engine.save_results('data/processed_compliance.csv')