'use client';
import { useState, useEffect } from "react";

export default function SqlQuizApp() {
  const [username, setUsername] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongList, setWrongList] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch("/quizData.json")
      .then((res) => res.json())
      .then((data) => setQuizData(data));
  }, []);

  const quiz = quizData[current];

  const startQuiz = () => {
    if (username.trim()) {
      setIsStarted(true);
    }
  };

  const handleAnswer = (index) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === quiz.answer) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongList((prev) => [...prev, current]);
    }
    setTimeout(() => {
      setShowResult(true);
    }, 300);
  };

  const nextQuestion = () => {
    if (current + 1 >= quizData.length) {
      setFinished(true);
      alert("✅ 今日題目完成！請記得更新明天的 quizData.json！");
      return;
    }
    setSelected(null);
    setShowResult(false);
    setCurrent((prev) => prev + 1);
  };

  const resetQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setCorrectCount(0);
    setWrongList([]);
    setFinished(false);
    setIsStarted(false);
    setUsername("");
  };

  if (!isStarted) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4 text-center">
        <h1 className="text-2xl font-bold">爆擊訓練室</h1>
        <p className="text-sm text-gray-500">請輸入你的暱稱開始練習：</p>
        <input
          type="text"
          placeholder="輸入暱稱..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={startQuiz}
          disabled={!username.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          開始測驗
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="max-w-xl mx-auto p-4 text-center space-y-4">
        <h2 className="text-2xl font-bold">🎉 測驗完成</h2>
        <p className="text-lg">{username} 的正確題數：{correctCount} / {quizData.length}</p>
        {wrongList.length > 0 ? (
          <div className="text-left text-sm">
            <h3 className="font-semibold">需要複習的題目：</h3>
            <ul className="list-disc list-inside">
              {wrongList.map((i) => (
                <li key={i}>第 {i + 1} 題：{quizData[i].question}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>你太猛啦！全部答對 👏</p>
        )}
        <button onClick={resetQuiz} className="bg-green-600 text-white px-4 py-2 rounded">
          重新挑戰
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <div className="border rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold mb-4">
          第 {current + 1} 題：{quiz.question}
        </h2>
        <div className="space-y-2">
          {quiz.options.map((option, index) => {
            const isCorrect = index === quiz.answer;
            const isSelected = selected === index;
            return (
              <button
                key={index}
                disabled={selected !== null}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left px-4 py-2 border rounded
                  ${isSelected && isCorrect ? 'bg-green-100 border-green-500' : ''}
                  ${isSelected && !isCorrect ? 'bg-red-100 border-red-500' : ''}`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {showResult && (
          <div className="pt-4 text-sm text-gray-600">
            <p>✅ 正解：{quiz.options[quiz.answer]}</p>
            <p className="mt-1">📘 解說：{quiz.explanation}</p>
            <button
              onClick={nextQuestion}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              {current + 1 === quizData.length ? "查看結果" : "下一題"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}