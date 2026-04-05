import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

# -------------------------------
# LOAD DATA FROM DATABASE OR CSV
# -------------------------------
def load_data_from_db(db_path="database.db"):
    import sqlite3
    conn = sqlite3.connect(db_path)
    df = pd.read_sql("SELECT * FROM readings", conn)
    conn.close()
    return df


def load_data_from_csv(file_path):
    return pd.read_csv(file_path)


# -------------------------------
# CLEAN DATA
# -------------------------------
def clean_data(df):
    # remove nulls
    df = df.dropna()

    # remove unrealistic values
    df = df[
        (df["temperature"] > -10) & (df["temperature"] < 60) &
        (df["humidity"] >= 0) & (df["humidity"] <= 100) &
        (df["aqi"] >= 0) & (df["aqi"] <= 500)
    ]

    return df


# -------------------------------
# SORT + FORMAT TIME
# -------------------------------
def process_timestamp(df):
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df.sort_values(by=["node_id", "timestamp"])
    return df


# -------------------------------
# FEATURE ENGINEERING
# -------------------------------
def add_features(df):
    # Rate of change (DR)
    df["rate_score"] = df.groupby("node_id")["temperature"].diff().abs().fillna(0)

    # Rolling mean (temporal context)
    df["temp_rolling_mean"] = df.groupby("node_id")["temperature"].rolling(window=5).mean().reset_index(0, drop=True)

    df["temp_rolling_mean"] = df["temp_rolling_mean"].fillna(df["temperature"])

    return df


# -------------------------------
# NORMALIZATION (FOR ML MODELS)
# -------------------------------
def normalize_features(df, feature_cols):
    scaler = StandardScaler()
    df_scaled = df.copy()
    df_scaled[feature_cols] = scaler.fit_transform(df[feature_cols])
    return df_scaled, scaler


# -------------------------------
# TRAIN / TEST SPLIT
# -------------------------------
def train_test_split(df, split_ratio=0.7):
    split_index = int(len(df) * split_ratio)
    train_df = df.iloc[:split_index]
    test_df = df.iloc[split_index:]
    return train_df, test_df


# -------------------------------
# STANDARDIZE DATA FORMAT (IMPORTANT FOR CROSS-DOMAIN)
# -------------------------------
def standardize_schema(df):
    required_cols = [
        "node_id", "timestamp", "temperature", "humidity", "aqi",
        "latitude", "longitude",
        "temporal_score", "spatial_score", "rate_score",
        "anomaly_score", "anomaly_flag", "true_label"
    ]

    for col in required_cols:
        if col not in df.columns:
            df[col] = 0

    return df[required_cols]


# -------------------------------
# CROSS-DOMAIN CONVERSION
# -------------------------------
def convert_cross_domain(df, domain="generic"):
    """
    Convert external datasets into your schema
    """

    df = df.copy()

    if domain == "stock":
        # map stock price → temperature
        df["temperature"] = df["Close"]
        df["humidity"] = df["Close"].rolling(5).mean().fillna(df["Close"])
        df["aqi"] = df["Close"].diff().abs().fillna(0)

    elif domain == "network":
        # map network traffic
        df["temperature"] = df["bytes"]
        df["humidity"] = df["packets"]
        df["aqi"] = df["bytes"].diff().abs().fillna(0)

    elif domain == "generic":
        pass

    return df


# -------------------------------
# FULL PREPROCESSING PIPELINE
# -------------------------------
def preprocess_pipeline(df, normalize=False):

    # 1. clean
    df = clean_data(df)

    # 2. timestamp
    df = process_timestamp(df)

    # 3. features
    df = add_features(df)

    # 4. standardize schema
    df = standardize_schema(df)

    # 5. optional normalization
    if normalize:
        feature_cols = ["temperature", "humidity", "aqi"]
        df, scaler = normalize_features(df, feature_cols)
        return df, scaler

    return df


# -------------------------------
# EXPORT CLEAN DATASET
# -------------------------------
def export_dataset(df, filename="processed_dataset.csv"):
    df.to_csv(filename, index=False)
    print(f"Dataset exported as {filename}")