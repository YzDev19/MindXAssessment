import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score

def train_model(data_path):
    # Load data
    data = pd.read_csv(data_path)

    # Identifying  categorical and numerical columns
    X = data[['ship_type', 'distance', 'fuel_consumption']]
    y = data['CO2_emissions']
    
    # Create preprocessing pipelines
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(), ['ship_type']),
            ('num', 'passthrough', ['distance', 'fuel_consumption'])
        ])
    
    # pipeline
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', LinearRegression())
    ])
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train the model
    model_pipeline.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model_pipeline.predict(X_test)
    
    # Evaluate the model
    score = r2_score(y_test, y_pred)
    print(f"Model Training Done")
    print(f'R^2 Score: {score}')
    
    return model_pipeline

if __name__ == "__main__":
    train_model('data/mindx test dataset.csv')


def compliance_data(data_path, output_path):
    data = pd.read_csv(data_path)

    # Calculate GHG Intensity
    data['GHG Intensity'] = data['CO2_emissions'] / data['distance']

    #Regulatory Compliance(5% reduction)
    current_avg_intensity = data['GHG Intensity'].mean()
    target_intensity = current_avg_intensity * 0.95

    print(f"Current Fleet Average: {current_avg_intensity:.2f}")
    print(f"2026 Compliance Target: {target_intensity:.2f}")

    #Compliance Balance Calc
    data['Compliance Balance'] = target_intensity - data['GHG Intensity'] 
    data['Status'] = data['Compliance Balance'].apply(lambda x: 'Surplus' if x >= 0 else 'Deficit') 

    data.to_csv(output_path, index=False)
    print(f"Compliance data saved to {output_path}")

    if __name__ == "__main__":
        compliance_data('data/mindx test dataset.csv', 'data/processed_compliance.csv')