import pandas as pd

# -------------------------------
# TEMPORAL MODEL
# -------------------------------
def temporal_model(df, threshold=2):
    return (df["temporal_score"] > threshold).astype(int)


# -------------------------------
# SPATIAL MODEL
# -------------------------------
def spatial_model(df, threshold=2):
    return (df["spatial_score"] > threshold).astype(int)


# -------------------------------
# TEMPORAL + SPATIAL MODEL
# -------------------------------
def temporal_spatial_model(df, threshold=3):
    return ((df["temporal_score"] + df["spatial_score"]) > threshold).astype(int)


# -------------------------------
# FULL HYBRID MODEL
# -------------------------------
def hybrid_model(df):
    return df["anomaly_flag"]