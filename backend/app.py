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

@app.route("/run", methods=["POST"])
def run_code():
    data = request.json
    code = data.get("code")
    language = data.get("language")
    mode = data.get("mode", "run")  # デフォルトは「実行」
    problem_id = data.get("problem_id")
    user_input = data.get("input", "")

    # 単純な実行のみ
    if mode == "run":
        output = execute_code(code, user_input, language)
        return jsonify({"output": output})

    # テストモード（test_cases を使って判定）
    elif mode == "test" and problem_id:
        problem = load_problem_by_id(problem_id, "code")
        if not problem or "test_cases" not in problem:
            return jsonify({"error": "問題またはテストケースが見つかりません"}), 400

        results = []
        all_passed = True
        for case in problem["test_cases"]:
            input_data = case["input"]
            expected = (case["expected_output"] or "").strip()
            actual = execute_code(code, input_data, language).strip()

            passed = actual == expected  # ← これを先に
            print("📥 input:", repr(input_data))
            print("📤 expected:", repr(expected))
            print("🔎 actual:", repr(actual))
            print("✅ pass:", passed)

            passed = actual == expected
            if not passed:
                all_passed = False
            results.append({
                "input": input_data,
                "expected": expected,
                "actual": actual,
                "pass": passed
            })

        return jsonify({
            "status": "pass" if all_passed else "fail",
            "results": results
        })

    return jsonify({"error": "無効なリクエスト"}), 400

def load_problem_by_id(problem_id: str, problem_type: str = "code") -> dict:
    """
    指定されたIDの問題を problems/code.json または problems/quiz.json から取得。
    """
    path = "problems/code.json" if problem_type == "code" else "problems/quiz.json"
    try:
        with open(path, encoding="utf-8") as f:
            problems = json.load(f)
            return next((p for p in problems if p["id"] == problem_id), None)
    except Exception as e:
        print("❌ 問題読み込みエラー:", e)
        return None

def execute_code(code: str, input_data: str, language: str) -> str:
    if language == "python":
        return run_python(code, input_data)
    elif language == "java":
        return run_java(code, input_data)
    else:
        return "未対応の言語です"

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
            return compile_proc.stderr

        run_proc = subprocess.run(
            ["java", "-cp", RUNNER_DIR, "Hello"],
            input=user_input,
            capture_output=True,
            text=True,
            timeout=5
        )
        return run_proc.stdout + run_proc.stderr

    except subprocess.TimeoutExpired:
        return "Time Limit Exceeded"
    
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
        return proc.stdout + proc.stderr
    
    except subprocess.TimeoutExpired:
        return "Time Limit Exceeded"


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
