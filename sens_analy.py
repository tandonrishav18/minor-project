import sqlite3
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import f1_score

# -------------------------------
# LOAD DATA
# -------------------------------
conn = sqlite3.connect("database.db")
df = pd.read_sql("SELECT * FROM readings", conn)
conn.close()

df = df.dropna(subset=["anomaly_flag", "anomaly_score"])

# -------------------------------
# TEST DIFFERENT ALPHA VALUES
# -------------------------------
alphas = np.linspace(0.1, 1.0, 10)
f1_scores = []

for alpha in alphas:
    beta = 0.3
    gamma = 0.2

    # recompute score
    score = (
        alpha * df["temporal_score"] +
        beta * df["spatial_score"] +
        gamma * df["rate_score"]
    )

    pred = (score > 3).astype(int)
    f1 = f1_score(df["anomaly_flag"], pred)
    f1_scores.append(f1)

# -------------------------------
# PLOT
# -------------------------------
plt.figure()
plt.plot(alphas, f1_scores, marker='o')
plt.xlabel("Alpha Value")
plt.ylabel("F1 Score")
plt.title("Sensitivity Analysis (Alpha vs F1 Score)")
plt.savefig("sensitivity_graph.png")
plt.show()