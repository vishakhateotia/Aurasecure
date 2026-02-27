import sqlite3

conn = sqlite3.connect("faias.db")
cursor = conn.cursor()

# Alerts table
cursor.execute("""
CREATE TABLE IF NOT EXISTS alerts (
    alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
    detected_at TEXT DEFAULT CURRENT_TIMESTAMP,
    confidence REAL,
    notified INTEGER DEFAULT 0
)
""")

# Authorized persons table
cursor.execute("""
CREATE TABLE IF NOT EXISTS authorized_persons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id TEXT UNIQUE,
    name TEXT,
    unique_id TEXT UNIQUE,
    image_path TEXT,
    added_by TEXT,
    date_added TEXT DEFAULT CURRENT_TIMESTAMP
)
""")

# Users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
""")

# Feedback table
cursor.execute("""
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT,
    submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
conn.close()

print("✅ Database created successfully")

