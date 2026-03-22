import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

import xgboost as xgb

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

# -----------------------------
# Load Dataset
# -----------------------------

df = pd.read_csv("dataset/power_demand_dataset.csv")

df = df.drop(columns=["Unnamed: 0"], errors="ignore")
df = df.dropna()

# -----------------------------
# Features
# -----------------------------

features = [
    "temp","dwpt","rhum","wdir","wspd","pres",
    "year","month","day","hour","minute","moving_avg_3"
]

X = df[features]
y = df["Power demand"]

# -----------------------------
# Scaling
# -----------------------------

scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# -----------------------------
# Train Test Split
# -----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, shuffle=False
)

# -----------------------------
# XGBoost
# -----------------------------

xgb_model = xgb.XGBRegressor(n_estimators=200, max_depth=6)
xgb_model.fit(X_train, y_train)

# -----------------------------
# LSTM
# -----------------------------

X_train_lstm = X_train.reshape((X_train.shape[0], 1, X_train.shape[1]))
X_test_lstm = X_test.reshape((X_test.shape[0], 1, X_test.shape[1]))

lstm_model = Sequential([
    LSTM(32, input_shape=(1, X_train.shape[1])),
    Dense(16),
    Dense(1)
])

lstm_model.compile(optimizer="adam", loss="mse")

lstm_model.fit(X_train_lstm, y_train, epochs=5, batch_size=64, verbose=1)

# -----------------------------
# Predictions
# -----------------------------

xgb_pred = xgb_model.predict(X_test)
lstm_pred = lstm_model.predict(X_test_lstm).flatten()

# Hybrid (weighted average)
final_pred = (0.7 * xgb_pred) + (0.3 * lstm_pred)

# -----------------------------
# Metrics
# -----------------------------

mae = mean_absolute_error(y_test, final_pred)
rmse = np.sqrt(mean_squared_error(y_test, final_pred))
r2 = r2_score(y_test, final_pred)

print("\nRESULTS")
print("MAE:", round(mae,2))
print("RMSE:", round(rmse,2))
print("R2:", round(r2,3))
print("Accuracy:", round(r2*100,2), "%")

# -----------------------------
# Save Models
# -----------------------------

joblib.dump(xgb_model, "models/xgb_model.pkl")
lstm_model.save("models/lstm_model.h5")
joblib.dump(scaler, "models/scaler.pkl")

print("Models saved")