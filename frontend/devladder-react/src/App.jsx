import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from "./Home";
import CodePage from "./CodePage";
import QuizPage from "./QuizPage";
import LoginForm from "./LoginForm";

function App() {
  const [user, setUser] = useState(null);

  const fetchProfile = async (accessToken) => {
    const res = await fetch('http://localhost:8000/users/me/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      fetchProfile(token);
    }
  }, []);

  return (
    <Router>
      <div style={{ margin: "20px" }}>
        {!user ? (
          <LoginForm onLogin={fetchProfile} />
        ) : (
          <>
            {/* ナビゲーションメニュー */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginBottom: "20px",
              marginRight: "20px",
            }}>
              <nav>
                <span style={{ marginRight: "auto", fontWeight: "bold" }}>
                  ようこそ、{user.username} さん
                </span>
                <Link to="/" style={{ marginRight: "10px" }}>トップ</Link>
                <Link to="/code" style={{ marginRight: "10px" }}>コード問題</Link>
                <Link to="/quiz">クイズ問題</Link>
              </nav>
            </div>

            {/* 各ページのルーティング */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/code" element={<CodePage />} />
              <Route path="/quiz" element={<QuizPage />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
