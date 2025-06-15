# 🚀 DevLadder

**DevLadder**は、初学者向けのコーディング学習プラットフォームです。  
コードを記述し、「実行」または「提出」ボタンで結果を確認・評価できます。
---

## 🎯 主な機能

### 🧑‍💻 1. コード実行問題（Code Practice）
- Java / Python 対応（他言語も拡張予定）
- 標準入力付きのスクリプト実行
- 実行結果に基づき自動で正誤判定
- 履歴は SQLite に保存され、成長を可視化

### 📝 2. クイズ問題（Choice Quiz）
- ジャンル別の選択式問題
- 即時フィードバック（正誤判定）
- 回答履歴はDBに保存され、進捗追跡が可能

---

## ⚙ 使用技術スタック

| 区分            | 技術                                           |
|-----------------|------------------------------------------------|
| フロントエンド  | React / React Router / Monaco Editor / Axios |
| バックエンド    | Python / Flask / Flask-CORS / subprocess      |
| データベース    | SQLite（ローカルファイル型DB）               |
| 実行エンジン    | Java (`javac`, `java`) / Python (`python`)    |

---

## 構成

- `frontend/` - Reactによるフロントエンド
- `backend/` - FlaskによるバックエンドAPI
- `problems/` - コーディング課題（JSON形式）

## 📁 ディレクトリ構成

```plaintext
devladder/
├── backend/
│   ├── app.py               # Flask API メインスクリプト
│   ├── db/
│   │   └── devladder.db     # SQLite データベース
│   ├── runner/              # 一時コード保存・実行用ディレクトリ
│   └── problems/
│       ├── code.json        # コード問題データ
│       └── quiz.json        # クイズ問題データ
├── frontend/
│   └── devladder-react/
│       ├── src/
│       │   ├── App.jsx          # ルーティング設定
│       │   ├── Home.jsx         # トップページ
│       │   ├── CodePage.jsx     # コード問題ページ
│       │   └── QuizPage.jsx     # クイズページ
````

---

## 🧑‍🔧 ローカルセットアップ手順

### 🔹 フロントエンド起動

```bash
cd frontend/devladder-react
npm install
npm start
```

アクセス: [http://localhost:3000](http://localhost:3000)

### 🔹 バックエンド起動

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install flask flask-cors
python app.py
```

アクセス: [http://localhost:5000](http://localhost:5000)

> ✅ 実行には `javac` / `java` / `python` が PATH に通っている必要があります。

---

## 🧪 使用イメージ

### ✔️ コード問題

* 言語を選択 → 問題を選ぶ → コーディング
* 実行ボタンでコンパイル・実行
* 出力＆正誤チェック → 履歴保存

### ✔️ クイズ問題

* 問題を選び、選択肢から回答
* 答え合わせで即時フィードバック
* 回答履歴がDBに自動保存

---

## 🧭 今後の拡張計画

* [ ] ユーザー認証（ログイン / 成績管理）
* [ ] 「テストモード」：未回答・不正解優先出題
* [ ] タグ / 難易度によるフィルタ
* [ ] 問題投稿・編集機能（管理者向け）
* [ ] スマホ対応（PWAサポート）

---

## 📄 ライセンス

This project is licensed under the [MIT License](LICENSE).

---
