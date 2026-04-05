import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# import models
from models.ml_models import (
    train_isolation_forest,
    predict_isolation_forest,
    train_svm,
    predict_svm,
    predict_lof
)

from models.statistical_models import (
    temporal_model,
    spatial_model,
    combined_model,
    hybrid_model
)

# -------------------------------
# LOAD DATA
# -------------------------------
df = pd.read_csv("combined_dataset.csv")

print("Dataset loaded:", df.shape)

# -------------------------------
# FEATURES
# -------------------------------
features = [
    "temperature",
    "humidity",
    "aqi",
    "temporal_score",
    "spatial_score",
    "rate_score"
]

X = df[features]
y = df["true_label"]

# -------------------------------
# TRAIN TEST SPLIT
# -------------------------------
X_train, X_test, y_train, y_test, df_train, df_test = train_test_split(
    X, y, df, test_size=0.3, random_state=42
)

# -------------------------------
# NORMALIZATION
# -------------------------------
scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# -------------------------------
# TRAIN ML MODELS
# -------------------------------
print("Training ML models...")

iso_model = train_isolation_forest(X_train_scaled)
svm_model = train_svm(X_train_scaled)

# -------------------------------
# PREDICTIONS (TEST SET ONLY)
# -------------------------------
print("Generating predictions...")

pred_if = predict_isolation_forest(iso_model, X_test_scaled)
pred_svm = predict_svm(svm_model, X_test_scaled)
pred_lof = predict_lof(X_test_scaled)

# -------------------------------
# STATISTICAL MODELS
# -------------------------------
pred_temporal = temporal_model(df_test)
pred_spatial = spatial_model(df_test)
pred_combined = combined_model(df_test)
pred_hybrid = hybrid_model(df_test)

# -------------------------------
# STORE RESULTS
# -------------------------------
df_test = df_test.copy()

df_test["pred_if"] = pred_if
df_test["pred_svm"] = pred_svm
df_test["pred_lof"] = pred_lof

df_test["pred_temporal"] = pred_temporal
df_test["pred_spatial"] = pred_spatial
df_test["pred_combined"] = pred_combined
df_test["pred_hybrid"] = pred_hybrid

# -------------------------------
# SAVE
# -------------------------------
df_test.to_csv("test_with_predictions.csv", index=False)

print("✅ Training complete")
print("Saved: test_with_predictions.csv")
print("Test size:", len(df_test))