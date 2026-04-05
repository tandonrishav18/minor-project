import pandas as pd
import numpy as np
import os

# -------------------------------
# CONFIG
# -------------------------------
INPUT_FILE = "AirQualityUCI.csv"   # put your dataset here
OUTPUT_FOLDER = "processed_data"
OUTPUT_FILE = "uci_processed.csv"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# -------------------------------
# STEP 1: LOAD DATA
# -------------------------------
print("Loading dataset...")
df = pd.read_csv(INPUT_FILE, sep=";", decimal=",")

# -------------------------------
# STEP 2: REMOVE EMPTY COLUMNS
# -------------------------------
df = df.dropna(axis=1, how="all")

# -------------------------------
# STEP 3: HANDLE MISSING VALUES
# -------------------------------
df.replace(-200, np.nan, inplace=True)
df = df.dropna()

# -------------------------------
# STEP 4: CREATE TIMESTAMP
# -------------------------------
print("Processing timestamp...")
df["Time"] = df["Time"].astype(str).str.replace(".", ":", regex=False)

df["timestamp"] = pd.to_datetime(
    df["Date"] + " " + df["Time"],
    format="%d/%m/%Y %H:%M:%S",
    errors="coerce"
)

# remove any failed parses
df = df.dropna(subset=["timestamp"])

# -------------------------------
# STEP 5: MAP TO YOUR SCHEMA
# -------------------------------
print("Mapping columns...")

df["temperature"] = df["T"]
df["humidity"] = df["RH"]

# Using NO2 as AQI proxy
df["aqi"] = df["NO2(GT)"]

# -------------------------------
# STEP 6: CREATE NODE SYSTEM
# -------------------------------
print("Generating node system...")

df["node_id"] = np.random.randint(1, 21, len(df))

# -------------------------------
# STEP 7: ADD LOCATION
# -------------------------------
df["latitude"] = np.random.uniform(12.9, 13.1, len(df))
df["longitude"] = np.random.uniform(80.1, 80.3, len(df))

# -------------------------------
# STEP 8: FEATURE ENGINEERING
# -------------------------------
print("Generating features...")

# Temporal deviation
df["temporal_score"] = abs(
    df["temperature"] - df["temperature"].rolling(5).mean()
)
df["temporal_score"] = df["temporal_score"].fillna(0)

# Rate of change
df["rate_score"] = df["temperature"].diff().abs().fillna(0)

# Spatial (not available → set 0)
df["spatial_score"] = 0

# -------------------------------
# STEP 9: ANOMALY SCORE
# -------------------------------
df["anomaly_score"] = (
    0.5 * df["temporal_score"] +
    0.3 * df["spatial_score"] +
    0.2 * df["rate_score"]
)

# -------------------------------
# STEP 10: TRUE LABEL GENERATION
# -------------------------------
print("Generating labels...")

threshold = df["anomaly_score"].mean() + df["anomaly_score"].std()

df["true_label"] = (df["anomaly_score"] > threshold).astype(int)

# -------------------------------
# STEP 11: FINAL DATASET
# -------------------------------
print("Preparing final dataset...")

df_final = df[[
    "node_id",
    "temperature",
    "humidity",
    "aqi",
    "latitude",
    "longitude",
    "temporal_score",
    "spatial_score",
    "rate_score",
    "anomaly_score",
    "true_label",
    "timestamp"
]]
# -------------------------------
# STEP 13: MATCH SIMULATION SCHEMA
# -------------------------------

print("Aligning with simulation schema...")

# 1. Add ID
df_final["id"] = range(1, len(df_final) + 1)

# 2. Confidence (normalized score)
df_final["confidence"] = df_final["anomaly_score"] / (df_final["anomaly_score"].max() + 1e-6)

# 3. Anomaly flag (same as true_label for now)
df_final["anomaly_flag"] = df_final["true_label"]

# 4. ML flag (no ML yet → initialize)
df_final["ml_flag"] = 0

# -------------------------------
# REORDER COLUMNS (IMPORTANT)
# -------------------------------
df_final = df_final[[
    "id",
    "node_id",
    "temperature",
    "humidity",
    "aqi",
    "latitude",
    "longitude",
    "temporal_score",
    "spatial_score",
    "rate_score",
    "anomaly_score",
    "confidence",
    "anomaly_flag",
    "ml_flag",
    "true_label",
    "timestamp"
]]

# -------------------------------
# STEP 12: SAVE OUTPUT
# -------------------------------
output_path = os.path.join(OUTPUT_FOLDER, OUTPUT_FILE)

df_final.to_csv(output_path, index=False)

print("\n✅ DONE!")
print(f"Saved to: {output_path}")
print("\nDataset shape:", df_final.shape)
print("\nLabel distribution:")
print(df_final["true_label"].value_counts())