import sqlite3

def init_db():
    conn = sqlite3.connect("climate.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        node_id TEXT,
        temperature REAL,
        humidity REAL,
        latitude REAL,
        longitude REAL,
        anomaly_score REAL,
        anomaly_flag INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()