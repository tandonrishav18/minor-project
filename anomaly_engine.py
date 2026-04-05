from spatial_model import get_neighbors
import sqlite3

# -------------------------------
# TEMPORAL DEVIATION
# -------------------------------
def compute_temporal_deviation(node_id, current_temp):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT temperature FROM readings WHERE node_id=? ORDER BY id DESC LIMIT 20",
        (node_id,)
    )

    history = cursor.fetchall()
    conn.close()

    if len(history) < 5:
        return 0

    temps = [h[0] for h in history]
    mean_temp = sum(temps) / len(temps)

    return abs(current_temp - mean_temp)

# -------------------------------
# SPATIAL DEVIATION (KNN)
# -------------------------------
def compute_spatial_deviation(node_id, current_temp):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    neighbors = get_neighbors(node_id)

    neighbor_temps = []

    for n in neighbors:
        cursor.execute(
            "SELECT temperature FROM readings WHERE node_id=? ORDER BY id DESC LIMIT 1",
            (n,)
        )
        result = cursor.fetchone()

        if result:
            neighbor_temps.append(result[0])

    conn.close()

    if len(neighbor_temps) == 0:
        return 0

    diff = sum(abs(current_temp - t) for t in neighbor_temps) / len(neighbor_temps)

    return diff

# -------------------------------
# ANOMALY FUNCTION (STEP 2 COMPLETE)
# -------------------------------
def compute_anomaly(node_id, temperature, humidity, aqi, simulation_state):

    # -------------------------------
    # TEMPORAL (using existing)
    # -------------------------------
    DT = compute_temporal_deviation(node_id, temperature)

    # -------------------------------
    # SPATIAL (using existing)
    # -------------------------------
    DS = compute_spatial_deviation(node_id, temperature)

    # -------------------------------
    # RATE OF CHANGE (NEW)
    # -------------------------------
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT temperature FROM readings WHERE node_id=? ORDER BY id DESC LIMIT 1",
        (node_id,)
    )
    prev = cursor.fetchone()
    conn.close()

    if prev:
        DR = abs(temperature - prev[0])
    else:
        DR = 0

    # -------------------------------
    # WEIGHTS FROM SIMULATION STATE
    # -------------------------------
    alpha = simulation_state["alpha"]
    beta = simulation_state["beta"]
    gamma = simulation_state["gamma"]
    threshold = simulation_state["threshold"]

    # -------------------------------
    # FINAL SCORE
    # -------------------------------
    anomaly_score = alpha * DT + beta * DS + gamma * DR

    anomaly_flag = 1 if anomaly_score > threshold else 0

    # confidence (normalized)
    confidence = min(anomaly_score / (threshold + 1e-5), 1)

    return DT, DS, DR, anomaly_score, confidence, anomaly_flag