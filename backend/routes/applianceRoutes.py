from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
import joblib
from tensorflow.keras.models import load_model

router = APIRouter()

# ✅ Load trained models (FIX APPLIED)
xgb_model = joblib.load("models/xgb_model.pkl")
lstm_model = load_model("models/lstm_model.h5", compile=False)  # 🔥 FIX
scaler = joblib.load("models/scaler.pkl")

# Request schema
class ApplianceInput(BaseModel):
    voltage: float
    current: float
    power_factor: float
    hour: int

# API: Predict appliance consumption
@router.post("/predict")
def predict_appliance(data: ApplianceInput):
    try:
        # Feature engineering
        power = data.voltage * data.current * data.power_factor

        features = np.array([
            [data.voltage, data.current, data.power_factor, data.hour, power]
        ])

        scaled = scaler.transform(features)

        # XGBoost prediction
        xgb_pred = xgb_model.predict(scaled)[0]

        # LSTM prediction
        lstm_input = scaled.reshape((1, 1, scaled.shape[1]))
        lstm_pred = lstm_model.predict(lstm_input, verbose=0)[0][0]  # ✅ cleaner

        # Hybrid prediction
        final_pred = (xgb_pred + lstm_pred) / 2

        return {
            "power": round(power, 2),
            "xgb_prediction": float(xgb_pred),
            "lstm_prediction": float(lstm_pred),
            "final_prediction": float(final_pred)
        }

    except Exception as e:
        return {"error": str(e)}