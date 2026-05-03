# # from fastapi import FastAPI, File, UploadFile, Form
# # from fastapi.middleware.cors import CORSMiddleware
# # from pydantic import BaseModel
# # import pandas as pd
# # import joblib
# # import numpy as np
# # import math
# # from tensorflow.keras.models import load_model
# # import requests
# # import os
# # from dotenv import load_dotenv
# # import uuid
# # from email.message import EmailMessage
# # import aiosmtplib

# # # Routers
# # from auth import router as auth_router
# # from routes.applianceRoutes import router as appliance_router

# # # INIT
# # load_dotenv()
# # OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
# # EMAIL_USER = os.getenv("EMAIL_USER")
# # EMAIL_PASS = os.getenv("EMAIL_PASS")

# # OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

# # app = FastAPI(
# #     title="AI Electricity Demand Forecasting API",
# #     version="5.0"
# # )

# # # CORS
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # ROUTERS
# # app.include_router(auth_router, prefix="/api/auth")
# # app.include_router(appliance_router, prefix="/api/appliance")

# # # EMAIL FUNCTION
# # async def send_email(to_email, subject, html_content, file_path=None):
# #     message = EmailMessage()
# #     message["From"] = EMAIL_USER
# #     message["To"] = to_email
# #     message["Subject"] = subject
# #     message.set_content(html_content, subtype="html")

# #     if file_path and os.path.exists(file_path):
# #         with open(file_path, "rb") as f:
# #             message.add_attachment(
# #                 f.read(),
# #                 maintype="application",
# #                 subtype="octet-stream",
# #                 filename=os.path.basename(file_path),
# #             )

# #     await aiosmtplib.send(
# #         message,
# #         hostname="smtp.gmail.com",
# #         port=587,
# #         start_tls=True,
# #         username=EMAIL_USER,
# #         password=EMAIL_PASS,
# #     )

# # # CONTACT API
# # @app.post("/api/contact")
# # async def contact(
# #     name: str = Form(...),
# #     email: str = Form(...),
# #     subject: str = Form(...),
# #     message: str = Form(...),
# #     file: UploadFile = File(None),
# # ):
# #     ticket_id = "TICKET-" + str(uuid.uuid4())[:8].upper()

# #     file_path = None
# #     if file:
# #         os.makedirs("uploads", exist_ok=True)
# #         file_path = f"uploads/{file.filename}"
# #         with open(file_path, "wb") as f:
# #             f.write(await file.read())

# #     await send_email(
# #         EMAIL_USER,
# #         f"New Ticket {ticket_id}: {subject}",
# #         f"<p>{message}</p>",
# #         file_path
# #     )

# #     await send_email(
# #         email,
# #         f"Ticket {ticket_id}",
# #         f"<p>Your request received</p>"
# #     )

# #     return {"success": True, "ticket_id": ticket_id}

# # # CHATBOT
# # class ChatRequest(BaseModel):
# #     message: str

# # @app.post("/api/chat")
# # def chat(req: ChatRequest):
# #     res = requests.post(
# #         "https://openrouter.ai/api/v1/chat/completions",
# #         headers={
# #             "Authorization": f"Bearer {OPENROUTER_API_KEY}",
# #             "Content-Type": "application/json"
# #         },
# #         json={
# #             "model": "openrouter/auto",
# #             "messages": [
# #                 {"role": "system", "content": "AI assistant for electricity forecasting"},
# #                 {"role": "user", "content": req.message}
# #             ]
# #         }
# #     )

# #     return {"response": res.json()["choices"][0]["message"]["content"]}


# # # LOAD MODELS
# # xgb_model = joblib.load("models/xgb_model.pkl")
# # lstm_model = load_model("models/lstm_model.h5", compile=False)
# # scaler = joblib.load("models/scaler.pkl")

# # # INPUT SCHEMA (MATCH FRONTEND)
# # class PowerInput(BaseModel):
# #     temp: float
# #     dwpt: float
# #     rhum: float
# #     wdir: float
# #     wspd: float
# #     pres: float
# #     year: int
# #     month: int
# #     day: int
# #     hour: int
# #     minute: int
# #     moving_avg_3: float

# # # HYBRID MODEL
# # def hybrid_predict(df):
# #     scaled = scaler.transform(df)

# #     xgb_pred = xgb_model.predict(scaled)
# #     lstm_input = scaled.reshape((scaled.shape[0], 1, scaled.shape[1]))
# #     lstm_pred = lstm_model.predict(lstm_input, verbose=0).flatten()

# #     final = (0.7 * xgb_pred) + (0.3 * lstm_pred)
# #     value = float(final[0])

# #     return 0.0 if math.isnan(value) or math.isinf(value) else value

# # # BASIC ROUTES
# # @app.get("/")
# # def home():
# #     return {"message": "🚀 API Running"}

# # # MAIN PREDICTION API
# # @app.post("/api/predict")
# # def predict(data: PowerInput):

# #     df = pd.DataFrame([data.dict()])
# #     result = hybrid_predict(df)

# #     level = "Low" if result < 2500 else "Medium" if result < 4500 else "High"

# #     return {
# #         "predicted_power_demand": round(result, 2),
# #         "unit": "MW",
# #         "demand_level": level,
# #         "peak_alert": result > 5000
# #     }

# # # APPLIANCE ENERGY
# # @app.post("/api/appliance")
# # def appliance_prediction(data: dict):

# #     appliance_power = {
# #         "ac": 1500,
# #         "fan": 75,
# #         "heater": 2000,
# #         "tv": 120,
# #         "fridge": 200,
# #         "light": 10
# #     }

# #     total_energy = 0
# #     details = []

# #     for key, item in data.items():
# #         quantity = item.get("quantity", 0)
# #         hours = item.get("hours", 0)

# #         if quantity > 0 and hours > 0:
# #             power = appliance_power.get(key, 0)
# #             energy = (power * quantity * hours) / 1000

# #             total_energy += energy
# #             details.append({
# #                 "appliance": key,
# #                 "energy": round(energy, 2)
# #             })

# #     level = "High" if total_energy > 10 else "Medium" if total_energy > 5 else "Normal"

# #     return {
# #         "totalEnergy": round(total_energy, 2),
# #         "level": level,
# #         "details": details
# #     }

# # @app.get("/api/weather")
# # def get_weather(lat: float, lon: float):
# #     try:
# #         # Clean API key
# #         API_KEY = os.getenv("OPENWEATHER_API_KEY", "").strip()

# #         if not API_KEY:
# #             return {"error": "API key not loaded"}

# #         # OpenWeather URL (ONLY THIS)
# #         url = (
# #             f"https://api.openweathermap.org/data/2.5/weather"
# #             f"?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
# #         )

# #         res = requests.get(url)
# #         data = res.json()

# #         print("🌤 OPENWEATHER RESPONSE:", data)

# #         #  Handle invalid key / bad response
# #         if res.status_code != 200 or "main" not in data:
# #             return {
# #                 "error": "OpenWeather API failed",
# #                 "details": data
# #             }

# #         # Extract values safely
# #         temp = data["main"]["temp"]
# #         humidity = data["main"]["humidity"]
# #         pressure = data["main"]["pressure"]
# #         wind_speed = data["wind"]["speed"]
# #         wind_deg = data["wind"].get("deg", 0)

# #         # 🌡 Dew Point calculation
# #         dew_point = temp - ((100 - humidity) / 5)

# #         # ⏱ Current Time
# #         from datetime import datetime
# #         now = datetime.now()

# #         # ⚡ Moving Avg (approx)
# #         moving_avg = temp * 80 + humidity * 10 + wind_speed * 5

# #         return {
# #             "temp": temp,
# #             "dwpt": round(dew_point, 2),
# #             "rhum": humidity,
# #             "wdir": wind_deg,
# #             "wspd": wind_speed,
# #             "pres": pressure,
# #             "year": now.year,
# #             "month": now.month,
# #             "day": now.day,
# #             "hour": now.hour,
# #             "minute": now.minute,
# #             "moving_avg_3": round(moving_avg, 2)
# #         }

# #     except Exception as e:
# #         print(" WEATHER ERROR:", str(e))
# #         return {"error": str(e)}




# from fastapi import FastAPI, File, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import pandas as pd
# import joblib
# import numpy as np
# import math
# from tensorflow.keras.models import load_model
# import requests
# import os
# from dotenv import load_dotenv
# import uuid
# from email.message import EmailMessage
# import aiosmtplib

# # Routers
# from auth import router as auth_router
# from routes.applianceRoutes import router as appliance_router

# # INIT
# load_dotenv()
# OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
# EMAIL_USER = os.getenv("EMAIL_USER")
# EMAIL_PASS = os.getenv("EMAIL_PASS")
# OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

# app = FastAPI(
#     title="AI Electricity Demand Forecasting API",
#     version="5.0"
# )

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ROUTERS
# app.include_router(auth_router, prefix="/api/auth")
# app.include_router(appliance_router, prefix="/api/appliance")


# # =========================
# # 📧 BREVO EMAIL FUNCTION
# # =========================
# async def send_brevo_email(
#     to_email: str,
#     subject: str,
#     html_content: str,
#     file_path: str = None
# ):
#     sender_email = os.getenv("EMAIL_USER", "").strip()
#     sender_password = os.getenv("EMAIL_PASS", "").strip()

#     if not sender_email or not sender_password:
#         raise Exception("EMAIL_USER or EMAIL_PASS not set in environment")

#     msg = EmailMessage()
#     msg["From"] = sender_email
#     msg["To"] = to_email
#     msg["Subject"] = subject
#     msg.set_content(html_content, subtype="html")

#     if file_path and os.path.exists(file_path):
#         with open(file_path, "rb") as f:
#             msg.add_attachment(
#                 f.read(),
#                 maintype="application",
#                 subtype="octet-stream",
#                 filename=os.path.basename(file_path),
#             )

#     try:
#         await aiosmtplib.send(
#             msg,
#             hostname="smtp-relay.brevo.com",
#             port=587,
#             start_tls=True,
#             username=sender_email,
#             password=sender_password,
#         )
#         print(f"✅ Email sent to {to_email}")
#     except Exception as e:
#         print(f"❌ Brevo Email Error: {e}")
#         raise Exception(f"Failed to send email: {str(e)}")


# # =========================
# # 📩 CONTACT API
# # =========================
# @app.post("/api/contact")
# async def contact(
#     name: str = Form(...),
#     email: str = Form(...),
#     subject: str = Form(...),
#     message: str = Form(...),
#     file: UploadFile = File(None),
# ):
#     ticket_id = "TICKET-" + str(uuid.uuid4())[:8].upper()

#     # Save uploaded file if any
#     file_path = None
#     if file and file.filename:
#         os.makedirs("uploads", exist_ok=True)
#         file_path = f"uploads/{file.filename}"
#         with open(file_path, "wb") as f:
#             f.write(await file.read())

#     try:
#         # ── Email to ADMIN ──
#         await send_brevo_email(
#             to_email=EMAIL_USER,
#             subject=f"📩 New Ticket {ticket_id}: {subject}",
#             html_content=f"""
#             <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 540px;
#                         margin: 40px auto; background: #ffffff;
#                         border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">

#                 <!-- Header -->
#                 <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8);
#                             padding: 28px 32px;">
#                     <h1 style="color: #ffffff; margin: 0; font-size: 20px;">
#                         ⚡ ElectraForecast — Support Ticket
#                     </h1>
#                     <p style="color: #bfdbfe; font-size: 12px; margin: 6px 0 0;">
#                         New ticket received from user
#                     </p>
#                 </div>

#                 <!-- Ticket Info -->
#                 <div style="padding: 28px 32px;">
#                     <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
#                         <tr style="border-bottom: 1px solid #f1f5f9;">
#                             <td style="padding: 12px 0; color: #64748b;
#                                        font-weight: 600; width: 120px;">Ticket ID</td>
#                             <td style="padding: 12px 0; color: #2563eb;
#                                        font-weight: 700; font-size: 16px;">{ticket_id}</td>
#                         </tr>
#                         <tr style="border-bottom: 1px solid #f1f5f9;">
#                             <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Name</td>
#                             <td style="padding: 12px 0; color: #1e293b;">{name}</td>
#                         </tr>
#                         <tr style="border-bottom: 1px solid #f1f5f9;">
#                             <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Email</td>
#                             <td style="padding: 12px 0; color: #1e293b;">{email}</td>
#                         </tr>
#                         <tr style="border-bottom: 1px solid #f1f5f9;">
#                             <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Subject</td>
#                             <td style="padding: 12px 0; color: #1e293b;">{subject}</td>
#                         </tr>
#                     </table>

#                     <!-- Message Box -->
#                     <div style="margin-top: 20px; background: #f8fafc;
#                                 border-left: 4px solid #2563eb;
#                                 padding: 16px 20px; border-radius: 0 10px 10px 0;">
#                         <p style="color: #64748b; font-size: 12px;
#                                   font-weight: 600; margin: 0 0 8px;
#                                   text-transform: uppercase; letter-spacing: 1px;">
#                             Message
#                         </p>
#                         <p style="color: #1e293b; font-size: 14px;
#                                   line-height: 1.7; margin: 0;">
#                             {message}
#                         </p>
#                     </div>
#                 </div>

#                 <!-- Footer -->
#                 <div style="background: #f8fafc; padding: 14px 32px;
#                             border-top: 1px solid #e2e8f0; text-align: center;">
#                     <p style="color: #cbd5e1; font-size: 11px; margin: 0;">
#                         © ElectraForecast · Sent via Brevo Secure Mail
#                     </p>
#                 </div>
#             </div>
#             """,
#             file_path=file_path
#         )

#         # ── Confirmation Email to USER ──
#         await send_brevo_email(
#             to_email=email,
#             subject=f"✅ Ticket Received: {ticket_id} — ElectraForecast",
#             html_content=f"""
#             <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px;
#                         margin: 40px auto; background: #ffffff;
#                         border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">

#                 <!-- Header -->
#                 <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8);
#                             padding: 28px 32px; text-align: center;">
#                     <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">
#                         ⚡ ElectraForecast
#                     </h1>
#                     <p style="color: #bfdbfe; font-size: 12px; margin: 6px 0 0;">
#                         AI Electricity Demand Forecasting System
#                     </p>
#                 </div>

#                 <!-- Body -->
#                 <div style="padding: 36px 32px; text-align: center;">
#                     <!-- Green checkmark circle -->
#                     <div style="width: 64px; height: 64px; background: #dcfce7;
#                                 border-radius: 50%; margin: 0 auto 20px;
#                                 display: flex; align-items: center; justify-content: center;
#                                 font-size: 28px; line-height: 64px;">
#                         ✅
#                     </div>

#                     <h2 style="color: #1e293b; margin: 0 0 8px;">Ticket Submitted!</h2>
#                     <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
#                         Hi <b>{name}</b>, your support request has been received.
#                         Our team will respond within <b>24–48 hours</b>.
#                     </p>

#                     <!-- Ticket ID Box -->
#                     <div style="margin: 28px auto; background: #eff6ff;
#                                 border: 1px solid #bfdbfe; border-radius: 12px;
#                                 padding: 18px 32px; display: inline-block;">
#                         <p style="color: #64748b; font-size: 11px; margin: 0 0 6px;
#                                   text-transform: uppercase; letter-spacing: 2px;">
#                             Your Ticket ID
#                         </p>
#                         <p style="font-size: 22px; font-weight: 800; color: #2563eb;
#                                   margin: 0; letter-spacing: 3px; font-family: monospace;">
#                             {ticket_id}
#                         </p>
#                     </div>

#                     <p style="color: #94a3b8; font-size: 12px;">
#                         Please save this Ticket ID for future reference.
#                     </p>
#                 </div>

#                 <!-- Footer -->
#                 <div style="background: #f8fafc; padding: 14px 32px;
#                             border-top: 1px solid #e2e8f0; text-align: center;">
#                     <p style="color: #cbd5e1; font-size: 11px; margin: 0;">
#                         © ElectraForecast · Sent via Brevo Secure Mail
#                     </p>
#                 </div>
#             </div>
#             """
#         )

#     except Exception as e:
#         print("❌ Contact Email Error:", e)
#         raise HTTPException(
#             status_code=500,
#             detail=f"Email sending failed: {str(e)}"
#         )

#     return {"success": True, "ticket_id": ticket_id}


# # =========================
# # 🤖 CHATBOT
# # =========================
# class ChatRequest(BaseModel):
#     message: str

# @app.post("/api/chat")
# def chat(req: ChatRequest):
#     res = requests.post(
#         "https://openrouter.ai/api/v1/chat/completions",
#         headers={
#             "Authorization": f"Bearer {OPENROUTER_API_KEY}",
#             "Content-Type": "application/json"
#         },
#         json={
#             "model": "openrouter/auto",
#             "messages": [
#                 {"role": "system", "content": "AI assistant for electricity forecasting"},
#                 {"role": "user", "content": req.message}
#             ]
#         }
#     )
#     return {"response": res.json()["choices"][0]["message"]["content"]}


# # =========================
# # 🧠 LOAD MODELS
# # =========================
# xgb_model = joblib.load("models/xgb_model.pkl")
# lstm_model = load_model("models/lstm_model.h5", compile=False)
# scaler = joblib.load("models/scaler.pkl")


# # =========================
# # 📐 INPUT SCHEMA
# # =========================
# class PowerInput(BaseModel):
#     temp: float
#     dwpt: float
#     rhum: float
#     wdir: float
#     wspd: float
#     pres: float
#     year: int
#     month: int
#     day: int
#     hour: int
#     minute: int
#     moving_avg_3: float


# # =========================
# # ⚡ HYBRID MODEL
# # =========================
# def hybrid_predict(df):
#     scaled = scaler.transform(df)
#     xgb_pred = xgb_model.predict(scaled)
#     lstm_input = scaled.reshape((scaled.shape[0], 1, scaled.shape[1]))
#     lstm_pred = lstm_model.predict(lstm_input, verbose=0).flatten()
#     final = (0.7 * xgb_pred) + (0.3 * lstm_pred)
#     value = float(final[0])
#     return 0.0 if math.isnan(value) or math.isinf(value) else value


# # =========================
# # 🏠 HOME
# # =========================
# @app.get("/")
# def home():
#     return {"message": "🚀 API Running"}


# # =========================
# # 🔮 PREDICT
# # =========================
# @app.post("/api/predict")
# def predict(data: PowerInput):
#     df = pd.DataFrame([data.dict()])
#     result = hybrid_predict(df)
#     level = "Low" if result < 2500 else "Medium" if result < 4500 else "High"
#     return {
#         "predicted_power_demand": round(result, 2),
#         "unit": "MW",
#         "demand_level": level,
#         "peak_alert": result > 5000
#     }


# # =========================
# # 🏠 APPLIANCE ENERGY
# # =========================
# @app.post("/api/appliance")
# def appliance_prediction(data: dict):
#     appliance_power = {
#         "ac": 1500,
#         "fan": 75,
#         "heater": 2000,
#         "tv": 120,
#         "fridge": 200,
#         "light": 10
#     }

#     total_energy = 0
#     details = []

#     for key, item in data.items():
#         quantity = item.get("quantity", 0)
#         hours = item.get("hours", 0)
#         if quantity > 0 and hours > 0:
#             power = appliance_power.get(key, 0)
#             energy = (power * quantity * hours) / 1000
#             total_energy += energy
#             details.append({"appliance": key, "energy": round(energy, 2)})

#     level = "High" if total_energy > 10 else "Medium" if total_energy > 5 else "Normal"
#     return {
#         "totalEnergy": round(total_energy, 2),
#         "level": level,
#         "details": details
#     }


# # =========================
# # 🌤 WEATHER
# # =========================
# @app.get("/api/weather")
# def get_weather(lat: float, lon: float):
#     try:
#         API_KEY = os.getenv("OPENWEATHER_API_KEY", "").strip()
#         if not API_KEY:
#             return {"error": "API key not loaded"}

#         url = (
#             f"https://api.openweathermap.org/data/2.5/weather"
#             f"?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
#         )

#         res = requests.get(url)
#         data = res.json()
#         print("🌤 OPENWEATHER RESPONSE:", data)

#         if res.status_code != 200 or "main" not in data:
#             return {"error": "OpenWeather API failed", "details": data}

#         temp = data["main"]["temp"]
#         humidity = data["main"]["humidity"]
#         pressure = data["main"]["pressure"]
#         wind_speed = data["wind"]["speed"]
#         wind_deg = data["wind"].get("deg", 0)
#         dew_point = temp - ((100 - humidity) / 5)

#         from datetime import datetime
#         now = datetime.now()
#         moving_avg = temp * 80 + humidity * 10 + wind_speed * 5

#         return {
#             "temp": temp,
#             "dwpt": round(dew_point, 2),
#             "rhum": humidity,
#             "wdir": wind_deg,
#             "wspd": wind_speed,
#             "pres": pressure,
#             "year": now.year,
#             "month": now.month,
#             "day": now.day,
#             "hour": now.hour,
#             "minute": now.minute,
#             "moving_avg_3": round(moving_avg, 2)
#         }

#     except Exception as e:
#         print("❌ WEATHER ERROR:", str(e))
#         return {"error": str(e)}



from fastapi import FastAPI, Form, HTTPException
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
import httpx

# Routers
from auth import router as auth_router
from routes.applianceRoutes import router as appliance_router

# INIT
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
EMAIL_USER = os.getenv("EMAIL_USER")
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


# =========================
# 📧 BREVO API EMAIL SENDER
# =========================
async def send_brevo_email(to_email: str, subject: str, html_content: str):
    api_key = os.getenv("BREVO_API_KEY", "").strip()
    sender_email = os.getenv("EMAIL_USER", "").strip()

    if not api_key:
        raise Exception("BREVO_API_KEY missing in environment")
    if not sender_email:
        raise Exception("EMAIL_USER missing in environment")

    payload = {
        "sender": {"name": "ElectraForecast", "email": sender_email},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_content
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={
                "api-key": api_key,
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=30.0
        )

    if response.status_code not in (200, 201):
        print(f"❌ Brevo API Error: {response.text}")
        raise Exception(f"Failed to send email: {response.text}")

    print(f"✅ Email sent to {to_email}")


# =========================
# 📩 CONTACT API (No attachment)
# =========================
@app.post("/api/contact")
async def contact(
    name: str = Form(...),
    email: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...),
):
    ticket_id = "TICKET-" + str(uuid.uuid4())[:8].upper()

    try:
        # Email to ADMIN
        await send_brevo_email(
            to_email=EMAIL_USER,
            subject=f"📩 New Ticket {ticket_id}: {subject}",
            html_content=f"""
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 540px;
                        margin: 40px auto; background: #ffffff;
                        border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">

                <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8);
                            padding: 28px 32px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 20px;">
                        ⚡ ElectraForecast — Support Ticket
                    </h1>
                    <p style="color: #bfdbfe; font-size: 12px; margin: 6px 0 0;">
                        New ticket received from user
                    </p>
                </div>

                <div style="padding: 28px 32px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 12px 0; color: #64748b;
                                       font-weight: 600; width: 120px;">Ticket ID</td>
                            <td style="padding: 12px 0; color: #2563eb;
                                       font-weight: 700; font-size: 16px;">{ticket_id}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Name</td>
                            <td style="padding: 12px 0; color: #1e293b;">{name}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Email</td>
                            <td style="padding: 12px 0; color: #1e293b;">{email}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Subject</td>
                            <td style="padding: 12px 0; color: #1e293b;">{subject}</td>
                        </tr>
                    </table>

                    <div style="margin-top: 20px; background: #f8fafc;
                                border-left: 4px solid #2563eb;
                                padding: 16px 20px; border-radius: 0 10px 10px 0;">
                        <p style="color: #64748b; font-size: 12px; font-weight: 600;
                                  margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">
                            Message
                        </p>
                        <p style="color: #1e293b; font-size: 14px; line-height: 1.7; margin: 0;">
                            {message}
                        </p>
                    </div>
                </div>

                <div style="background: #f8fafc; padding: 14px 32px;
                            border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #cbd5e1; font-size: 11px; margin: 0;">
                        © ElectraForecast · Sent via Brevo
                    </p>
                </div>
            </div>
            """
        )

        # Confirmation Email to USER
        await send_brevo_email(
            to_email=email,
            subject=f"✅ Ticket Received: {ticket_id} — ElectraForecast",
            html_content=f"""
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px;
                        margin: 40px auto; background: #ffffff;
                        border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">

                <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8);
                            padding: 28px 32px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">
                        ⚡ ElectraForecast
                    </h1>
                    <p style="color: #bfdbfe; font-size: 12px; margin: 6px 0 0;">
                        AI Electricity Demand Forecasting System
                    </p>
                </div>

                <div style="padding: 36px 32px; text-align: center;">
                    <div style="width: 64px; height: 64px; background: #dcfce7;
                                border-radius: 50%; margin: 0 auto 20px;
                                font-size: 32px; line-height: 64px; text-align: center;">
                        ✅
                    </div>

                    <h2 style="color: #1e293b; margin: 0 0 8px;">Ticket Submitted!</h2>
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                        Hi <b>{name}</b>, your support request has been received.
                        Our team will respond within <b>24–48 hours</b>.
                    </p>

                    <div style="margin: 28px auto; background: #eff6ff;
                                border: 1px solid #bfdbfe; border-radius: 12px;
                                padding: 18px 32px; display: inline-block;">
                        <p style="color: #64748b; font-size: 11px; margin: 0 0 6px;
                                  text-transform: uppercase; letter-spacing: 2px;">
                            Your Ticket ID
                        </p>
                        <p style="font-size: 22px; font-weight: 800; color: #2563eb;
                                  margin: 0; letter-spacing: 3px; font-family: monospace;">
                            {ticket_id}
                        </p>
                    </div>

                    <p style="color: #94a3b8; font-size: 12px;">
                        Please save this Ticket ID for future reference.
                    </p>
                </div>

                <div style="background: #f8fafc; padding: 14px 32px;
                            border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #cbd5e1; font-size: 11px; margin: 0;">
                        © ElectraForecast · Sent via Brevo
                    </p>
                </div>
            </div>
            """
        )

    except Exception as e:
        print("❌ Contact Email Error:", e)
        raise HTTPException(
            status_code=500,
            detail=f"Email sending failed: {str(e)}"
        )

    return {"success": True, "ticket_id": ticket_id}


# =========================
# 🤖 CHATBOT
# =========================
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


# =========================
# 🧠 LOAD MODELS
# =========================
xgb_model = joblib.load("models/xgb_model.pkl")
lstm_model = load_model("models/lstm_model.h5", compile=False)
scaler = joblib.load("models/scaler.pkl")


# =========================
# 📐 INPUT SCHEMA
# =========================
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


# =========================
# ⚡ HYBRID MODEL
# =========================
def hybrid_predict(df):
    scaled = scaler.transform(df)
    xgb_pred = xgb_model.predict(scaled)
    lstm_input = scaled.reshape((scaled.shape[0], 1, scaled.shape[1]))
    lstm_pred = lstm_model.predict(lstm_input, verbose=0).flatten()
    final = (0.7 * xgb_pred) + (0.3 * lstm_pred)
    value = float(final[0])
    return 0.0 if math.isnan(value) or math.isinf(value) else value


# =========================
# 🏠 HOME
# =========================
@app.get("/")
def home():
    return {"message": "🚀 API Running"}


# =========================
# 🔮 PREDICT
# =========================
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


# =========================
# 🏠 APPLIANCE ENERGY
# =========================
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
            details.append({"appliance": key, "energy": round(energy, 2)})

    level = "High" if total_energy > 10 else "Medium" if total_energy > 5 else "Normal"
    return {
        "totalEnergy": round(total_energy, 2),
        "level": level,
        "details": details
    }


# =========================
# 🌤 WEATHER
# =========================
@app.get("/api/weather")
def get_weather(lat: float, lon: float):
    try:
        API_KEY = os.getenv("OPENWEATHER_API_KEY", "").strip()
        if not API_KEY:
            return {"error": "API key not loaded"}

        url = (
            f"https://api.openweathermap.org/data/2.5/weather"
            f"?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
        )

        res = requests.get(url)
        data = res.json()
        print("🌤 OPENWEATHER RESPONSE:", data)

        if res.status_code != 200 or "main" not in data:
            return {"error": "OpenWeather API failed", "details": data}

        temp = data["main"]["temp"]
        humidity = data["main"]["humidity"]
        pressure = data["main"]["pressure"]
        wind_speed = data["wind"]["speed"]
        wind_deg = data["wind"].get("deg", 0)
        dew_point = temp - ((100 - humidity) / 5)

        from datetime import datetime
        now = datetime.now()
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
        print("❌ WEATHER ERROR:", str(e))
        return {"error": str(e)}