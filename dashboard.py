import streamlit as st
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt

st.set_page_config(layout="wide")
st.title("Spatio-Temporal Edge Climate Monitoring Dashboard")

# Connect to database
conn = sqlite3.connect("climate.db")
df = pd.read_sql("SELECT * FROM readings", conn)
conn.close()

if df.empty:
    st.warning("No data available yet. Run simulator.")
    st.stop()

# Convert timestamp to datetime
df["timestamp"] = pd.to_datetime(df["timestamp"])

# Node Selection
node_list = df["node_id"].unique()
selected_node = st.selectbox("Select Node", node_list)

node_data = df[df["node_id"] == selected_node]

# -------------------------
# 1️⃣ Temperature Time-Series Graph
# -------------------------
st.subheader("Temperature Trend")

fig1, ax1 = plt.subplots()
ax1.plot(node_data["timestamp"], node_data["temperature"])
ax1.set_xlabel("Time")
ax1.set_ylabel("Temperature (°C)")
ax1.set_title(f"Temperature Trend - {selected_node}")
plt.xticks(rotation=45)
st.pyplot(fig1)

# -------------------------
# 2️⃣ Highlighted Anomalies
# -------------------------
st.subheader("Anomaly Highlighting")

fig2, ax2 = plt.subplots()

ax2.plot(node_data["timestamp"], node_data["temperature"])

anomalies = node_data[node_data["anomaly_flag"] == 1]

ax2.scatter(
    anomalies["timestamp"],
    anomalies["temperature"],
    s=100
)

ax2.set_xlabel("Time")
ax2.set_ylabel("Temperature (°C)")
ax2.set_title("Anomaly Points Highlighted")
plt.xticks(rotation=45)
st.pyplot(fig2)

# -------------------------
# 3️⃣ Anomaly Score Trend
# -------------------------
st.subheader("Anomaly Score Over Time")

fig3, ax3 = plt.subplots()
ax3.plot(node_data["timestamp"], node_data["anomaly_score"])
ax3.set_xlabel("Time")
ax3.set_ylabel("Anomaly Score")
ax3.set_title("Spatio-Temporal Anomaly Score Trend")
plt.xticks(rotation=45)
st.pyplot(fig3)

# -------------------------
# 4️⃣ Geospatial Node Distribution
# -------------------------
st.subheader("Geospatial Node Map (Scatter View)")

latest_data = df.sort_values("timestamp").groupby("node_id").tail(1)

fig4, ax4 = plt.subplots()
ax4.scatter(latest_data["longitude"], latest_data["latitude"])

for i, row in latest_data.iterrows():
    ax4.text(row["longitude"], row["latitude"], row["node_id"])

ax4.set_xlabel("Longitude")
ax4.set_ylabel("Latitude")
ax4.set_title("Sensor Node Locations")
st.pyplot(fig4)

# -------------------------
# 5️⃣ Node-wise Anomaly Count
# -------------------------
st.subheader("Anomaly Count Per Node")

anomaly_counts = df.groupby("node_id")["anomaly_flag"].sum()

fig5, ax5 = plt.subplots()
ax5.bar(anomaly_counts.index, anomaly_counts.values)
ax5.set_xlabel("Node")
ax5.set_ylabel("Total Anomalies")
ax5.set_title("Anomaly Distribution Across Nodes")
st.pyplot(fig5)