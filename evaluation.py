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
# TRUE LABEL (IMPORTANT FIX)
# -------------------------------
if "true_label" in df.columns:
    y_true = df["true_label"]
else:
    print("WARNING: true_label missing → fallback to anomaly_flag")
    y_true = df["anomaly_flag"]

# Ensure binary
y_true = y_true.astype(int)

# -------------------------------
# MODEL PREDICTIONS
# -------------------------------
y_pred_custom = (df["anomaly_score"] > 3).astype(int)

if "ml_flag" in df.columns:
    y_pred_ml = df["ml_flag"].astype(int)
else:
    y_pred_ml = np.zeros(len(df))

# -------------------------------
# SAFE EVALUATION FUNCTIONS
# -------------------------------
def evaluate(y_true, y_pred):
    return {
        "precision": precision_score(y_true, y_pred, zero_division=0),
        "recall": recall_score(y_true, y_pred, zero_division=0),
        "f1": f1_score(y_true, y_pred, zero_division=0),
        "accuracy": accuracy_score(y_true, y_pred)
    }


def evaluate_all_models(df):

    y_true = df["true_label"] if "true_label" in df.columns else df["anomaly_flag"]

    results = {}

    # Model A: Temporal
    results["temporal"] = evaluate(
        y_true,
        (df["temporal_score"] > 2).astype(int)
    )

    # Model B: Spatial
    results["spatial"] = evaluate(
        y_true,
        (df["spatial_score"] > 2).astype(int)
    )

    # Model C: Temporal + Spatial
    results["temp_spatial"] = evaluate(
        y_true,
        ((df["temporal_score"] + df["spatial_score"]) > 3).astype(int)
    )

    # Model D: Hybrid
    results["hybrid"] = evaluate(
        y_true,
        df["anomaly_flag"]
    )

    # Model E: ML
    if "ml_flag" in df.columns:
        results["ml"] = evaluate(y_true, df["ml_flag"])

    return results


# -------------------------------
# CONFUSION MATRICES
# -------------------------------
if len(np.unique(y_true)) > 1:

    # Custom
    cm = confusion_matrix(y_true, y_pred_custom)
    ConfusionMatrixDisplay(cm).plot()
    plt.title("Confusion Matrix - Hybrid Model")
    plt.savefig("cm_hybrid.png")
    plt.show()

    # ML
    if "ml_flag" in df.columns:
        cm = confusion_matrix(y_true, y_pred_ml)
        ConfusionMatrixDisplay(cm).plot()
        plt.title("Confusion Matrix - ML Model")
        plt.savefig("cm_ml.png")
        plt.show()

else:
    print("Not enough class variation for confusion matrix")

# -------------------------------
# ROC CURVE (SAFE)
# -------------------------------
if len(np.unique(y_true)) > 1:
    fpr, tpr, _ = roc_curve(y_true, df["anomaly_score"])
    roc_auc = auc(fpr, tpr)

    plt.plot(fpr, tpr, label=f"Hybrid AUC = {roc_auc:.2f}")
    plt.plot([0, 1], [0, 1], linestyle="--")

    plt.legend()
    plt.title("ROC Curve")
    plt.savefig("roc_curve.png")
    plt.show()
else:
    print("ROC skipped (only one class)")

# -------------------------------
# MULTI-MODEL EVALUATION
# -------------------------------
results = evaluate_all_models(df)

metrics_df = pd.DataFrame(results).T.reset_index()
metrics_df.rename(columns={"index": "Model"}, inplace=True)

print("\nMULTI-MODEL RESULTS:")
print(metrics_df)

metrics_df.to_csv("metrics_all_models.csv", index=False)

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