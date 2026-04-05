import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("SELECT COUNT(*) FROM readings")
count = cursor.fetchone()[0]

print("Rows:", count)

conn.close()