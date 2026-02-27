import sqlite3

conn = sqlite3.connect("faias.db")
cursor = conn.cursor()

cursor.execute("""
INSERT INTO users (name, email, password_hash)
VALUES (?, ?, ?)
""", (
    "user1",
    "user1@faias.com",
    "hashed_password_example_123"
))

conn.commit()

print("Inserted user_id:", cursor.lastrowid)

conn.close()