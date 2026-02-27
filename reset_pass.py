import sqlite3
from werkzeug.security import generate_password_hash

conn = sqlite3.connect("faias.db")
cursor = conn.cursor()

cursor.execute("""
UPDATE users
SET password_hash = ?
WHERE email = ?
""", (
    generate_password_hash("admin123"),
    "admin@gmail.com"
))

conn.commit()
conn.close()

print("ADMIN PASSWORD RESET TO admin123")
