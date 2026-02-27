import sqlite3

conn = sqlite3.connect("faias.db")
cursor = conn.cursor()

cursor.execute("""
INSERT INTO feedback (user_id, message)
VALUES (?, ?)
""", (3, "The alert system is working accurately."))

conn.commit()

print("Inserted feedback_id:", cursor.lastrowid)

conn.close()