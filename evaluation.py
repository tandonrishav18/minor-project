import sqlite3
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
from sklearn.metrics import roc_curve, auc, precision_score, recall_score, f1_score



# -------------------------------
# LOAD DATA
# -------------------------------
conn = sqlite3.connect("database.db")
df = pd.read_sql("SELECT * FROM readings", conn)
conn.close()
print("Total rows:", len(df))
print("Columns:", df.columns)
print("Anomaly Flag Unique:", df["anomaly_flag"].unique())
print("ML Flag Unique:", df["ml_flag"].unique())
if df.empty:
    print("No data found. Run simulation first.")
    exit()

# -------------------------------
# CLEAN DATA
# -------------------------------
df = df.dropna(subset=["anomaly_flag", "anomaly_score"])


# -------------------------------
# TRUE LABEL (for evaluation)
# -------------------------------
# Using anomaly_flag as ground truth (since simulation injected anomalies)
y_true = df["anomaly_flag"]

# -------------------------------
# MODEL PREDICTIONS
# -------------------------------
y_pred_custom = (df["anomaly_score"] > 3).astype(int)
y_pred_ml = df["ml_flag"]
print("Unique anomaly_flag:", df["anomaly_flag"].unique())
print("Unique ml_flag:", df["ml_flag"].unique())
# -------------------------------
# CONFUSION MATRIX (CUSTOM)
# -------------------------------
if len(np.unique(y_true)) > 1:
    cm = confusion_matrix(y_true, y_pred_custom)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm)
    disp.plot()
    plt.title("Confusion Matrix - Custom Model")
    plt.savefig("confusion_matrix_custom.png")
    plt.show()
else:
    print("Not enough class variation for confusion matrix")

# -------------------------------
# CONFUSION MATRIX (ML)
# -------------------------------


if len(np.unique(y_true)) > 1:
    cm = confusion_matrix(y_true, y_pred_ml)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm)
    disp.plot()
    plt.title("Confusion Matrix - Ml model")
    plt.savefig("confusion_matrix.png")
    plt.show()
else:
    print("Not enough class variation for confusion matrix")

# -------------------------------
# ROC CURVE
# -------------------------------
fpr, tpr, _ = roc_curve(y_true, df["anomaly_score"])
roc_auc = auc(fpr, tpr)

if len(np.unique(y_true)) > 1:
    fpr, tpr, _ = roc_curve(y_true, df["anomaly_score"])
    roc_auc = auc(fpr, tpr)

    plt.plot(fpr, tpr, label=f"AUC = {roc_auc:.2f}")
    plt.plot([0, 1], [0, 1], linestyle="--")
    plt.legend()
    plt.savefig("roc_curve.png")
    plt.show()
else:
    print("ROC not possible - only one class present")

# -------------------------------
# METRICS TABLE
# -------------------------------
precision_c = precision_score(y_true, y_pred_custom)
recall_c = recall_score(y_true, y_pred_custom)
f1_c = f1_score(y_true, y_pred_custom)

precision_m = precision_score(y_true, y_pred_ml)
recall_m = recall_score(y_true, y_pred_ml)
f1_m = f1_score(y_true, y_pred_ml)

metrics_df = pd.DataFrame({
    "Metric": ["Precision", "Recall", "F1 Score"],
    "Custom Model": [precision_c, recall_c, f1_c],
    "ML Model": [precision_m, recall_m, f1_m]
})

print(metrics_df)
metrics_df.to_csv("metrics_table.csv", index=False)

# -------------------------------
# MODEL COMPARISON BAR GRAPH
# -------------------------------
metrics_df.set_index("Metric").plot(kind="bar")
plt.title("Model Comparison")
plt.xticks(rotation=0)
plt.savefig("model_comparison.png")
plt.show()

# -------------------------------
# ANOMALY SCORE DISTRIBUTION
# -------------------------------
plt.hist(df["anomaly_score"], bins=50)
plt.title("Anomaly Score Distribution")
plt.savefig("score_distribution.png")
plt.show()

# -------------------------------
# TIME SERIES (SAMPLE NODE)
# -------------------------------
sample_node = df["node_id"].iloc[0]
node_df = df[df["node_id"] == sample_node]

plt.plot(node_df["temperature"], label="Temperature")
plt.plot(node_df["anomaly_score"], label="Anomaly Score")
plt.legend()
plt.title(f"Time Series - Node {sample_node}")
plt.savefig("time_series.png")
plt.show()

# -------------------------------
# CORRELATION HEATMAP
# -------------------------------
corr = df[[
    "temperature", "humidity", "aqi",
    "temporal_score", "spatial_score", "rate_score", "anomaly_score"
]].corr()

plt.imshow(corr)
plt.colorbar()
plt.xticks(range(len(corr.columns)), corr.columns, rotation=45)
plt.yticks(range(len(corr.columns)), corr.columns)
plt.title("Feature Correlation Heatmap")
plt.savefig("correlation_heatmap.png")
plt.show()

# -------------------------------
# NODE-WISE ANOMALY RATE
# -------------------------------
node_anomaly = df.groupby("node_id")["anomaly_flag"].mean()

node_anomaly.plot(kind="bar")
plt.title("Node-wise Anomaly Rate")
plt.savefig("node_anomaly.png")
plt.show()

# -------------------------------
# PRINT SUMMARY
# -------------------------------
print("\n===== FINAL SUMMARY =====")
print(f"Total Samples: {len(df)}")
print(f"Custom Precision: {precision_c:.2f}")
print(f"Custom Recall: {recall_c:.2f}")
print(f"Custom F1: {f1_c:.2f}")
print(f"ML Precision: {precision_m:.2f}")
print(f"ML Recall: {recall_m:.2f}")
print(f"ML F1: {f1_m:.2f}")