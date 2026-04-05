import sqlite3
import numpy as np

neighbors = {
    "node_1": ["node_2"],
    "node_2": ["node_1", "node_3"],
    "node_3": ["node_2"]
}

def compute_anomaly(node_id, current_temp, sim_state):

    conn = sqlite3.connect("climate.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT temperature FROM readings
        WHERE node_id=?
        ORDER BY id DESC LIMIT 20
    """, (node_id,))
    rows = cursor.fetchall()
    temps = [r[0] for r in rows]

    if len(temps) < 5:
        conn.close()
        return 0,0,0,0,0,0

    mean = np.mean(temps)
    std = np.std(temps)

    temporal_score = abs(current_temp - mean) / std if std != 0 else 0

    spatial_temps = []
    for n in neighbors.get(node_id, []):
        cursor.execute("""
            SELECT temperature FROM readings
            WHERE node_id=?
            ORDER BY id DESC LIMIT 1
        """, (n,))
        r = cursor.fetchone()
        if r:
            spatial_temps.append(r[0])

    spatial_score = np.mean([abs(current_temp - t) for t in spatial_temps]) if spatial_temps else 0

    rate_score = abs(current_temp - temps[0])

    alpha = sim_state["alpha"]
    beta = sim_state["beta"]
    gamma = sim_state["gamma"]
    threshold = sim_state["threshold"]

    anomaly_score = alpha*temporal_score + beta*spatial_score + gamma*rate_score
    anomaly_flag = 1 if anomaly_score > threshold else 0
    confidence = anomaly_score / (threshold*2)

    conn.close()

    return temporal_score, spatial_score, rate_score, anomaly_score, confidence, anomaly_flag