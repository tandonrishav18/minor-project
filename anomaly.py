import sqlite3
import numpy as np

def compute_anomaly(node_id, current_temp):
    conn = sqlite3.connect("climate.db")
    cursor = conn.cursor()

    # Temporal Data
    cursor.execute("""
        SELECT temperature FROM readings 
        WHERE node_id=? 
        ORDER BY id DESC LIMIT 20
    """, (node_id,))
    
    rows = cursor.fetchall()
    temps = [r[0] for r in rows]

    # Not enough data
    if len(temps) < 5:
        conn.close()
        return 0, 0

    mean = np.mean(temps)
    std = np.std(temps)

    D_T = abs(current_temp - mean) / std if std != 0 else 0

    # Spatial Deviation
    cursor.execute("""
        SELECT temperature FROM readings 
        WHERE node_id!=? 
        ORDER BY id DESC LIMIT 5
    """, (node_id,))
    
    spatial_rows = cursor.fetchall()
    neighbor_temps = [r[0] for r in spatial_rows]

    if neighbor_temps:
        D_S = np.mean([abs(current_temp - t) for t in neighbor_temps])
    else:
        D_S = 0

    # Rate of Change
    if temps:
        D_R = abs(current_temp - temps[0])
    else:
        D_R = 0

    # Final Score
    alpha, beta, gamma = 0.5, 0.3, 0.2
    anomaly_score = alpha*D_T + beta*D_S + gamma*D_R

    anomaly_flag = 1 if anomaly_score > 5 else 0

    conn.close()
    return anomaly_score, anomaly_flag