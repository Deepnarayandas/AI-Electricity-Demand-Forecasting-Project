from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import joblib
import numpy as np
import math

from tensorflow.keras.models import load_model

# -----------------------------
# Initialize API
# -----------------------------

app = FastAPI(
    title="AI Electricity Demand Forecasting API",
    version="2.0"
)

# -----------------------------
# Enable CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load Models
# -----------------------------

xgb_model = joblib.load("models/xgb_model.pkl")
lstm_model = load_model("models/lstm_model.h5", compile=False)
scaler = joblib.load("models/scaler.pkl")

# -----------------------------
# Input Schema
# -----------------------------

class PowerInput(BaseModel):

    temp: float
    dwpt: float
    rhum: float
    wdir: float
    wspd: float
    pres: float

    year: int
    month: int
    day: int
    hour: int
    minute: int

    moving_avg_3: float


# -----------------------------
# Utility Function
# -----------------------------

def hybrid_predict(features_df):

    scaled = scaler.transform(features_df)

    xgb_pred = xgb_model.predict(scaled)

    lstm_input = scaled.reshape((scaled.shape[0], 1, scaled.shape[1]))
    lstm_pred = lstm_model.predict(lstm_input).flatten()

    final = (0.7 * xgb_pred) + (0.3 * lstm_pred)

    value = float(final[0])

    if math.isnan(value) or math.isinf(value):
        value = 0.0

    return value


# -----------------------------
# Home
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "AI Electricity Demand Forecasting API running 🚀"
    }


# -----------------------------
# Status API
# -----------------------------

@app.get("/status")
def status():
    return {
        "status": "running",
        "model": "Hybrid (XGBoost + LSTM)"
    }


# -----------------------------
# Main Prediction
# -----------------------------

@app.post("/predict")
def predict(data: PowerInput):

    try:

        features = pd.DataFrame([data.dict()])

        result = hybrid_predict(features)

        # Demand level
        if result < 2500:
            level = "Low"
        elif result < 4500:
            level = "Medium"
        else:
            level = "High"

        # Peak alert
        peak = True if result > 5000 else False

        return {
            "predicted_power_demand": round(result, 2),
            "unit": "MW",
            "demand_level": level,
            "peak_alert": peak
        }

    except Exception as e:
        return {"error": str(e)}


# -----------------------------
# Batch Prediction
# -----------------------------

@app.post("/predict-batch")
def predict_batch(data: list[PowerInput]):

    results = []

    for item in data:
        df = pd.DataFrame([item.dict()])
        value = hybrid_predict(df)
        results.append(round(value, 2))

    return {
        "predictions": results
    }


# -----------------------------
# 24 Hour Forecast
# -----------------------------

@app.post("/forecast-24h")
def forecast(data: PowerInput):

    base = data.dict()
    predictions = []

    for hour in range(24):

        base["hour"] = hour

        df = pd.DataFrame([base])
        value = hybrid_predict(df)

        predictions.append(round(value, 2))

    return {
        "forecast_24h": predictions
    }


# -----------------------------
# Metrics (Static for demo)
# -----------------------------

@app.get("/metrics")
def metrics():
    return {
        "MAE": 120,
        "RMSE": 180,
        "R2": 0.92,
        "Accuracy": "92%"
    }