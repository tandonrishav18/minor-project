from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3

from anomaly_engine import compute_anomaly
from spatial_model import update_node_location
from database import init_db
model = None
scaler = None

# -------------------------------
# INIT
# -------------------------------
init_db()
from ml_model import train_model

model, scaler = train_model()

app = FastAPI()

# -------------------------------
# GLOBAL SIMULATION STATE
# -------------------------------
simulation_state = {
    "heatwave": False,
    "localized_node": None,
    "failure_node": None,
    "alpha": 0.5,
    "beta": 0.3,
    "gamma": 0.2,
    "threshold": 3
}

# -------------------------------
# DATA MODEL
# -------------------------------
class SensorData(BaseModel):
    node_id: int
    temperature: float
    humidity: float
    aqi: float
    latitude: float
    longitude: float

# -------------------------------
# MAIN API
# -------------------------------
@app.post("/data")
def receive_data(data: SensorData):

    # 1. update location
    update_node_location(data.node_id, data.latitude, data.longitude)

    # 2. OPTIONAL: get weights safely
    try:
        from optimizer import find_best_weights
        (alpha, beta, gamma), _ = find_best_weights()

        simulation_state["alpha"] = alpha
        simulation_state["beta"] = beta
        simulation_state["gamma"] = gamma

    except:
        # fallback if optimizer fails
        alpha = simulation_state["alpha"]
        beta = simulation_state["beta"]
        gamma = simulation_state["gamma"]

    # 3. compute anomaly (USE simulation_state VERSION)
    temporal, spatial, rate, score, confidence, flag = compute_anomaly(
        data.node_id,
        data.temperature,
        data.humidity,
        data.aqi,
        simulation_state   # ✅ CORRECT VERSION
    )

    # 4. ML (safe)
    try:
        from ml_model import predict_anomaly

        ml_flag = predict_anomaly(
    model,
    scaler,
    data.temperature,
    data.humidity,
    data.aqi
)
    except:
        ml_flag = 0

    # 5. store
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO readings 
    (node_id, temperature, humidity, aqi,
     temporal_score, spatial_score, rate_score,
     anomaly_score, confidence, anomaly_flag, ml_flag)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.node_id,
        data.temperature,
        data.humidity,
        data.aqi,
        temporal,
        spatial,
        rate,
        score,
        confidence,
        flag,
        ml_flag
    ))

    conn.commit()
    conn.close()

    return {
        "status": "stored",
        "score": score,
        "flag": flag,
        "confidence": confidence
    }

# -------------------------------
# SIMULATION CONTROL
# -------------------------------
@app.post("/update_simulation")
def update_simulation(state: dict):
    global simulation_state
    simulation_state.update(state)
    return {"status": "updated", "state": simulation_state}

@app.get("/get_simulation")
def get_simulation():
    return simulation_state