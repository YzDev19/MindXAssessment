from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json

app = FastAPI()

#Enable CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Compliance Engine API is running"}

@app.get("/api/fleet-status")
def get_fleet_status():
    try:
        # load the compliance data
        df = pd.read_csv('data/processed_compliance.csv')
        
        # Convert DataFrame to JSON format 
        data = df.to_dict(orient='records')
        
        return {"data": data}
    except FileNotFoundError:
        return {"error": "Data not found. Please run src/engine.py first."}

if __name__ == "__main__":
    import uvicorn
    # server run on http://127.0.0.1:8000
    uvicorn.run(app, host="127.0.0.1", port=8000)