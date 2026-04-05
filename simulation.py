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

        # ---------------- BASE VALUES ----------------
        temperature = random.uniform(28, 32)
        humidity = random.uniform(60, 80)
        aqi = random.uniform(80, 120)

        # ---------------- GLOBAL ANOMALY ----------------
        if random.random() < 0.1:
            temperature += random.uniform(7, 12)
            humidity -= random.uniform(5, 10)
            aqi += random.uniform(30, 60)

        # ---------------- LOCAL CLUSTER ----------------
        if node_id in [5, 6, 7]:
            temperature += random.uniform(3, 6)
            humidity -= random.uniform(5, 10)

        # ---------------- AQI HOTSPOT ----------------
        if node_id in [10, 11] and random.random() < 0.4:
            aqi += random.uniform(50, 100)
            humidity -= random.uniform(3, 7)

        # ---------------- SENSOR FAILURE ----------------
        if random.random() < 0.03:
            temperature = random.uniform(0, 100)

        data = {
            "node_id": node_id,
            "temperature": temperature,
            "humidity": humidity,
            "aqi": aqi,
            "latitude": lat,
            "longitude": lon
        }

        try:
            response = requests.post(URL, json=data, timeout=10)
            print(f"Node {node_id} → {response.status_code}")
        except Exception as e:
            print(f"Node {node_id} ERROR:", e)

    # ---------------- SPEED CONTROL ----------------
    time.sleep(5)