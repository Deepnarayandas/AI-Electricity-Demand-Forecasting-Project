# # from fastapi import APIRouter, HTTPException, Body
# # from database import users_collection
# # from models import UserSignup, UserLogin
# # from passlib.context import CryptContext
# # from jose import jwt
# # import os
# # import random
# # import smtplib
# # from email.mime.text import MIMEText

# # router = APIRouter()

# # pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# # SECRET_KEY = os.getenv("SECRET_KEY")

# # # =========================
# # # 🔐 OTP STORE (Temporary)
# # # =========================
# # otp_store = {}

# # # =========================
# # # 📧 SEND OTP EMAIL
# # # =========================
# # def send_otp_email(to_email, otp):
# #     sender_email = os.getenv("EMAIL_USER")
# #     sender_password = os.getenv("EMAIL_PASS")

# #     if not sender_email or not sender_password:
# #         raise HTTPException(status_code=500, detail="Email config missing in .env")

# #     msg = MIMEText(f"Your OTP for password reset is: {otp}")
# #     msg["Subject"] = "Password Reset OTP"
# #     msg["From"] = sender_email
# #     msg["To"] = to_email

# #     try:
# #         server = smtplib.SMTP("smtp.gmail.com", 587)
# #         server.starttls()
# #         server.login(sender_email, sender_password)
# #         server.sendmail(sender_email, to_email, msg.as_string())
# #         server.quit()
# #     except Exception as e:
# #         print("❌ Email Error:", e)
# #         raise HTTPException(status_code=500, detail="Failed to send OTP")


# # # 🔒 Hash password
# # # def hash_password(password: str):
# # #     return pwd_context.hash(password[:72])
# # def hash_password(password: str):
# #     if not password:
# #         raise HTTPException(status_code=400, detail="Password required")

# #     return pwd_context.hash(password.encode("utf-8")[:72])


# # # 🔍 Verify password
# # # def verify_password(plain: str, hashed: str):
# # #     return pwd_context.verify(plain, hashed)
# # def verify_password(plain: str, hashed: str):
# #     if not plain:
# #         raise HTTPException(status_code=400, detail="Password required")

# #     return pwd_context.verify(plain.encode("utf-8")[:72], hashed)


# # # 🔐 Get current user
# # def get_current_user(token: str):
# #     try:
# #         payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
# #         email = payload.get("email")

# #         user = users_collection.find_one({"email": email})
# #         if not user:
# #             raise HTTPException(status_code=401, detail="User not found")

# #         return user

# #     except Exception:
# #         raise HTTPException(status_code=401, detail="Invalid token")


# # # =========================
# # # ✅ SIGNUP
# # # =========================
# # @router.post("/signup")
# # def signup(user: UserSignup):
# #     try:
# #         existing = users_collection.find_one({"email": user.email})

# #         if existing:
# #             raise HTTPException(status_code=400, detail="User already exists")

# #         users_collection.insert_one({
# #             "name": user.name,
# #             "email": user.email,
# #             "password": hash_password(user.password)
# #         })

# #         return {"message": "Signup successful"}

# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         print("❌ ERROR (signup):", e)
# #         raise HTTPException(status_code=500, detail="Server error")


# # # =========================
# # # ✅ LOGIN
# # # =========================
# # # @router.post("/login")
# # # def login(user: UserLogin):
# # #     try:
# # #         db_user = users_collection.find_one({"email": user.email})

# # #         if not db_user:
# # #             raise HTTPException(status_code=400, detail="Invalid email")

# # #         if not verify_password(user.password, db_user["password"]):
# # #             raise HTTPException(status_code=400, detail="Wrong password")

# # #         token = jwt.encode(
# # #             {"email": db_user["email"]},
# # #             SECRET_KEY,
# # #             algorithm="HS256"
# # #         )

# # #         return {
# # #             "token": token,
# # #             "user": {
# # #                 "name": db_user["name"],
# # #                 "email": db_user["email"]
# # #             }
# # #         }

# # #     except HTTPException:
# # #         raise
# # #     except Exception as e:
# # #         print("❌ ERROR (login):", e)
# # #         raise HTTPException(status_code=500, detail="Server error")

# # @router.post("/login")
# # def login(user: UserLogin):
# #     try:
# #         db_user = users_collection.find_one({
# #             "$or": [
# #                 {"email": user.email},
# #                 {"name": user.email}   # ✅ added (use same field)
# #             ]
# #         })

# #         if not db_user:
# #             raise HTTPException(status_code=400, detail="Invalid email or name")

# #         if not verify_password(user.password, db_user["password"]):
# #             raise HTTPException(status_code=400, detail="Wrong password")

# #         token = jwt.encode(
# #             {"email": db_user["email"]},
# #             SECRET_KEY,
# #             algorithm="HS256"
# #         )

# #         return {
# #             "token": token,
# #             "user": {
# #                 "name": db_user["name"],
# #                 "email": db_user["email"]
# #             }
# #         }

# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         print("❌ ERROR (login):", e)
# #         raise HTTPException(status_code=500, detail="Server error")


# # # =========================
# # # ✅ FORGOT PASSWORD (SEND OTP)
# # # =========================
# # @router.post("/forgot-password")
# # def forgot_password(data: dict):
# #     email = data.get("email")

# #     user = users_collection.find_one({"email": email})
# #     if not user:
# #         raise HTTPException(status_code=404, detail="Email not registered")

# #     otp = str(random.randint(100000, 999999))
# #     otp_store[email] = otp

# #     send_otp_email(email, otp)

# #     return {"message": "OTP sent successfully"}


# # # =========================
# # # ✅ VERIFY OTP
# # # =========================
# # @router.post("/verify-otp")
# # def verify_otp(data: dict):
# #     email = data.get("email")
# #     otp = data.get("otp")

# #     if email not in otp_store:
# #         raise HTTPException(status_code=400, detail="OTP not requested")

# #     if otp_store[email] != otp:
# #         raise HTTPException(status_code=400, detail="Invalid OTP")

# #     return {"message": "OTP verified"}


# # # =========================
# # # ✅ RESET PASSWORD
# # # =========================
# # @router.post("/reset-password")
# # def reset_password(data: dict):
# #     email = data.get("email")
# #     new_password = data.get("new_password")

# #     if email not in otp_store:
# #         raise HTTPException(status_code=400, detail="Unauthorized request")

# #     users_collection.update_one(
# #         {"email": email},
# #         {"$set": {"password": hash_password(new_password)}}
# #     )

# #     # Remove OTP after use
# #     del otp_store[email]

# #     return {"message": "Password reset successful"}


# # # =========================
# # # ✅ UPDATE NAME
# # # =========================
# # # @router.put("/update-name")
# # # def update_name(data: dict):
# # #     try:
# # #         user = get_current_user(data["token"])

# # #         users_collection.update_one(
# # #             {"email": user["email"]},
# # #             {"$set": {"name": data["name"]}}
# # #         )

# # #         return {"message": "Name updated"}

# # #     except HTTPException:
# # #         raise
# # #     except Exception as e:
# # #         print("❌ ERROR (update-name):", e)
# # #         raise HTTPException(status_code=500, detail="Server error")

# # @router.put("/update-name")
# # def update_name(data: dict = Body(...)):
# #     try:
# #         if "token" not in data or not data["token"]:
# #             raise HTTPException(status_code=401, detail="Token missing")

# #         if "name" not in data or not data["name"]:
# #             raise HTTPException(status_code=400, detail="Name required")

# #         user = get_current_user(data["token"])

# #         users_collection.update_one(
# #             {"email": user["email"]},
# #             {"$set": {"name": data["name"]}}
# #         )

# #         return {"message": "Name updated"}

# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         print("❌ ERROR (update-name):", e)
# #         raise HTTPException(status_code=500, detail="Server error")
# # # =========================
# # # ✅ CHANGE PASSWORD (UNCHANGED)
# # # =========================
# # # @router.put("/change-password")
# # # def change_password(data: dict):
# #     # try:
# #     #     user = get_current_user(data["token"])

# #     #     if not verify_password(data["old_password"], user["password"]):
# #     #         raise HTTPException(status_code=400, detail="Wrong old password")

# #     #     users_collection.update_one(
# #     #         {"email": user["email"]},
# #     #         {"$set": {"password": hash_password(data["new_password"])}}
# #     #     )

# #     #     return {"message": "Password updated"}

# #     # except HTTPException:
# #     #     raise
# #     # except Exception as e:
# #     #     print("❌ ERROR (change-password):", e)
# #     #     raise HTTPException(status_code=500, detail="Server error")
    

# # @router.put("/change-password")
# # def change_password(data: dict = Body(...)):
# #     try:
# #         if "token" not in data or not data["token"]:
# #             raise HTTPException(status_code=401, detail="Token missing")

# #         if not data.get("old_password") or not data.get("new_password"):
# #             raise HTTPException(status_code=400, detail="All fields required")

# #         user = get_current_user(data["token"])

# #         if not verify_password(data["old_password"], user["password"]):
# #             raise HTTPException(status_code=400, detail="Wrong old password")

# #         users_collection.update_one(
# #             {"email": user["email"]},
# #             {"$set": {"password": hash_password(data["new_password"])}}
# #         )

# #         return {"message": "Password updated"}

# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         print("❌ ERROR (change-password):", e)
# #         raise HTTPException(status_code=500, detail="Server error")


# # # # =========================

# # # # =========================
# # # # ✅ UPDATE NAME
# # # # =========================
# # # @router.put("/update-name")
# # # def update_name(data: dict):
# # #     try:
# # #         user = get_current_user(data["token"])

# # #         users_collection.update_one(
# # #             {"email": user["email"]},
# # #             {"$set": {"name": data["name"]}}
# # #         )

# # #         return {"message": "Name updated"}

# # #     except HTTPException:
# # #         raise
# # #     except Exception as e:
# # #         print("❌ ERROR (update-name):", e)
# # #         raise HTTPException(status_code=500, detail="Server error")


# # # # =========================
# # # # ✅ CHANGE PASSWORD (UNCHANGED)
# # # # =========================
# # # @router.put("/change-password")
# # # def change_password(data: dict):
# # #     try:
# # #         user = get_current_user(data["token"])

# # #         if not verify_password(data["old_password"], user["password"]):
# # #             raise HTTPException(status_code=400, detail="Wrong old password")

# # #         users_collection.update_one(
# # #             {"email": user["email"]},
# # #             {"$set": {"password": hash_password(data["new_password"])}}
# # #         )

# # #         return {"message": "Password updated"}

# # #     except HTTPException:
# # #         raise
# # #     except Exception as e:
# # #         print("❌ ERROR (change-password):", e)
# # #         raise HTTPException(status_code=500, detail="Server error")




# from fastapi import APIRouter, HTTPException, Body
# from database import users_collection
# from models import UserSignup, UserLogin
# from passlib.context import CryptContext
# from jose import jwt
# import os
# import random
# import aiosmtplib
# from email.message import EmailMessage

# router = APIRouter()

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# SECRET_KEY = os.getenv("SECRET_KEY")

# # =========================
# # 🔐 OTP STORE (In-Memory)
# # =========================
# otp_store = {}


# # =========================
# # 📧 BREVO EMAIL FUNCTION
# # =========================
# async def send_brevo_email(to_email: str, subject: str, html_content: str):
#     sender_email = os.getenv("EMAIL_USER", "").strip()
#     sender_password = os.getenv("EMAIL_PASS", "").strip()

#     if not sender_email or not sender_password:
#         raise HTTPException(
#             status_code=500,
#             detail="EMAIL_USER or EMAIL_PASS missing in environment"
#         )

#     msg = EmailMessage()
#     msg["From"] = sender_email
#     msg["To"] = to_email
#     msg["Subject"] = subject
#     msg.set_content(html_content, subtype="html")

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
#         raise HTTPException(
#             status_code=500,
#             detail=f"Failed to send email: {str(e)}"
#         )


# # =========================
# # 🔒 HASH PASSWORD
# # =========================
# def hash_password(password: str):
#     if not password:
#         raise HTTPException(status_code=400, detail="Password required")
#     return pwd_context.hash(password.encode("utf-8")[:72])


# # =========================
# # 🔍 VERIFY PASSWORD
# # =========================
# def verify_password(plain: str, hashed: str):
#     if not plain:
#         raise HTTPException(status_code=400, detail="Password required")
#     return pwd_context.verify(plain.encode("utf-8")[:72], hashed)


# # =========================
# # 🔐 GET CURRENT USER
# # =========================
# def get_current_user(token: str):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#         email = payload.get("email")
#         user = users_collection.find_one({"email": email})
#         if not user:
#             raise HTTPException(status_code=401, detail="User not found")
#         return user
#     except Exception:
#         raise HTTPException(status_code=401, detail="Invalid token")


# # =========================
# # ✅ SIGNUP
# # =========================
# @router.post("/signup")
# def signup(user: UserSignup):
#     try:
#         existing = users_collection.find_one({"email": user.email})
#         if existing:
#             raise HTTPException(status_code=400, detail="User already exists")
#         users_collection.insert_one({
#             "name": user.name,
#             "email": user.email,
#             "password": hash_password(user.password)
#         })
#         return {"message": "Signup successful"}
#     except HTTPException:
#         raise
#     except Exception as e:
#         print("❌ ERROR (signup):", e)
#         raise HTTPException(status_code=500, detail="Server error")


# # =========================
# # ✅ LOGIN
# # =========================
# @router.post("/login")
# def login(user: UserLogin):
#     try:
#         db_user = users_collection.find_one({
#             "$or": [
#                 {"email": user.email},
#                 {"name": user.email}
#             ]
#         })
#         if not db_user:
#             raise HTTPException(status_code=400, detail="Invalid email or name")
#         if not verify_password(user.password, db_user["password"]):
#             raise HTTPException(status_code=400, detail="Wrong password")

#         token = jwt.encode(
#             {"email": db_user["email"]},
#             SECRET_KEY,
#             algorithm="HS256"
#         )
#         return {
#             "token": token,
#             "user": {
#                 "name": db_user["name"],
#                 "email": db_user["email"]
#             }
#         }
#     except HTTPException:
#         raise
#     except Exception as e:
#         print("❌ ERROR (login):", e)
#         raise HTTPException(status_code=500, detail="Server error")


# # =========================
# # ✅ FORGOT PASSWORD — SEND OTP
# # =========================
# @router.post("/forgot-password")
# async def forgot_password(data: dict):
#     email = data.get("email", "").strip()

#     if not email:
#         raise HTTPException(status_code=400, detail="Email is required")

#     user = users_collection.find_one({"email": email})
#     if not user:
#         raise HTTPException(status_code=404, detail="Email not registered")

#     # Generate OTP
#     otp = str(random.randint(100000, 999999))
#     otp_store[email] = otp
#     print(f"🔐 OTP for {email}: {otp}")

#     await send_brevo_email(
#         to_email=email,
#         subject="🔐 Your Password Reset OTP — ElectraForecast",
#         html_content=f"""
#         <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px;
#                     margin: 40px auto; background: #ffffff;
#                     border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">

#             <!-- Header -->
#             <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8);
#                         padding: 28px 32px; text-align: center;">
#                 <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">
#                     ⚡ ElectraForecast
#                 </h1>
#                 <p style="color: #bfdbfe; font-size: 12px; margin: 6px 0 0;">
#                     AI Electricity Demand Forecasting System
#                 </p>
#             </div>

#             <!-- Body -->
#             <div style="padding: 36px 32px;">
#                 <h2 style="color: #1e293b; margin: 0 0 8px;">Password Reset OTP</h2>
#                 <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
#                     Hi <b>{user.get('name', 'User')}</b>, we received a request to reset
#                     your password. Use the OTP below to proceed.
#                     This code expires in <b>10 minutes</b>.
#                 </p>

#                 <!-- OTP Box -->
#                 <div style="text-align: center; margin: 32px 0;">
#                     <div style="display: inline-block; background: #eff6ff;
#                                 border: 2px dashed #93c5fd; border-radius: 14px;
#                                 padding: 20px 40px;">
#                         <p style="color: #64748b; font-size: 12px;
#                                   margin: 0 0 8px; text-transform: uppercase;
#                                   letter-spacing: 2px;">Your OTP Code</p>
#                         <p style="font-size: 48px; font-weight: 800; color: #2563eb;
#                                   letter-spacing: 16px; margin: 0; font-family: monospace;">
#                             {otp}
#                         </p>
#                     </div>
#                 </div>

#                 <p style="color: #94a3b8; font-size: 13px; text-align: center;">
#                     If you did not request a password reset,
#                     please ignore this email.<br/>
#                     <b>Never share this OTP with anyone.</b>
#                 </p>
#             </div>

#             <!-- Footer -->
#             <div style="background: #f8fafc; padding: 16px 32px;
#                         border-top: 1px solid #e2e8f0; text-align: center;">
#                 <p style="color: #cbd5e1; font-size: 11px; margin: 0;">
#                     © ElectraForecast · Sent via Brevo Secure Mail
#                 </p>
#             </div>
#         </div>
#         """
#     )

#     return {"message": "OTP sent successfully"}


# # =========================
# # ✅ VERIFY OTP
# # =========================
# @router.post("/verify-otp")
# def verify_otp(data: dict):
#     email = data.get("email", "").strip()
#     otp = data.get("otp", "").strip()

#     if not email or not otp:
#         raise HTTPException(status_code=400, detail="Email and OTP required")

#     if email not in otp_store:
#         raise HTTPException(status_code=400, detail="OTP not requested for this email")

#     if otp_store[email] != otp:
#         raise HTTPException(status_code=400, detail="Invalid OTP")

#     return {"message": "OTP verified"}


# # =========================
# # ✅ RESET PASSWORD
# # =========================
# @router.post("/reset-password")
# def reset_password(data: dict):
#     email = data.get("email", "").strip()
#     new_password = data.get("new_password", "")

#     if not email or not new_password:
#         raise HTTPException(status_code=400, detail="Email and new password required")

#     if email not in otp_store:
#         raise HTTPException(status_code=400, detail="Unauthorized — verify OTP first")

#     users_collection.update_one(
#         {"email": email},
#         {"$set": {"password": hash_password(new_password)}}
#     )

#     del otp_store[email]
#     return {"message": "Password reset successful"}


# # =========================
# # ✅ UPDATE NAME
# # =========================
# @router.put("/update-name")
# def update_name(data: dict = Body(...)):
#     try:
#         if not data.get("token"):
#             raise HTTPException(status_code=401, detail="Token missing")
#         if not data.get("name"):
#             raise HTTPException(status_code=400, detail="Name required")

#         user = get_current_user(data["token"])
#         users_collection.update_one(
#             {"email": user["email"]},
#             {"$set": {"name": data["name"]}}
#         )
#         return {"message": "Name updated"}
#     except HTTPException:
#         raise
#     except Exception as e:
#         print("❌ ERROR (update-name):", e)
#         raise HTTPException(status_code=500, detail="Server error")


# # =========================
# # ✅ CHANGE PASSWORD
# # =========================
# @router.put("/change-password")
# def change_password(data: dict = Body(...)):
#     try:
#         if not data.get("token"):
#             raise HTTPException(status_code=401, detail="Token missing")
#         if not data.get("old_password") or not data.get("new_password"):
#             raise HTTPException(status_code=400, detail="All fields required")

#         user = get_current_user(data["token"])

#         if not verify_password(data["old_password"], user["password"]):
#             raise HTTPException(status_code=400, detail="Wrong old password")

#         users_collection.update_one(
#             {"email": user["email"]},
#             {"$set": {"password": hash_password(data["new_password"])}}
#         )
#         return {"message": "Password updated"}
#     except HTTPException:
#         raise
#     except Exception as e:
#         print("❌ ERROR (change-password):", e)
#         raise HTTPException(status_code=500, detail="Server error")



from fastapi import APIRouter, HTTPException, Body
from database import users_collection
from models import UserSignup, UserLogin
from passlib.context import CryptContext
from jose import jwt
import os
import random
import httpx

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY")

# =========================
# 🔐 OTP STORE (In-Memory)
# =========================
otp_store = {}


# =========================
# 📧 BREVO API EMAIL SENDER
# =========================
async def send_brevo_email(to_email: str, subject: str, html_content: str):
    api_key = os.getenv("BREVO_API_KEY", "").strip()
    sender_email = os.getenv("EMAIL_USER", "").strip()

    if not api_key:
        raise HTTPException(status_code=500, detail="BREVO_API_KEY missing in environment")
    if not sender_email:
        raise HTTPException(status_code=500, detail="EMAIL_USER missing in environment")

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
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {response.text}"
        )

    print(f"✅ Email sent to {to_email}")


# =========================
# 🔒 HASH PASSWORD
# =========================
def hash_password(password: str):
    if not password:
        raise HTTPException(status_code=400, detail="Password required")
    return pwd_context.hash(password.encode("utf-8")[:72])


# =========================
# 🔍 VERIFY PASSWORD
# =========================
def verify_password(plain: str, hashed: str):
    if not plain:
        raise HTTPException(status_code=400, detail="Password required")
    return pwd_context.verify(plain.encode("utf-8")[:72], hashed)


# =========================
# 🔐 GET CURRENT USER
# =========================
def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email = payload.get("email")
        user = users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


# =========================
# ✅ SIGNUP
# =========================
@router.post("/signup")
def signup(user: UserSignup):
    try:
        existing = users_collection.find_one({"email": user.email})
        if existing:
            raise HTTPException(status_code=400, detail="User already exists")
        users_collection.insert_one({
            "name": user.name,
            "email": user.email,
            "password": hash_password(user.password)
        })
        return {"message": "Signup successful"}
    except HTTPException:
        raise
    except Exception as e:
        print("❌ ERROR (signup):", e)
        raise HTTPException(status_code=500, detail="Server error")


# =========================
# ✅ LOGIN
# =========================
@router.post("/login")
def login(user: UserLogin):
    try:
        db_user = users_collection.find_one({
            "$or": [
                {"email": user.email},
                {"name": user.email}
            ]
        })
        if not db_user:
            raise HTTPException(status_code=400, detail="Invalid email or name")
        if not verify_password(user.password, db_user["password"]):
            raise HTTPException(status_code=400, detail="Wrong password")

        token = jwt.encode(
            {"email": db_user["email"]},
            SECRET_KEY,
            algorithm="HS256"
        )
        return {
            "token": token,
            "user": {
                "name": db_user["name"],
                "email": db_user["email"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print("❌ ERROR (login):", e)
        raise HTTPException(status_code=500, detail="Server error")


# =========================
# ✅ FORGOT PASSWORD — SEND OTP
# =========================
@router.post("/forgot-password")
async def forgot_password(data: dict):
    email = data.get("email", "").strip()

    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")

    otp = str(random.randint(100000, 999999))
    otp_store[email] = otp
    print(f"🔐 OTP for {email}: {otp}")

    await send_brevo_email(
        to_email=email,
        subject="🔐 Your Password Reset OTP — ElectraForecast",
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

            <div style="padding: 36px 32px;">
                <h2 style="color: #1e293b; margin: 0 0 8px;">Password Reset OTP</h2>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                    Hi <b>{user.get('name', 'User')}</b>, we received a request to reset
                    your password. Use the OTP below to proceed.
                    This code expires in <b>10 minutes</b>.
                </p>

                <div style="text-align: center; margin: 32px 0;">
                    <div style="display: inline-block; background: #eff6ff;
                                border: 2px dashed #93c5fd; border-radius: 14px;
                                padding: 20px 40px;">
                        <p style="color: #64748b; font-size: 12px;
                                  margin: 0 0 8px; text-transform: uppercase;
                                  letter-spacing: 2px;">Your OTP Code</p>
                        <p style="font-size: 48px; font-weight: 800; color: #2563eb;
                                  letter-spacing: 16px; margin: 0; font-family: monospace;">
                            {otp}
                        </p>
                    </div>
                </div>

                <p style="color: #94a3b8; font-size: 13px; text-align: center;">
                    If you did not request a password reset, please ignore this email.<br/>
                    <b>Never share this OTP with anyone.</b>
                </p>
            </div>

            <div style="background: #f8fafc; padding: 16px 32px;
                        border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="color: #cbd5e1; font-size: 11px; margin: 0;">
                    © ElectraForecast · Sent via Brevo
                </p>
            </div>
        </div>
        """
    )

    return {"message": "OTP sent successfully"}


# =========================
# ✅ VERIFY OTP
# =========================
@router.post("/verify-otp")
def verify_otp(data: dict):
    email = data.get("email", "").strip()
    otp = data.get("otp", "").strip()

    if not email or not otp:
        raise HTTPException(status_code=400, detail="Email and OTP required")
    if email not in otp_store:
        raise HTTPException(status_code=400, detail="OTP not requested for this email")
    if otp_store[email] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    return {"message": "OTP verified"}


# =========================
# ✅ RESET PASSWORD
# =========================
@router.post("/reset-password")
def reset_password(data: dict):
    email = data.get("email", "").strip()
    new_password = data.get("new_password", "")

    if not email or not new_password:
        raise HTTPException(status_code=400, detail="Email and new password required")
    if email not in otp_store:
        raise HTTPException(status_code=400, detail="Unauthorized — verify OTP first")

    users_collection.update_one(
        {"email": email},
        {"$set": {"password": hash_password(new_password)}}
    )
    del otp_store[email]
    return {"message": "Password reset successful"}


# =========================
# ✅ UPDATE NAME
# =========================
@router.put("/update-name")
def update_name(data: dict = Body(...)):
    try:
        if not data.get("token"):
            raise HTTPException(status_code=401, detail="Token missing")
        if not data.get("name"):
            raise HTTPException(status_code=400, detail="Name required")

        user = get_current_user(data["token"])
        users_collection.update_one(
            {"email": user["email"]},
            {"$set": {"name": data["name"]}}
        )
        return {"message": "Name updated"}
    except HTTPException:
        raise
    except Exception as e:
        print("❌ ERROR (update-name):", e)
        raise HTTPException(status_code=500, detail="Server error")


# =========================
# ✅ CHANGE PASSWORD
# =========================
@router.put("/change-password")
def change_password(data: dict = Body(...)):
    try:
        if not data.get("token"):
            raise HTTPException(status_code=401, detail="Token missing")
        if not data.get("old_password") or not data.get("new_password"):
            raise HTTPException(status_code=400, detail="All fields required")

        user = get_current_user(data["token"])
        if not verify_password(data["old_password"], user["password"]):
            raise HTTPException(status_code=400, detail="Wrong old password")

        users_collection.update_one(
            {"email": user["email"]},
            {"$set": {"password": hash_password(data["new_password"])}}
        )
        return {"message": "Password updated"}
    except HTTPException:
        raise
    except Exception as e:
        print("❌ ERROR (change-password):", e)
        raise HTTPException(status_code=500, detail="Server error")