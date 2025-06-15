import os, subprocess, json
import sqlite3

from datetime import datetime, timedelta, timezone
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# DBパス設定（例：backend/db/devladder.db）
DB_PATH = os.path.join(os.path.dirname(__file__), "db", "devladder.db")
JST = timezone(timedelta(hours=9))

RUNNER_DIR = "runner"
os.makedirs(RUNNER_DIR, exist_ok=True)

@app.route('/run', methods=['POST'])
def run_code():
    data = request.json
    code = data.get("code", "")
    lang = data.get("language", "java")
    user_input = data.get("input", "")

    if lang == "java":
        return run_java(code, user_input)
    elif lang == "python":
        return run_python(code, user_input)
    # elif lang == "c":
    #     return run_c(code, user_input)
    else:
        return jsonify({"output": "Unsupported language"})

def run_java(code, user_input):
    java_file = os.path.join(RUNNER_DIR, "Hello.java")

    with open(java_file, "w") as f:
        f.write(code)

    try:
        compile_proc = subprocess.run(
            ["javac", java_file],
            capture_output=True,
            text=True,
            timeout=5
        )
        if compile_proc.returncode != 0:
            return jsonify({"output": compile_proc.stderr})

        run_proc = subprocess.run(
            ["java", "-cp", RUNNER_DIR, "Hello"],
            input=user_input,
            capture_output=True,
            text=True,
            timeout=5
        )
        return jsonify({"output": run_proc.stdout + run_proc.stderr})

    except subprocess.TimeoutExpired:
        return jsonify({"output": "Time Limit Exceeded"})
    
def run_python(code, user_input):
    py_file = os.path.join(RUNNER_DIR, "main.py")

    with open(py_file, "w", encoding="utf-8") as f:
        f.write(code)

    try:
        proc = subprocess.run(
            ["python", py_file],
            input=user_input,
            capture_output=True,
            text=True,
            timeout=5
        )
        return jsonify({"output": proc.stdout + proc.stderr})
    
    except subprocess.TimeoutExpired:
        return jsonify({"output": "Time Limit Exceeded"})


@app.route('/problems', methods=['GET'])
def get_problems():
    with open("problems.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return jsonify(data)

@app.route("/problems/code")
def get_code_problems():
    with open("problems/code.json", encoding="utf-8") as f:
        problems = json.load(f)
    return jsonify(problems)

@app.route("/problems/quiz")
def get_quiz_problems():
    with open("problems/quiz.json", encoding="utf-8") as f:
        problems = json.load(f)
    return jsonify(problems)

@app.route("/quiz/submit", methods=["POST"])
def submit_quiz_result():
    data = request.get_json()
    problem_id = data.get("problem_id")
    result = data.get("result")  # "correct" or "wrong"

    print("📥 submit_result 受信:", data)  # ← これ！

    # バリデーション
    if not problem_id or result not in ["correct", "wrong"]:
        return jsonify({"error": "Invalid data"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        now_jst = datetime.now(JST).strftime("%Y-%m-%d %H:%M:%S")

        cur.execute("""
            INSERT INTO quiz_results (user_id, problem_id, result, submitted_at)
            VALUES (?, ?, ?, ?)
        """, ("guest_user", problem_id, result, now_jst))

        conn.commit()
        conn.close()
        return jsonify({"status": "saved"})
    
    except Exception as e:
        print("❌ DBエラー:", e)  # ← エラーの内容を標準出力に出す！
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
