import React, { useState, useEffect } from "react";
import axios from "axios";

function QuizPage() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/problems/quiz").then(res => {
      setProblems(res.data);
      setSelectedProblem(res.data[0]);
    });
  }, []);

  const handleChoiceChange = (e) => {
    setSelectedChoice(e.target.value);
    setResult(""); // 結果リセット
  };

  const handleProblemChange = (e) => {
    const problem = problems.find(p => p.id === e.target.value);
    setSelectedProblem(problem);
    setSelectedChoice("");
    setResult("");
  };

  const checkAnswer = async () => {
    const isCorrect = selectedChoice === selectedProblem.answer;
    const resultText = isCorrect ? "✅ 正解です！" : "❌ 不正解です…";
    setResult(resultText);

    // ✅ 正誤記録をサーバーに送信
    try {
      await axios.post("http://localhost:5000/quiz/submit", {
        problem_id: selectedProblem.id,
        result: isCorrect ? "correct" : "wrong"
      });
    } catch (error) {
      console.error("記録送信エラー:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>DevLadder - クイズ問題（選択式）</h2>

      {/* ▼ 問題選択セレクトボックス */}
      {problems.length > 1 && (
        <div style={{ marginBottom: "15px" }}>
          <label>問題を選択: </label>
          <select onChange={handleProblemChange} value={selectedProblem?.id || ""}>
            {problems.map(p => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedProblem ? (
        <div>
          <p><strong>ジャンル:</strong> {selectedProblem.genre}</p>
          <p><strong>説明:</strong> {selectedProblem.description}</p>

          <form>
            {selectedProblem.choices.map((choice, index) => (
              <div key={index}>
                <label>
                  <input
                    type="radio"
                    name="choice"
                    value={choice}
                    checked={selectedChoice === choice}
                    onChange={handleChoiceChange}
                  />
                  {choice}
                </label>
              </div>
            ))}
          </form>

          <button
            onClick={checkAnswer}
            disabled={!selectedChoice}
            style={{ marginTop: "10px" }}
          >
            答え合わせ
          </button>

          {result && (
            <div style={{ marginTop: "15px", fontWeight: "bold" }}>
              {result}
            </div>
          )}
        </div>
      ) : (
        <p>読み込み中...</p>
      )}
    </div>
  );
}

export default QuizPage;
