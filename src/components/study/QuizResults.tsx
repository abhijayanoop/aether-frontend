import { useNavigate } from "react-router-dom";
import { Trophy, RotateCcw, Home, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { QuizQuestion } from "@/types";

interface Answer {
  questionIndex: number;
  selectedOption: number;
  isCorrect: boolean;
  timeSpent: number;
}

interface QuizResultsProps {
  questions: QuizQuestion[];
  answers: Answer[];
  title: string;
  totalTime: number;
}

export function QuizResults({
  questions,
  answers,
  title,
  totalTime,
}: QuizResultsProps) {
  const navigate = useNavigate();

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const percentage = (correctCount / questions.length) * 100;

  const getGrade = () => {
    if (percentage >= 90)
      return { grade: "A", color: "text-green-600", emoji: "🌟" };
    if (percentage >= 80)
      return { grade: "B", color: "text-blue-600", emoji: "👍" };
    if (percentage >= 70)
      return { grade: "C", color: "text-yellow-600", emoji: "😊" };
    if (percentage >= 60)
      return { grade: "D", color: "text-orange-600", emoji: "😐" };
    return { grade: "F", color: "text-red-600", emoji: "😢" };
  };

  const grade = getGrade();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Score Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">{grade.emoji}</div>
          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div>
              <div className={`text-6xl font-bold ${grade.color} mb-2`}>
                {percentage.toFixed(0)}%
              </div>
              <p className="text-muted-foreground">
                {correctCount} out of {questions.length} correct
              </p>
            </div>

            <Progress value={percentage} className="h-3" />

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Trophy className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-xl font-bold">
                  {correctCount}/{questions.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Grade</p>
                <p className={`text-3xl font-bold ${grade.color}`}>
                  {grade.grade}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-xl font-bold">{formatTime(totalTime)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Answers */}
      <Card>
        <CardHeader>
          <CardTitle>Review Answers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question, index) => {
            const answer = answers.find((a) => a.questionIndex === index);
            const isCorrect = answer?.isCorrect ?? false;

            return (
              <div
                key={index}
                className={`p-4 border rounded-lg ${
                  isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold mb-2">
                      {index + 1}. {question.question}
                    </p>

                    {/* User's Answer */}
                    {answer && (
                      <div className="mb-2">
                        <p className="text-sm text-muted-foreground">
                          Your answer:
                        </p>
                        <p
                          className={
                            isCorrect ? "text-green-700" : "text-red-700"
                          }
                        >
                          {question.options[answer.selectedOption]}
                        </p>
                      </div>
                    )}

                    {/* Correct Answer */}
                    {!isCorrect && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Correct answer:
                        </p>
                        <p className="text-green-700">
                          {question.options[question.correctAnswer]}
                        </p>
                      </div>
                    )}

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="mt-2 p-2 bg-background/50 rounded">
                        <p className="text-sm">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake Quiz
        </Button>
        <Button onClick={() => navigate("/materials")}>
          <Home className="mr-2 h-4 w-4" />
          Back to Materials
        </Button>
      </div>
    </div>
  );
}
