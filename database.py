import sqlite3

def init_db():
    conn = sqlite3.connect("database.db")  
    cursor = conn.cursor()

 
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        node_id INTEGER,
        temperature REAL,
        humidity REAL,
        aqi REAL,
        latitude REAL,
        longitude REAL,
        temporal_score REAL,
        spatial_score REAL,
        rate_score REAL,
        anomaly_score REAL,
        confidence REAL,
        anomaly_flag INTEGER,
        ml_flag INTEGER,
        true_label INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()


    cursor.execute("PRAGMA table_info(readings)")
    columns = [col[1] for col in cursor.fetchall()]

 
    if "aqi" not in columns:
        cursor.execute("ALTER TABLE readings ADD COLUMN aqi REAL DEFAULT 0")

    if "ml_flag" not in columns:
        cursor.execute("ALTER TABLE readings ADD COLUMN ml_flag INTEGER DEFAULT 0")

    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()