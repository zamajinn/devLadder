
## ✅ 改善提案ポイント

### 1. ✅ **セクション重複整理**

「Project Overview」「API Connection」「Folder Structure」などが2重に書かれている部分は、英語だけまたは和訳をコメントにする形が見やすいです。

### 2. ✅ **Create React Appセクションの位置調整**

CRA部分は末尾に持っていき、DevLadder独自の情報を上部に集めた方が開発者に親切です。

---

## 🧾 改訂案（最終形）

```markdown
# 🚀 DevLadder Frontend

This is the React frontend for **DevLadder**, an educational platform supporting code and quiz-based learning.

---

## 🧑‍💻 Features

- Supports **Java / Python** code execution via standard input
- Interactive **code editor** with **Monaco**
- Auto **grading** with multiple test cases
- Quiz mode with **multiple choice** and instant feedback
- Tracks submission results via API

---

## 🔌 API Endpoints (via Flask backend)

| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| GET    | `/problems/code`   | Get list of code problems       |
| GET    | `/problems/quiz`   | Get list of quiz problems       |
| POST   | `/run`             | Run submitted code              |
| POST   | `/quiz/submit`     | Submit quiz answer              |

Backend is expected to run at: `http://localhost:5000`

---

## 📁 Folder Structure (src/)

```

src/
├── App.jsx          # Router and layout
├── Home.jsx         # Mode selector (code/quiz)
├── CodePage.jsx     # Coding problems
├── QuizPage.jsx     # Quiz problems
└── index.js         # Entry point

````

---

## ▶ Getting Started

```bash
cd frontend/devladder-react
npm install
npm start
````

Then open: [http://localhost:3000](http://localhost:3000)

---

## 🛠 Future Plans

* User authentication and progress saving
* Prioritized test mode (incorrect first)
* Difficulty and tag-based filters
* Responsive / PWA support

---

## 📦 Based on Create React App

This project uses [Create React App](https://github.com/facebook/create-react-app).

Available scripts:

```bash
npm start        # Launch development server
npm run build    # Create production build
npm test         # Run test watcher
```

> You can safely ignore/remove `App.test.js` and `setupTests.js` if unused.

---
