import sqlite3
import numpy as np

# -------------------------------
# HELPER: VECTOR DISTANCE
# -------------------------------
def distance(v1, v2):
    return np.linalg.norm(np.array(v1) - np.array(v2))

# -------------------------------
# EVALUATE WEIGHTS
# -------------------------------
def evaluate_weights(alpha, beta, gamma, threshold=10):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT temperature, humidity, aqi, anomaly_flag
    FROM readings
    """)
    data = cursor.fetchall()
    conn.close()

    if len(data) < 20:
        return 0

    correct = 0
    total = len(data)

    for i in range(1, total):

        current = data[i][:3]  # (temp, humidity, aqi)
        true_label = data[i][3]

        # -------------------------------
        # TEMPORAL (DT)
        # -------------------------------
        history = data[:i]
        history_vectors = [h[:3] for h in history]

        mean_vector = np.mean(history_vectors, axis=0)
        DT = distance(current, mean_vector)

        # -------------------------------
        # SPATIAL (DS) - simplified
        # -------------------------------
        DS = DT  # placeholder (can connect KNN later if needed)

        # -------------------------------
        # RATE OF CHANGE (DR)
        # -------------------------------
        prev = data[i-1][:3]
        DR = distance(current, prev)

        # -------------------------------
        # FINAL SCORE
        # -------------------------------
        score = alpha*DT + beta*DS + gamma*DR

        pred = 1 if score > threshold else 0

        if pred == true_label:
            correct += 1

    accuracy = correct / total
    return accuracy

# -------------------------------
# FIND BEST WEIGHTS
# -------------------------------
def find_best_weights():
    best_score = 0
    best_weights = (0.5, 0.3, 0.2)

    for alpha in [0.2, 0.5, 1]:
        for beta in [0.2, 0.5, 1]:
            for gamma in [0.2, 0.5, 1]:

                score = evaluate_weights(alpha, beta, gamma)

                if score > best_score:
                    best_score = score
                    best_weights = (alpha, beta, gamma)

    return best_weights, best_score