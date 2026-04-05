import sqlite3
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.metrics import (
    confusion_matrix,
    ConfusionMatrixDisplay,
    roc_curve,
    auc,
    precision_score,
    recall_score,
    f1_score,
    accuracy_score
)

# -------------------------------
# IMPORT MODELS
# -------------------------------
from models.statistical_models import (
    temporal_model,
    spatial_model,
    temporal_spatial_model,
    hybrid_model
)

from models.ml_models import (
    isolation_forest_model,
    lof_model,
    svm_model
)

# -------------------------------
# LOAD DATA
# -------------------------------
conn = sqlite3.connect("database.db")
df = pd.read_sql("SELECT * FROM readings", conn)
conn.close()

print("Total rows:", len(df))
print("Columns:", df.columns)

if df.empty:
    print("No data found. Run simulation first.")
    exit()

# -------------------------------
# CLEAN DATA
# -------------------------------
df = df.dropna(subset=["anomaly_score", "anomaly_flag"])

# -------------------------------
# TRUE LABEL
# -------------------------------
if "true_label" in df.columns:
    y_true = df["true_label"].astype(int)
else:
    print("WARNING: true_label missing → using anomaly_flag")
    y_true = df["anomaly_flag"].astype(int)

# -------------------------------
# GENERATE PREDICTIONS
# -------------------------------
print("\nGenerating predictions...")

pred_temporal = temporal_model(df)
pred_spatial = spatial_model(df)
pred_ts = temporal_spatial_model(df)
pred_hybrid = hybrid_model(df)

pred_if = isolation_forest_model(df)
pred_lof = lof_model(df)
pred_svm = svm_model(df)

# store predictions (useful for analysis)
df["pred_if"] = pred_if
df["pred_lof"] = pred_lof
df["pred_svm"] = pred_svm

# -------------------------------
# SAFE EVALUATION
# -------------------------------
def evaluate(y_true, y_pred):
    return {
        "precision": precision_score(y_true, y_pred, zero_division=0),
        "recall": recall_score(y_true, y_pred, zero_division=0),
        "f1": f1_score(y_true, y_pred, zero_division=0),
        "accuracy": accuracy_score(y_true, y_pred)
    }

# -------------------------------
# EVALUATE ALL MODELS
# -------------------------------
results = {}

results["temporal"] = evaluate(y_true, pred_temporal)
results["spatial"] = evaluate(y_true, pred_spatial)
results["temp_spatial"] = evaluate(y_true, pred_ts)
results["hybrid"] = evaluate(y_true, pred_hybrid)

results["isolation_forest"] = evaluate(y_true, pred_if)
results["lof"] = evaluate(y_true, pred_lof)
results["svm"] = evaluate(y_true, pred_svm)

# -------------------------------
# PRINT RESULTS
# -------------------------------
metrics_df = pd.DataFrame(results).T.reset_index()
metrics_df.rename(columns={"index": "Model"}, inplace=True)

print("\n===== MODEL RESULTS =====")
print(metrics_df)

metrics_df.to_csv("metrics_all_models.csv", index=False)

# -------------------------------
# CONFUSION MATRIX (HYBRID)
# -------------------------------
if len(np.unique(y_true)) > 1:
    cm = confusion_matrix(y_true, pred_hybrid)
    ConfusionMatrixDisplay(cm).plot()
    plt.title("Confusion Matrix - Hybrid")
    plt.savefig("cm_hybrid.png")
    plt.show()
else:
    print("Confusion matrix skipped (single class)")

# -------------------------------
# ROC CURVE (HYBRID)
# -------------------------------
if len(np.unique(y_true)) > 1:
    fpr, tpr, _ = roc_curve(y_true, df["anomaly_score"])
    roc_auc = auc(fpr, tpr)

    plt.plot(fpr, tpr, label=f"AUC = {roc_auc:.2f}")
    plt.plot([0, 1], [0, 1], linestyle="--")
    plt.legend()
    plt.title("ROC Curve - Hybrid")
    plt.savefig("roc_curve.png")
    plt.show()
else:
    print("ROC skipped (single class)")

# -------------------------------
# MODEL COMPARISON GRAPH
# -------------------------------
metrics_df.set_index("Model")[["precision", "recall", "f1"]].plot(kind="bar")
plt.title("Model Comparison (All Models)")
plt.xticks(rotation=30)
plt.savefig("model_comparison_all.png")
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
# FINAL SUMMARY
# -------------------------------
print("\n===== FINAL SUMMARY =====")
for model, metrics in results.items():
    print(f"{model.upper()} → {metrics}")