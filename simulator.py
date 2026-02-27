import requests
import random
import time

nodes = [
    {"id": "node_1", "lat": 13.08, "lon": 80.27},
    {"id": "node_2", "lat": 13.09, "lon": 80.28},
    {"id": "node_3", "lat": 13.10, "lon": 80.29},
]

while True:
    for node in nodes:

        temp = random.normalvariate(30, 2)

        # Inject anomaly
        if random.random() < 0.1:
            temp += random.randint(8, 15)

        data = {
            "node_id": node["id"],
            "temperature": temp,
            "humidity": random.uniform(50, 80),
            "latitude": node["lat"],
            "longitude": node["lon"]
        }

        requests.post("http://127.0.0.1:8000/data", json=data)

    time.sleep(5)