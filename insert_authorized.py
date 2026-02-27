import sqlite3

# Connect to database
conn = sqlite3.connect("faias.db")
cursor = conn.cursor()

# Update image_path for Annu Kumari
cursor.execute("""
INSERT INTO authorized_persons
(person_id, name, unique_id, image_path, added_by)
VALUES (?, ?, ?, ?, ?)
""", (
    166,                          # roll number
    "Annu kumari",
    "BTBTI23061",
    "faces/annu2 copy.jpeg",
    "admin"
))

print("✅ Image path updated successfully for Annu Kumari")

cursor.execute("""
INSERT INTO authorized_persons
(person_id, name, unique_id, image_path, added_by)
VALUES (?, ?, ?, ?, ?)
""", (
    173,                          # roll number
    "Anushka Srivastava",
    "BTBTI230834",
    "faces/anushka1 copy.jpeg",
    "admin"
))

conn.commit()

print("✅ Authorized person inserted successfully")

conn.close()