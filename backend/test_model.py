import pandas as pd
import joblib
import numpy as np
from tensorflow.keras.models import load_model

# Load models
xgb_model = joblib.load("models/xgb_model.pkl")
lstm_model = load_model("models/lstm_model.h5", compile=False)
scaler = joblib.load("models/scaler.pkl")

# Sample input
sample = pd.DataFrame([{
    "temp": 32,
    "dwpt": 24,
    "rhum": 65,
    "wdir": 180,
    "wspd": 10,
    "pres": 1012,
    "year": 2025,
    "month": 6,
    "day": 15,
    "hour": 18,
    "minute": 0,
    "moving_avg_3": 3500
}])

# Scale
scaled = scaler.transform(sample)

# XGBoost
xgb_pred = xgb_model.predict(scaled)

# LSTM
lstm_input = scaled.reshape((scaled.shape[0],1,scaled.shape[1]))
lstm_pred = lstm_model.predict(lstm_input).flatten()

# Hybrid
final = (0.7 * xgb_pred) + (0.3 * lstm_pred)

print("Final Prediction:", final)