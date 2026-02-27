from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from anomaly import compute_anomaly
from database import init_db

init_db()

app = FastAPI()

class SensorData(BaseModel):
    node_id: str
    temperature: float
    humidity: float
    latitude: float
    longitude: float

@app.post("/data")
def receive_data(data: SensorData):

    score, flag = compute_anomaly(data.node_id, data.temperature)

    conn = sqlite3.connect("climate.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO readings 
        (node_id, temperature, humidity, latitude, longitude, anomaly_score, anomaly_flag)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data.node_id,
        data.temperature,
        data.humidity,
        data.latitude,
        data.longitude,
        score,
        flag
    ))

    conn.commit()
    conn.close()

    print(f"{data.node_id} | Temp: {data.temperature} | Score: {score}")

    return {"status": "stored", "anomaly": flag}