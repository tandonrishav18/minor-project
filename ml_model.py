from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import sqlite3
import numpy as np

def train_model():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT temperature, humidity, aqi
        FROM readings
    """)
    data = cursor.fetchall()
    conn.close()

    if len(data) < 500:
        return None, None

    X = np.array(data)

    # 🔥 normalize data (VERY IMPORTANT)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = IsolationForest(
        n_estimators=300,
        contamination=0.2,   # 🔥 increased
        random_state=42
    )

    model.fit(X_scaled)

    return model, scaler


def predict_anomaly(model, scaler, temp, hum, aqi):
    if model is None:
        return 0

    X = np.array([[temp, hum, aqi]])
    X_scaled = scaler.transform(X)

    pred = model.predict(X_scaled)

    return 1 if pred[0] == -1 else 0