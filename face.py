import sqlite3

# Connect to your database
conn = sqlite3.connect("faias.db")
c = conn.cursor()

# Fetch all rows
c.execute("SELECT * FROM faias.db")
rows = c.fetchall()

# Print each row
for row in rows:
    print(row)

conn.close()
