import json
import os
from datetime import datetime

LOG_DIR = "logs"

os.makedirs(LOG_DIR, exist_ok=True)

def log_experiment(data):
    filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".json"
    path = os.path.join(LOG_DIR, filename)

    with open(path, "w") as f:
        json.dump(data, f, indent=4)

    print(f"Logged → {path}")