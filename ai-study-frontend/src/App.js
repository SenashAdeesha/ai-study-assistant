import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .env { min-height: 100vh; background: #f7f3ec; font-family: 'Lora', Georgia, serif; display: flex; flex-direction: column; }
  .topbar { background: #2c2416; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #c8a84b; }
  .topbar-title { color: #f0e6c8; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; }
  .topbar-right { display: flex; gap: 8px; align-items: center; }
  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .d1 { background: #e85c4a; } .d2 { background: #c8a84b; } .d3 { background: #5a9e6f; }
  .main { display: flex; flex: 1; overflow: hidden; min-height: 0; }
  .sidebar { width: 220px; background: #ede8de; border-right: 1px solid #c9bfa8; padding: 20px 14px; display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
  .sidebar-section { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #8a7d65; letter-spacing: 0.1em; text-transform: uppercase; margin: 12px 0 6px; padding-left: 8px; }
  .sidebar-item { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: 6px; cursor: pointer; font-size: 13px; color: #3d3426; transition: background 0.15s; }
  .sidebar-item:hover { background: #d9d1c2; }
  .sidebar-item.active { background: #2c2416; color: #f0e6c8; }
  .sidebar-icon { font-size: 14px; width: 18px; text-align: center; }
  .content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .toolbar { background: #ede8de; border-bottom: 1px solid #c9bfa8; padding: 8px 20px; display: flex; gap: 8px; align-items: center; }
  .tool-btn { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 5px 14px; border-radius: 4px; border: 1px solid #b0a48a; background: #f7f3ec; color: #3d3426; cursor: pointer; letter-spacing: 0.04em; transition: all 0.15s; }
  .tool-btn:hover { background: #2c2416; color: #f0e6c8; border-color: #2c2416; }
  .tool-btn.active { background: #2c2416; color: #f0e6c8; border-color: #2c2416; }
  .editor-area { flex: 1; display: flex; gap: 0; overflow: hidden; }
  .note-pane { flex: 1; display: flex; flex-direction: column; padding: 28px 32px; overflow-y: auto; }
  .note-header { display: flex; align-items: baseline; gap: 14px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid #c9bfa8; }
  .note-title { font-size: 22px; font-weight: 600; color: #1e1810; line-height: 1.2; }
  .note-date { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8a7d65; }
  .note-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; padding: 2px 8px; background: #c8a84b22; color: #7a6220; border: 1px solid #c8a84b66; border-radius: 3px; letter-spacing: 0.06em; }
  .note-textarea { flex: 1; min-height: 220px; font-family: 'Lora', Georgia, serif; font-size: 15px; line-height: 1.9; color: #2c2416; background: transparent; border: none; resize: none; outline: none; caret-color: #c8a84b; width: 100%; }
  .note-textarea::placeholder { color: #b0a48a; font-style: italic; }
  .output-pane { width: 760px; background: #ede8de; border-left: 1px solid #c9bfa8; display: flex; flex-direction: column; overflow: hidden; }
  .output-header { padding: 14px 18px; border-bottom: 1px solid #c9bfa8; display: flex; align-items: center; justify-content: space-between; }
  .output-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #3d3426; letter-spacing: 0.1em; text-transform: uppercase; }
  .output-mode { font-family: 'JetBrains Mono', monospace; font-size: 10px; padding: 3px 8px; border-radius: 3px; background: #c8a84b; color: #1e1810; letter-spacing: 0.06em; }
  .output-body { flex: 1; min-height: 520px; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
  .loading-state { display: flex; align-items: center; gap: 8px; color: #8a7d65; font-size: 13px; font-style: italic; }
  .spinner { width: 16px; height: 16px; border: 2px solid #c9bfa8; border-top-color: #c8a84b; border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .result-block { background: #f7f3ec; border-radius: 6px; padding: 14px; border: 1px solid #c9bfa8; font-size: 13px; line-height: 1.8; color: #2c2416; }
  .result-block h4 { font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; color: #8a7d65; margin-bottom: 8px; }
  .quiz-card { background: #f7f3ec; border-radius: 6px; border: 1px solid #c9bfa8; overflow: hidden; margin-bottom: 8px; }
  .quiz-q { padding: 12px; font-size: 13px; font-weight: 600; color: #1e1810; border-bottom: 1px solid #c9bfa8; }
  .quiz-opts { padding: 8px; }
  .quiz-opt { display: flex; align-items: center; gap: 8px; padding: 5px 6px; border-radius: 4px; cursor: pointer; font-size: 12px; color: #3d3426; transition: background 0.12s; }
  .quiz-opt:hover { background: #ede8de; }
  .quiz-opt.correct { background: #5a9e6f22; color: #2d6040; }
  .quiz-opt.wrong { background: #e85c4a22; color: #8a2315; }
  .quiz-tools { display: flex; justify-content: flex-end; margin-top: 8px; }
  .show-answers-btn { padding: 6px 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; border-radius: 4px; border: 1px solid #b0a48a; background: #ede8de; color: #3d3426; cursor: pointer; }
  .hard-quiz-btn { margin-left: 8px; padding: 6px 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; border-radius: 4px; border: 1px solid #a8882b; background: #c8a84b; color: #1e1810; cursor: pointer; }
  .quiz-answer-line { margin: 12px 10px 14px; padding: 16px 18px; border-radius: 8px; background: #5a9e6f18; color: #2d6040; font-size: 15px; line-height: 2; border: 1px solid #5a9e6f44; min-height: 120px; }
  .essay-card { background: #f7f3ec; border-radius: 6px; border: 1px solid #c9bfa8; overflow: hidden; margin-bottom: 10px; }
  .essay-q { padding: 12px; font-size: 14px; font-weight: 600; color: #1e1810; border-bottom: 1px solid #c9bfa8; }
  .essay-actions { padding: 10px 12px; border-top: 1px solid #c9bfa8; display: flex; justify-content: flex-end; }
  .essay-answer-btn { padding: 6px 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; border-radius: 4px; border: 1px solid #a8882b; background: #c8a84b; color: #1e1810; cursor: pointer; }
  .hard-essay-btn { margin-left: 8px; padding: 6px 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; border-radius: 4px; border: 1px solid #6f5a21; background: #a8882b; color: #f7f3ec; cursor: pointer; }
  .essay-answer { margin: 10px 12px 12px; padding: 14px; border-radius: 6px; background: #efe8d8; border: 1px solid #d2c4a3; font-size: 13px; line-height: 1.9; color: #2c2416; }
  .opt-letter { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; width: 18px; height: 18px; border-radius: 3px; background: #c9bfa8; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .statusbar { background: #2c2416; padding: 4px 24px; display: flex; align-items: center; justify-content: space-between; }
  .status-txt { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #8a7d65; letter-spacing: 0.06em; }
  .action-btns { display: flex; gap: 6px; padding: 14px 18px; border-top: 1px solid #c9bfa8; }
  .act-btn { flex: 1; padding: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; border-radius: 4px; border: 1px solid #b0a48a; background: #f7f3ec; color: #3d3426; cursor: pointer; letter-spacing: 0.05em; transition: all 0.15s; text-align: center; }
  .act-btn:hover { background: #2c2416; color: #f0e6c8; border-color: #2c2416; }
  .act-btn.primary { background: #c8a84b; border-color: #c8a84b; color: #1e1810; }
  .act-btn.primary:hover { background: #a8882b; border-color: #a8882b; }
  .empty-state { text-align: center; padding: 32px 16px; color: #8a7d65; font-size: 13px; font-style: italic; }
  .empty-icon { font-size: 28px; margin-bottom: 10px; opacity: 0.5; }
  .char-count { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #b0a48a; text-align: right; margin-top: 8px; }
  .mode-tabs { display: flex; gap: 0; border-bottom: 1px solid #c9bfa8; }
  .mode-tab { flex: 1; padding: 8px; font-family: 'JetBrains Mono', monospace; font-size: 10px; text-align: center; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; color: #8a7d65; border-bottom: 2px solid transparent; transition: all 0.15s; }
  .mode-tab.active { color: #3d3426; border-bottom-color: #c8a84b; }
  .question-bar { display: flex; gap: 6px; padding: 10px 18px; border-top: 1px solid #c9bfa8; background: #e8e0d0; }
  .q-input { flex: 1; font-family: 'Lora', serif; font-size: 13px; padding: 7px 10px; border-radius: 4px; border: 1px solid #b0a48a; background: #f7f3ec; color: #2c2416; outline: none; }
  .q-input:focus { border-color: #c8a84b; }
  .q-btn { padding: 7px 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; border-radius: 4px; border: none; background: #c8a84b; color: #1e1810; cursor: pointer; }
`;
const API_BASE = "http://localhost:5050";

export default function App() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("summarize");
  const [history, setHistory] = useState([]);
  const [currentTab, setCurrentTab] = useState("result");
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [question, setQuestion] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [revealedQuiz, setRevealedQuiz] = useState({});
  const [essayLoading, setEssayLoading] = useState({});

  const today = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  const modeBadges = { summarize: "SUMMARY", quiz: "QUIZ", essay: "ESSAY", ask: "Q&A" };

  const normalizeQuizData = (parsed) => {
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.questions)) return parsed.questions;
    if (Array.isArray(parsed?.quiz)) return parsed.quiz;
    throw new Error("Quiz response is not in expected format.");
  };

  const normalizeEssayData = (parsed) => {
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.questions)) return parsed.questions;
    if (Array.isArray(parsed?.essay)) return parsed.essay;
    throw new Error("Essay response is not in expected format.");
  };

  const handleAction = async (options = {}) => {
    let url = "";

    if (mode === "summarize") url = `${API_BASE}/summarize`;
    if (mode === "quiz") url = `${API_BASE}/quiz`;
    if (mode === "essay") url = `${API_BASE}/essay`;
    if (mode === "ask") url = `${API_BASE}/ask`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: notes,
        question: question || "Explain simply",
        difficulty: options.difficulty || "normal",
      }),
    });

    if (!res.ok) {
      let message = `Request failed with status ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData?.error) {
          message = errorData.error;
        }
      } catch {
        // Keep the default status message when error body is not JSON.
      }
      throw new Error(message);
    }

    const data = await res.json();
    const responseText = data?.result || "";
    setResult(responseText);
    return responseText;
  };

  async function runAction() {
    if (!notes.trim()) { alert("Please paste some notes first."); return; }
    if (mode === "ask" && !question.trim()) { alert("Please type a question."); return; }

    setLoading(true);
    setStatus("Running…");

    try {
      const output = await handleAction();
      const time = new Date().toLocaleTimeString();

      if (mode === "quiz") {
        try {
          const clean = output.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(clean);
          const quizData = normalizeQuizData(parsed);
          setSelectedHistoryIndex(null);
          setHistory((h) => [{ type: "quiz", data: quizData, time, difficulty: "normal" }, ...h]);
        } catch {
          setSelectedHistoryIndex(null);
          setHistory((h) => [{ type: "text", content: output, label: "Quiz", time }, ...h]);
        }
      } else if (mode === "essay") {
        try {
          const clean = output.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(clean);
          const essayData = normalizeEssayData(parsed);
          const dataWithAnswers = essayData.map((entry) => ({ ...entry, answer: "" }));
          setSelectedHistoryIndex(null);
          setHistory((h) => [{ type: "essay", data: dataWithAnswers, time, difficulty: "normal" }, ...h]);
        } catch {
          setSelectedHistoryIndex(null);
          setHistory((h) => [{ type: "text", content: output, label: "Essay Questions", time }, ...h]);
        }
      } else {
        setSelectedHistoryIndex(null);
        setHistory((h) => [
          {
            type: "text",
            content: output,
            label: mode === "summarize" ? "Summary" : mode === "essay" ? "Essay Questions" : "Answer",
            time,
          },
          ...h,
        ]);
      }

      if (mode === "ask") setQuestion("");
      setStatus("Done · " + new Date().toLocaleTimeString());
    } catch (error) {
      const message = error?.message || "Could not connect. Please try again.";
      setSelectedHistoryIndex(null);
      setHistory((h) => [{ type: "error", time: new Date().toLocaleTimeString(), message }, ...h]);
      setStatus(`Error · ${message}`);
    } finally {
      setLoading(false);
    }
  }

  async function runHardQuiz() {
    if (!notes.trim()) {
      alert("Please paste some notes first.");
      return;
    }

    setLoading(true);
    setStatus("Generating harder quiz…");

    try {
      const output = await handleAction({ difficulty: "hard" });
      const time = new Date().toLocaleTimeString();

      try {
        const clean = output.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        const quizData = normalizeQuizData(parsed);
        setSelectedHistoryIndex(null);
        setHistory((h) => [{ type: "quiz", data: quizData, time, difficulty: "hard" }, ...h]);
      } catch {
        setSelectedHistoryIndex(null);
        setHistory((h) => [{ type: "text", content: output, label: "Hard Quiz", time }, ...h]);
      }

      setStatus("Done · " + new Date().toLocaleTimeString());
    } catch (error) {
      const message = error?.message || "Could not connect. Please try again.";
      setHistory((h) => [{ type: "error", time: new Date().toLocaleTimeString(), message }, ...h]);
      setStatus(`Error · ${message}`);
    } finally {
      setLoading(false);
    }
  }

  async function runHardEssay() {
    if (!notes.trim()) {
      alert("Please paste some notes first.");
      return;
    }

    setLoading(true);
    setStatus("Generating harder essay questions…");

    try {
      const res = await fetch(`${API_BASE}/essay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: notes,
          difficulty: "hard",
        }),
      });

      if (!res.ok) {
        let message = `Request failed with status ${res.status}`;
        try {
          const errorData = await res.json();
          if (errorData?.error) {
            message = errorData.error;
          }
        } catch {
          // Keep default message.
        }
        throw new Error(message);
      }

      const data = await res.json();
      const output = data?.result || "";
      const time = new Date().toLocaleTimeString();

      try {
        const clean = output.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        const essayData = normalizeEssayData(parsed);
        const dataWithAnswers = essayData.map((entry) => ({ ...entry, answer: "" }));
        setSelectedHistoryIndex(null);
        setHistory((h) => [{ type: "essay", data: dataWithAnswers, time, difficulty: "hard" }, ...h]);
      } catch {
        setSelectedHistoryIndex(null);
        setHistory((h) => [{ type: "text", content: output, label: "Hard Essay Questions", time }, ...h]);
      }

      setStatus("Done · " + new Date().toLocaleTimeString());
    } catch (error) {
      const message = error?.message || "Could not connect. Please try again.";
      setHistory((h) => [{ type: "error", time: new Date().toLocaleTimeString(), message }, ...h]);
      setStatus(`Error · ${message}`);
    } finally {
      setLoading(false);
    }
  }

  function answerQuiz(histIdx, qIdx, optIdx) {
    const key = `${histIdx}-${qIdx}`;
    setQuizAnswers((prev) => {
      if (prev[key] !== undefined) return prev;
      return { ...prev, [key]: optIdx };
    });
  }

  function toggleReveal(histIdx) {
    setRevealedQuiz((prev) => ({ ...prev, [histIdx]: !prev[histIdx] }));
  }

  async function generateEssayAnswer(histIdx, questionIdx, essayQuestion) {
    const loadingKey = `${histIdx}-${questionIdx}`;
    setEssayLoading((prev) => ({ ...prev, [loadingKey]: true }));
    setStatus("Generating essay answer…");

    try {
      const res = await fetch(`${API_BASE}/essay-answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: notes,
          essayQuestion,
        }),
      });

      if (!res.ok) {
        let message = `Request failed with status ${res.status}`;
        try {
          const errorData = await res.json();
          if (errorData?.error) {
            message = errorData.error;
          }
        } catch {
          // Keep default message.
        }
        throw new Error(message);
      }

      const data = await res.json();
      const answerText = data?.result || "Answer not available.";

      setHistory((prev) =>
        prev.map((item, i) => {
          if (i !== histIdx || item.type !== "essay") return item;
          return {
            ...item,
            data: item.data.map((entry, idx) => {
              if (idx !== questionIdx) return entry;
              return { ...entry, answer: answerText };
            }),
          };
        })
      );
      setStatus("Done · " + new Date().toLocaleTimeString());
    } catch (error) {
      const message = error?.message || "Could not generate essay answer.";
      setHistory((h) => [{ type: "error", time: new Date().toLocaleTimeString(), message }, ...h]);
      setStatus(`Error · ${message}`);
    } finally {
      setEssayLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  }

  const displayHistory =
    currentTab === "history"
      ? history
      : selectedHistoryIndex !== null && history[selectedHistoryIndex]
      ? [history[selectedHistoryIndex]]
      : history.slice(0, 1);

  return (
    <>
      <style>{styles}</style>
      <div className="env">
        {/* Top Bar */}
        <div className="topbar">
          <span className="topbar-title">✦ Study Atelier</span>
          <div className="topbar-right">
            <div className="dot d1" /><div className="dot d2" /><div className="dot d3" />
          </div>
        </div>

        <div className="main">
          {/* Main Content */}
          <div className="content">
            {/* Toolbar */}
            <div className="toolbar">
              {["summarize", "quiz", "essay", "ask"].map((m) => (
                <button
                  key={m}
                  className={`tool-btn${mode === m ? " active" : ""}`}
                  onClick={() => setMode(m)}
                >
                  {m === "summarize"
                    ? "Summarize"
                    : m === "quiz"
                    ? "Generate Quiz"
                    : m === "essay"
                    ? "Essay Questions"
                    : "Ask Question"}
                </button>
              ))}
            </div>

            <div className="editor-area">
              {/* Notes Pane */}
              <div className="note-pane">
                <div className="note-header">
                  <h1 className="note-title">Study smarter with a clean, modern assistant</h1>
                  <span className="note-tag">ACTIVE</span>
                  <span className="note-date">{today}</span>
                </div>
                <textarea
                  className="note-textarea"
                  placeholder="Paste or type your notes here… The assistant will read from this text."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="char-count">{wordCount} word{wordCount !== 1 ? "s" : ""}</div>
              </div>

              {/* Output Pane */}
              <div className="output-pane">
                <div className="output-header">
                  <span className="output-label">Output</span>
                  <span className="output-mode">{modeBadges[mode]}</span>
                </div>

                <div className="mode-tabs">
                  <div
                    className={`mode-tab${currentTab === "result" ? " active" : ""}`}
                    onClick={() => setCurrentTab("result")}
                  >Result</div>
                  <div
                    className={`mode-tab${currentTab === "history" ? " active" : ""}`}
                    onClick={() => setCurrentTab("history")}
                  >History</div>
                </div>

                <div className="output-body">
                  {loading ? (
                    <div className="loading-state">
                      <div className="spinner" />
                      Processing your notes…
                    </div>
                  ) : result && displayHistory.length === 0 ? (
                    <div className="result-block">
                      <h4>Latest Result</h4>
                      {result.split("\n").map((line, i) => (
                        <span key={i}>{line}<br /></span>
                      ))}
                    </div>
                  ) : displayHistory.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">⊘</div>
                      Paste your notes and press Run to begin.
                    </div>
                  ) : (
                    displayHistory.map((item, idx) => {
                      if (item.type === "error") {
                        return (
                          <div key={idx} className="result-block" style={{ borderColor: "#e85c4a" }}>
                            <h4>Error · {item.time}</h4>
                            {item.message || "Could not connect. Please try again."}
                          </div>
                        );
                      }
                      if (item.type === "quiz") {
                        const letters = ["A", "B", "C", "D"];
                        const showAnswers = !!revealedQuiz[idx];
                        return (
                          <div key={idx}>
                            <div className="result-block">
                              <h4>{item.difficulty === "hard" ? "Hard Quiz" : "Quiz"} · {item.time}</h4>
                              <div className="quiz-tools">
                                <button className="show-answers-btn" onClick={() => toggleReveal(idx)}>
                                  {showAnswers ? "Hide Answers" : "Show Answers"}
                                </button>
                                <button className="hard-quiz-btn" onClick={runHardQuiz}>
                                  Generate Harder Quiz
                                </button>
                              </div>
                            </div>
                            {item.data.map((q, qi) => {
                              const answerKey = `${idx}-${qi}`;
                              const chosen = quizAnswers[answerKey];
                              const answerIndex = typeof q.ans === "number" ? q.ans : -1;
                              const answerLetter = answerIndex >= 0 ? letters[answerIndex] : "-";
                              const answerText = answerIndex >= 0 ? q.opts?.[answerIndex] : "Answer unavailable";
                              return (
                                <div key={qi} className="quiz-card">
                                  <div className="quiz-q">{qi + 1}. {q.q}</div>
                                  <div className="quiz-opts">
                                    {q.opts.map((opt, oi) => {
                                      let cls = "";
                                      if (chosen !== undefined) {
                                        if (oi === q.ans) cls = "correct";
                                        else if (oi === chosen) cls = "wrong";
                                      }
                                      return (
                                        <div
                                          key={oi}
                                          className={`quiz-opt ${cls}`}
                                          onClick={() => answerQuiz(idx, qi, oi)}
                                        >
                                          <span className="opt-letter">{letters[oi]}</span>
                                          {opt}
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {showAnswers && (
                                    <div className="quiz-answer-line">
                                      Answer: {answerLetter}. {answerText}
                                      {q.explanation ? ` - ${q.explanation}` : ""}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      }
                      if (item.type === "essay") {
                        return (
                          <div key={idx}>
                            <div className="result-block">
                              <h4>{item.difficulty === "hard" ? "Hard Essay Questions" : "Essay Questions"} · {item.time}</h4>
                              <div className="quiz-tools">
                                <button className="hard-essay-btn" onClick={runHardEssay}>
                                  Generate Harder Essay Questions
                                </button>
                              </div>
                            </div>
                            {item.data.map((q, qi) => {
                              const loadingKey = `${idx}-${qi}`;
                              const isLoadingAnswer = !!essayLoading[loadingKey];
                              return (
                                <div key={qi} className="essay-card">
                                  <div className="essay-q">{qi + 1}. {q.q}</div>
                                  <div className="essay-actions">
                                    <button
                                      className="essay-answer-btn"
                                      disabled={isLoadingAnswer}
                                      onClick={() => generateEssayAnswer(idx, qi, q.q)}
                                    >
                                      {isLoadingAnswer ? "Generating..." : "Generate Answer"}
                                    </button>
                                  </div>
                                  {q.answer && <div className="essay-answer">{q.answer}</div>}
                                </div>
                              );
                            })}
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="result-block">
                          <h4>{item.label} · {item.time}</h4>
                          {item.content.split("\n").map((line, i) => (
                            <span key={i}>{line}<br /></span>
                          ))}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Ask Question Input */}
                {mode === "ask" && (
                  <div className="question-bar">
                    <input
                      className="q-input"
                      placeholder="Ask a question about your notes…"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") runAction(); }}
                    />
                    <button className="q-btn" onClick={runAction}>↵</button>
                  </div>
                )}

                {/* Run / Clear buttons */}
                {mode !== "ask" && (
                  <div className="action-btns">
                    <button className="act-btn primary" onClick={runAction} disabled={loading}>
                      ▶ Run
                    </button>
                    <button className="act-btn" onClick={() => { setHistory([]); setQuizAnswers({}); setRevealedQuiz({}); setEssayLoading({}); setSelectedHistoryIndex(null); }}>
                      ✕ Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="statusbar">
          <span className="status-txt">{status}</span>
          <span className="status-txt">AI Study Assistant v2.0</span>
        </div>
      </div>
    </>
  );

  
}