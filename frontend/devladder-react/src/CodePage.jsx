import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

function CodePage() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("java");
  const [resultStatus, setResultStatus] = useState(null);  // "correct" or "wrong"

  useEffect(() => {
    axios.get("http://localhost:5000/problems/code").then(res => {
      const filtered = res.data.filter(p => p.language === language);
      if (filtered.length > 0) {
        setProblems(filtered);
        setSelectedProblem(filtered[0]);
        setCode(filtered[0].template_code);
        setOutput("");
      } else {
        setProblems([]);
        setSelectedProblem(null);
        setCode("");
        setOutput("選択された言語に対応する問題がありません。");
      }
    });
  }, [language]);

  const handleSelectChange = (e) => {
    const problem = problems.find(p => p.id === e.target.value);
    setSelectedProblem(problem);
    setCode(problem.template_code);
    setOutput(""); // 出力リセット
    setResultStatus(null);//正誤リセット

    // ✅ テストケース1の入力をデフォルト表示
    if (problem.test_cases?.length > 0) {
      setInput(problem.test_cases[0].input || "");
    } else {
      setInput("");
    }
  };

  // 実行だけ（正誤チェック・送信なし）
  const runCode = async () => {
    try {
      const res = await axios.post("http://localhost:5000/run", { 
        code,
        input,
        language: selectedProblem.language,
        mode: "run"
      });
      const actualOutput = res.data.output.trim();
      setOutput(actualOutput);

      // 正誤判定はrunモードで行わない
      setResultStatus(null);

    } catch (err) {
      setOutput("エラー: " + err.message);
      setResultStatus(null);
    }
  };

  const checkAnswer = (actual, expected) => {
    return (actual?.trim() || "") === (expected?.trim() || "");
  };

  // 提出（実行＋正誤判定＋記録）
  const submitCode = async () => {
    try {
      const res = await axios.post("http://localhost:5000/run", { 
        code,
        language: selectedProblem.language,
        problem_id: selectedProblem.id,
        mode: "test"  // ✅ これが必要
      });

      // サーバーからのテスト結果に応じて正誤を判定
      const isCorrect = res.data.status === "pass";
      setResultStatus(isCorrect ? "correct" : "wrong");

      if (res.data.status === "pass") {
        setResultStatus("correct");
      } else {
        setResultStatus("wrong");
      }

      const resultSummary = res.data.results.map(r => {
        return `【入力】${r.input}\n【期待】${r.expected}\n【実行】${r.actual}\n【結果】${r.pass ? "✅" : "❌"}`;
      }).join("\n\n");

      setOutput(resultSummary);

      await axios.post("http://localhost:5000/quiz/submit", {
        problem_id: selectedProblem.id,
        result: isCorrect ? "correct" : "wrong"
      });

    } catch (err) {
      setOutput("エラー: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>DevLadder Code Runner</h2>

      {/* 問題セレクト */}
      <label>問題を選択: </label>
      <select onChange={handleSelectChange} value={selectedProblem?.id || ""}>
        {problems.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>

      <label style={{ marginLeft: "10px" }}>言語を選択: </label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ marginBottom: "10px" }}>
        <option value="java">Java</option>
        <option value="python">Python</option>
      </select>

      {/* 問題の説明 */}
      {selectedProblem && (
        <div style={{ margin: "10px 0" }}>
          <p><strong>ジャンル:</strong> {selectedProblem.genre}</p>
          <p><strong>説明:</strong> {selectedProblem.description}</p>
        </div>
      )}

      {/* コードエディタ */}
      <Editor
        height="350px"
        language={language}
        value={code}
        onChange={(val) => setCode(val || "")}
      />

      <h3>標準入力（動作確認用）:</h3>
      <p style={{ fontSize: "0.9em", color: "#555" }}>
        ※これは <strong>実行ボタン</strong> のみ有効です。<br />
        <strong>提出</strong> ではテストケースを使用して判定します。
      </p>
      <textarea
        rows="5"
        cols="60"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="例: 10\n20"
      />

      <button onClick={runCode} style={{ marginRight: "10px" }}>▶ 実行</button>
      <button onClick={submitCode}>✅ 提出</button>

      {/* 出力結果 */}
      <h3>出力:</h3>
      <pre>
        {output}
        {resultStatus && (
          "\n" + (resultStatus === "correct" ? "✅ 正解" : "❌ 不正解")
        )}
      </pre>


    </div>
  );
}

export default CodePage;