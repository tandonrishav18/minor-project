# models/statistical_models.py

import numpy as np

def temporal_model(df):
    return (df["temporal_score"] > 2).astype(int)

def spatial_model(df):
    return (df["spatial_score"] > 2).astype(int)

def combined_model(df):
    return ((df["temporal_score"] + df["spatial_score"]) > 3).astype(int)

def hybrid_model(df):
    return df["anomaly_flag"].values