# backend/init_db.py

import sqlite3
import os

# DB保存パス（自動的に backend/db/ に作成）
DB_FOLDER = os.path.join(os.path.dirname(__file__), "db")
os.makedirs(DB_FOLDER, exist_ok=True)

DB_PATH = os.path.join(DB_FOLDER, "devladder.db")

def create_quiz_results_table():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        problem_id TEXT NOT NULL,
        result TEXT NOT NULL CHECK (result IN ('correct', 'wrong')),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    conn.commit()
    conn.close()
    print("✅ quiz_results テーブルが作成されました。")

if __name__ == "__main__":
    create_quiz_results_table()
