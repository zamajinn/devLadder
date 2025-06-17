// Home.jsx
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>🚀 DevLadder</h1>
      <p>未経験から応用まで。コードで学び、実力を積み上げよう。</p>

      <h2>🎯 学習モードを選択</h2>
      <ul>
        <li>
          <Link to="/code">💻 コード演習モード（Java）</Link>
        </li>
        <li>
          <Link to="/quiz">🧠 クイズモード（選択式）</Link>
        </li>
      </ul>

      <hr />

      <h3>📚 このアプリについて</h3>
      <p>
        DevLadder は、段階的にプログラミングを学べる学習アプリです。
        コーディング力・理解力・思考力をバランスよく伸ばします。
      </p>
    </div>
  );
}

export default Home;
