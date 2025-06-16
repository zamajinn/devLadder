
# 🐍 DevLadder Backend (Flask)

This is the backend for **DevLadder**, an educational platform that provides coding and quiz challenges.  
It exposes REST APIs for running code, fetching problems, and storing user results.

## 🚀 Getting Started

### 1. Install dependencies

```bash
pip install -r requirements.txt
````

(Flask, Flask-CORS, sqlite3 など)

### 2. Run the server

```bash
python app.py
```

The API will be available at: [http://localhost:5000](http://localhost:5000)

---

## 📂 Project Structure

```
backend/
├── app.py              # Main Flask app
├── runner/             # Temporary folder to save and run user code
├── db/
│   └── devladder.db    # SQLite database file
├── problems/
│   ├── code.json       # Code problems
│   └── quiz.json       # Quiz problems
└── requirements.txt    # Python dependencies
```

---

## 🔌 API Endpoints

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| `GET`  | `/problems/code` | Fetch list of code problems          |
| `GET`  | `/problems/quiz` | Fetch list of quiz questions         |
| `POST` | `/run`           | Run code in a given language         |
| `POST` | `/quiz/submit`   | Save answer result (correct / wrong) |

---

## 📄 Code Execution

* Supported Languages:

  * Java
  * Python (more planned)
* Code is saved to `runner/` and executed via `subprocess`
* Supports standard input via POST body

Example request:

```json
{
  "code": "print('Hello')",
  "language": "python",
  "input": "",
  "mode": "run" or "test"
}
```

---

## 🧠 Database (SQLite)

Table: `quiz_results`

| Column      | Type    | Description          |
| ----------- | ------- | -------------------- |
| id          | INTEGER | Auto-increment ID    |
| user\_id    | TEXT    | User identifier      |
| problem\_id | TEXT    | Problem identifier   |
| result      | TEXT    | "correct" or "wrong" |
| updated\_at | TEXT    | Timestamp (optional) |

---

## 📌 Future Plans

* Add Dockerfile & container support
* User authentication support
* More language runners (C, JavaScript, etc.)
* Result history API

---

## 📃 License

MIT License
