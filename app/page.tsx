
'use client';
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";

const quizData = [
  {
    question: "你想選出每個部門薪資最高的員工，應該使用下列哪個語法？",
    options: [
      "GROUP BY DepartmentID 搭配 MAX(Salary)",
      "子查詢找出 MAX 再 JOIN 回原表",
      "ROW_NUMBER() OVER (PARTITION BY DepartmentID ORDER BY Salary DESC)",
      "以上皆可"
    ],
    answer: 3,
    explanation:
      "前三種方式都可以達成目標，但使用 ROW_NUMBER 搭配 PARTITION BY 是最靈活、常見的做法，尤其當你需要取回整筆資料時。"
  },
];

export default function SqlQuizApp() {
  const [username, setUsername] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongList, setWrongList] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const quiz = quizData[current];

  const startQuiz = () => {
    if (username.trim()) {
      setIsStarted(true);
    }
  };

  const handleAnswer = (index: number) => {
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
        <p className="text-sm text-muted-foreground">請輸入你的暱稱開始練習：</p>
        <Input
          placeholder="輸入暱稱..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button onClick={startQuiz} disabled={!username.trim()}>
          開始測驗
        </Button>
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
        <Button onClick={resetQuiz}>重新挑戰</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">
            第 {current + 1} 題：{quiz.question}
          </h2>
          <div className="space-y-2">
            {quiz.options.map((option, index) => {
              const isCorrect = index === quiz.answer;
              const isSelected = selected === index;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left"
                  disabled={selected !== null}
                  onClick={() => handleAnswer(index)}
                >
                  {isSelected && isCorrect && <Check className="mr-2 text-green-500" />}
                  {isSelected && !isCorrect && <X className="mr-2 text-red-500" />}
                  {option}
                </Button>
              );
            })}
          </div>
          {showResult && (
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                ✅ 正解：{quiz.options[quiz.answer]}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                📘 解說：{quiz.explanation}
              </p>
              <Button className="mt-4" onClick={nextQuestion}>
                {current + 1 === quizData.length ? "查看結果" : "下一題"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
