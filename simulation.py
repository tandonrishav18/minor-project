import requests
import random
import time

URL = "http://127.0.0.1:8000/data"

# -------------------------------
# FIXED NODE LOCATIONS (IMPORTANT FOR KNN)
# -------------------------------
NODE_LOCATIONS = {
    i: (random.uniform(12.9, 13.1), random.uniform(80.1, 80.3))
    for i in range(1, 21)
}

while True:
    for node_id in range(1, 21):

        lat, lon = NODE_LOCATIONS[node_id]

        true_label = 0  # default = normal

        temperature = random.uniform(28, 32)
        humidity = random.uniform(60, 80)
        aqi = random.uniform(80, 120)

        # -------------------------------
        # GLOBAL ANOMALY
        # -------------------------------
        if random.random() < 0.05:
            temperature += random.uniform(7, 12)
            humidity -= random.uniform(5, 10)
            aqi += random.uniform(30, 60)
            true_label = 1

        # -------------------------------
        # LOCAL CLUSTER
        # -------------------------------
        if node_id in [5, 6, 7]:
            temperature += random.uniform(3, 6)
            humidity -= random.uniform(5, 10)
            true_label = 1

        # -------------------------------
        # AQI SPIKE
        # -------------------------------
        if node_id in [10, 11] and random.random() < 0.3:
            aqi += random.uniform(50, 100)
            true_label = 1

        # -------------------------------
        # SENSOR FAILURE
        # -------------------------------
        if random.random() < 0.02:
            temperature = random.uniform(0, 100)
            true_label = 1

        data = {
            "node_id": node_id,
            "temperature": temperature,
            "humidity": humidity,
            "aqi": aqi,
            "latitude": lat,
            "longitude": lon,
            "true_label": true_label
        }

        try:
            response = requests.post(URL, json=data, timeout=10)
            print(f"Node {node_id} → {response.status_code}")
        except Exception as e:
            print(f"Node {node_id} ERROR:", e)

    # ---------------- SPEED CONTROL ----------------
    time.sleep(5)