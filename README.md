# MIND X INTERSHIP ASSESSMENT

## Overview
This repository contains a full-stack solution for managing FuelEU Maritime Compliance. It transforms raw vessel data into an interactive dashboard, allowing fleet managers to monitor carbon intensity and simulate "pooling" strategies to minimize financial penalties.

## Architecture
Backend:Python (FastAPI) + Scikit-Learn (Linear Regression Pipeline).
Frontend: React + Tailwind CSS (via Vite).
Data Processing: Pandas for GHG intensity calculations and regulatory benchmarking.

## Features
1. Compliance Engine: Automates the calculation of Compliance Balance  based on 2026 targets.
2. Predictive Modeling: Uses a Linear Regression pipeline to benchmark fuel efficiency.
3. Pooling Simulator: Interactive widget to calculate offsets between Deficit and Surplus vessels.

## Model Perfomance
R^2 Score: 0.9950865328896986
Current Fleet Average: 78.85
2026 Compliance Target: 74.91

## Setup Instructions

### Prerequisites
* Python 3.8+
* Node.js & npm

---

### 1. Backend Setup (Python)
Navigate to the root directory of the project:

```bash
# 1. Create a virtual environment (Optional but recommended)
python -m venv venv

# 2. Activate the environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the API Server
python main.py

# The API server will start at http://127.0.0.1:8000

### 2. Frontend Setup (React)
Open a new terminal window and navigate to the frontend folder:

```bash
# 1. Enter the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the Dashboard
npm run dev