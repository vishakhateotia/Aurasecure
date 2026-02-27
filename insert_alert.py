import sqlite3

conn = sqlite3.connect("faias.db")
cursor = conn.cursor()

cursor.execute("""
INSERT INTO alerts (detected_at, confidence, notified)
VALUES (?, ?, ?)
""", ("2026-01-11 22:15:00", 91.3, 0))

conn.commit()

print("Inserted alert_id:", cursor.lastrowid)

conn.close()