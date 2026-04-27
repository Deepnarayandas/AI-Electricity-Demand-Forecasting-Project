from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
import math
from tensorflow.keras.models import load_model
import requests
import os
from dotenv import load_dotenv
import uuid
from email.message import EmailMessage
import aiosmtplib

# Routers
from auth import router as auth_router
from routes.applianceRoutes import router as appliance_router

# INIT
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

app = FastAPI(
    title="AI Electricity Demand Forecasting API",
    version="5.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTERS
app.include_router(auth_router, prefix="/api/auth")
app.include_router(appliance_router, prefix="/api/appliance")

# EMAIL FUNCTION
async def send_email(to_email, subject, html_content, file_path=None):
    message = EmailMessage()
    message["From"] = EMAIL_USER
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(html_content, subtype="html")

    if file_path and os.path.exists(file_path):
        with open(file_path, "rb") as f:
            message.add_attachment(
                f.read(),
                maintype="application",
                subtype="octet-stream",
                filename=os.path.basename(file_path),
            )

    await aiosmtplib.send(
        message,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username=EMAIL_USER,
        password=EMAIL_PASS,
    )

# CONTACT API
@app.post("/api/contact")
async def contact(
    name: str = Form(...),
    email: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...),
    file: UploadFile = File(None),
):
    ticket_id = "TICKET-" + str(uuid.uuid4())[:8].upper()

    file_path = None
    if file:
        os.makedirs("uploads", exist_ok=True)
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())

    await send_email(
        EMAIL_USER,
        f"New Ticket {ticket_id}: {subject}",
        f"<p>{message}</p>",
        file_path
    )

    await send_email(
        email,
        f"Ticket {ticket_id}",
        f"<p>Your request received</p>"
    )

    return {"success": True, "ticket_id": ticket_id}

# CHATBOT
class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
def chat(req: ChatRequest):
    res = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "openrouter/auto",
            "messages": [
                {"role": "system", "content": "AI assistant for electricity forecasting"},
                {"role": "user", "content": req.message}
            ]
        }
    )

    return {"response": res.json()["choices"][0]["message"]["content"]}


# LOAD MODELS
xgb_model = joblib.load("models/xgb_model.pkl")
lstm_model = load_model("models/lstm_model.h5", compile=False)
scaler = joblib.load("models/scaler.pkl")

# INPUT SCHEMA (MATCH FRONTEND)
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

# HYBRID MODEL
def hybrid_predict(df):
    scaled = scaler.transform(df)

    xgb_pred = xgb_model.predict(scaled)
    lstm_input = scaled.reshape((scaled.shape[0], 1, scaled.shape[1]))
    lstm_pred = lstm_model.predict(lstm_input, verbose=0).flatten()

    final = (0.7 * xgb_pred) + (0.3 * lstm_pred)
    value = float(final[0])

    return 0.0 if math.isnan(value) or math.isinf(value) else value

# BASIC ROUTES
@app.get("/")
def home():
    return {"message": "🚀 API Running"}

# MAIN PREDICTION API
@app.post("/api/predict")
def predict(data: PowerInput):

    df = pd.DataFrame([data.dict()])
    result = hybrid_predict(df)

    level = "Low" if result < 2500 else "Medium" if result < 4500 else "High"

    return {
        "predicted_power_demand": round(result, 2),
        "unit": "MW",
        "demand_level": level,
        "peak_alert": result > 5000
    }

# APPLIANCE ENERGY
@app.post("/api/appliance")
def appliance_prediction(data: dict):

    appliance_power = {
        "ac": 1500,
        "fan": 75,
        "heater": 2000,
        "tv": 120,
        "fridge": 200,
        "light": 10
    }

    total_energy = 0
    details = []

    for key, item in data.items():
        quantity = item.get("quantity", 0)
        hours = item.get("hours", 0)

        if quantity > 0 and hours > 0:
            power = appliance_power.get(key, 0)
            energy = (power * quantity * hours) / 1000

            total_energy += energy
            details.append({
                "appliance": key,
                "energy": round(energy, 2)
            })

    level = "High" if total_energy > 10 else "Medium" if total_energy > 5 else "Normal"

    return {
        "totalEnergy": round(total_energy, 2),
        "level": level,
        "details": details
    }

@app.get("/api/weather")
def get_weather(lat: float, lon: float):
    try:
        # Clean API key
        API_KEY = os.getenv("OPENWEATHER_API_KEY", "").strip()

        if not API_KEY:
            return {"error": "API key not loaded"}

        # OpenWeather URL (ONLY THIS)
        url = (
            f"https://api.openweathermap.org/data/2.5/weather"
            f"?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
        )

        res = requests.get(url)
        data = res.json()

        print("🌤 OPENWEATHER RESPONSE:", data)

        #  Handle invalid key / bad response
        if res.status_code != 200 or "main" not in data:
            return {
                "error": "OpenWeather API failed",
                "details": data
            }

        # Extract values safely
        temp = data["main"]["temp"]
        humidity = data["main"]["humidity"]
        pressure = data["main"]["pressure"]
        wind_speed = data["wind"]["speed"]
        wind_deg = data["wind"].get("deg", 0)

        # 🌡 Dew Point calculation
        dew_point = temp - ((100 - humidity) / 5)

        # ⏱ Current Time
        from datetime import datetime
        now = datetime.now()

        # ⚡ Moving Avg (approx)
        moving_avg = temp * 80 + humidity * 10 + wind_speed * 5

        return {
            "temp": temp,
            "dwpt": round(dew_point, 2),
            "rhum": humidity,
            "wdir": wind_deg,
            "wspd": wind_speed,
            "pres": pressure,
            "year": now.year,
            "month": now.month,
            "day": now.day,
            "hour": now.hour,
            "minute": now.minute,
            "moving_avg_3": round(moving_avg, 2)
        }

    except Exception as e:
        print(" WEATHER ERROR:", str(e))
        return {"error": str(e)}