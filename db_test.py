import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("SELECT COUNT(*) FROM readings")
count = cursor.fetchone()[0]

print("Rows:", count)

conn.close()
import pandas as pd

df_sim = pd.read_csv("dataset_standard.csv")
df_real = pd.read_csv("processed_data/uci_processed.csv")

print(df_sim.columns.equals(df_real.columns))

df_combined = pd.concat([df_sim, df_real], ignore_index=True)
df_combined.to_csv("combined_dataset.csv", index=False)