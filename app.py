import streamlit as st
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import requests
import numpy as np
import plotly.express as px

# -------------------------
# PAGE CONFIG
# -------------------------
st.set_page_config(layout="wide")
st.title("Spatio-Temporal Edge Climate Research Lab")

# -------------------------
# AUTO REFRESH (SAFE)
# -------------------------
refresh = st.sidebar.checkbox("Auto Refresh")
if refresh:
    st.experimental_rerun()

# -------------------------
# SIMULATION CONTROLS
# -------------------------
st.sidebar.header("Simulation Controls")

alpha = st.sidebar.slider("Alpha", 0.0, 1.0, 0.5)
beta = st.sidebar.slider("Beta", 0.0, 1.0, 0.3)
gamma = st.sidebar.slider("Gamma", 0.0, 1.0, 0.2)
threshold = st.sidebar.slider("Threshold", 0.0, 20.0, 10.0)

if st.sidebar.button("Apply Settings"):
    try:
        requests.post("http://127.0.0.1:8000/update_simulation", json={
            "alpha": alpha,
            "beta": beta,
            "gamma": gamma,
            "threshold": threshold
        })
    except:
        st.warning("Backend not running")

# -------------------------
# LOAD DATA
# -------------------------
conn = sqlite3.connect("database.db")
df = pd.read_sql("SELECT * FROM readings", conn)
conn.close()

if df.empty:
    st.warning("Waiting for data... Run simulation first")
    st.stop()

df["timestamp"] = pd.to_datetime(df["timestamp"])

# -------------------------
# METRICS
# -------------------------
col1, col2, col3 = st.columns(3)

col1.metric("Total Readings", len(df))
col2.metric("Anomalies", int(df["anomaly_flag"].sum()))
col3.metric("Avg Confidence", round(df["confidence"].fillna(0).mean(), 2))

# -------------------------
# NODE SELECT
# -------------------------
node = st.selectbox("Select Node", df["node_id"].unique())
node_data = df[df["node_id"] == node]

# -------------------------
# MULTI SENSOR GRAPH
# -------------------------
st.subheader("Environmental Trends")

fig, ax = plt.subplots()
ax.plot(node_data["timestamp"], node_data["temperature"], label="Temp")
ax.plot(node_data["timestamp"], node_data["humidity"], label="Humidity")
ax.plot(node_data["timestamp"], node_data["aqi"], label="AQI")
ax.legend()
plt.xticks(rotation=45)

st.pyplot(fig)

# -------------------------
# ANOMALY COMPONENTS
# -------------------------
st.subheader("Anomaly Breakdown")

fig, ax = plt.subplots()
ax.plot(node_data["timestamp"], node_data["temporal_score"], label="Temporal")
ax.plot(node_data["timestamp"], node_data["spatial_score"], label="Spatial")
ax.plot(node_data["timestamp"], node_data["rate_score"], label="Rate")
ax.plot(node_data["timestamp"], node_data["anomaly_score"], label="Final")
ax.legend()
plt.xticks(rotation=45)

st.pyplot(fig)

# -------------------------
# HEATMAP
# -------------------------
st.subheader("Geospatial Heatmap")

latest = df.sort_values("timestamp").groupby("node_id").tail(1)

fig = px.scatter_mapbox(
    latest,
    lat="latitude",
    lon="longitude",
    color="anomaly_score",
    size="anomaly_score",
    zoom=10,
    mapbox_style="open-street-map"
)

st.plotly_chart(fig, use_container_width=True)

# -------------------------
# RELIABILITY
# -------------------------
st.subheader("Node Reliability")

reliability = 1 - df.groupby("node_id")["anomaly_flag"].mean()
st.bar_chart(reliability)

# -------------------------
# DISTRIBUTION
# -------------------------
st.subheader("Anomaly Score Distribution")

fig, ax = plt.subplots()
ax.hist(df["anomaly_score"], bins=30)

st.pyplot(fig)