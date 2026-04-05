import sqlite3
import pandas as pd

conn = sqlite3.connect("database.db")

df = pd.read_sql("SELECT * FROM readings", conn)

conn.close()

df.to_csv("dataset_standard.csv", index=False)

print("Dataset exported successfully!")