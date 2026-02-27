from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

# ---------------------
# 1️⃣ Create Flask app and enable CORS
# ---------------------
app = Flask(__name__)
CORS(app)

# ---------------------
# 2️⃣ Database connection helper
# ---------------------
def get_db_connection():
    conn = sqlite3.connect("faias.db")
    conn.row_factory = sqlite3.Row
    return conn

# ---------------------
# 3️⃣ Test route
# ---------------------
@app.route("/")
def home():
    return "FAIAS Backend is Running!"

# ---------------------
# 4️⃣ API: Get Authorized Persons
# ---------------------
@app.route("/api/authorized", methods=["GET"])
def get_authorized():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT person_id, name, unique_id, image_path, added_by, date_added
        FROM authorized_persons
    """)
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

# ---------------------
# 5️⃣ API: Get Alerts (Dashboard)
# ---------------------
@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT alert_id, detected_at, confidence, notified
        FROM alerts
        WHERE detected_at >= datetime('now', '-30 seconds')
        ORDER BY detected_at DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    return jsonify([dict(row) for row in rows])



# ---------------------
# 🚨 API: Create Alert (Live Feed)
# ---------------------
@app.route("/api/alert", methods=["POST"])
def create_alert():
    data = request.json

    confidence = data.get("confidence", 0.0)
    notified = data.get("notified", 0)

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO alerts (confidence, notified)
        VALUES (?, ?)
    """, (confidence, notified))

    conn.commit()
    conn.close()

    return jsonify({"status": "alert logged"})


# ---------------------
# 6️⃣ API: Insert Feedback
# ---------------------
@app.route("/api/feedback", methods=["POST"])
def insert_feedback():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO feedback (user_id, message)
        VALUES (?, ?)
    """, (data["user_id"], data["message"]))
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

# ---------------------
# 7️⃣ API: Get Users
# ---------------------
@app.route("/api/users", methods=["GET"])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT user_id, name, email, role, created_at
        FROM users
    """)
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

# ---------------------
# API: Insert User
# ---------------------
@app.route("/api/users", methods=["POST"])
def add_user():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO users (name, email)
        VALUES (?, ?)
    """, (data["name"], data["email"]))
    conn.commit()
    conn.close()
    return jsonify({"status": "user added"})

# ---------------------
# 🔐 API: Login
# ---------------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT user_id, role FROM users WHERE email = ?",
        (email,)
    )
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 401

    return jsonify({
        "status": "login success",
        "role": user["role"]
    })

# ---------------------
# 8️⃣ API: Face Authentication (placeholder)
# ---------------------
@app.route("/api/face-auth", methods=["POST"])
def face_auth():
    return jsonify({
        "status": "success",
        "message": "Face authentication complete"
    })

# ---------------------
# 9️⃣ Run Flask server
# ---------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
