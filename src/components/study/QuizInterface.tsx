import { useState, useEffect } from "react";
import { Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types";

interface QuizInterfaceProps {
  questions: QuizQuestion[];
  onComplete: (
    score: number,
    totalQuestions: number,
    answers: number[],
  ) => void;
  timeLimit?: number; // in minutes
}

export function QuizInterface({
  questions,
  onComplete,
  timeLimit,
}: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1),
  );
  const [timeRemaining, setTimeRemaining] = useState(
    timeLimit ? timeLimit * 60 : null,
  );
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = selectedAnswers.filter((a) => a !== -1).length;

  // Timer
  useEffect(() => {
    if (!timeRemaining) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev && prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    onComplete(score, questions.length, selectedAnswers);
    setShowResult(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (showResult) {
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <QuizResults
        score={score}
        totalQuestions={questions.length}
        percentage={percentage}
        questions={questions}
        selectedAnswers={selectedAnswers}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Question {currentIndex + 1}</h2>
          <p className="text-sm text-muted-foreground">
            {answeredCount} of {questions.length} answered
          </p>
        </div>

        {timeRemaining !== null && (
          <Badge
            variant={timeRemaining < 60 ? "destructive" : "secondary"}
            className="text-lg px-4 py-2"
          >
            <Clock className="mr-2 h-4 w-4" />
            {formatTime(timeRemaining)}
          </Badge>
        )}
      </div>

      {/* Progress */}
      <Progress value={progress} />

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all",
                "hover:border-primary hover:bg-primary/5",
                selectedAnswers[currentIndex] === index
                  ? "border-primary bg-primary/10"
                  : "border-border",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center",
                    selectedAnswers[currentIndex] === index
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground",
                  )}
                >
                  <span className="text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-8 h-8 rounded-full text-xs font-medium transition-all",
                index === currentIndex
                  ? "bg-primary text-primary-foreground"
                  : selectedAnswers[index] !== -1
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentIndex === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={answeredCount < questions.length}
          >
            Submit Quiz
            <CheckCircle2 className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Warning for unanswered questions */}
      {currentIndex === questions.length - 1 &&
        answeredCount < questions.length && (
          <Alert>
            <AlertDescription>
              You have {questions.length - answeredCount} unanswered
              question(s). Please answer all questions before submitting.
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
}

// Quiz Results Component
interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  percentage: number;
  questions: QuizQuestion[];
  selectedAnswers: number[];
}

function QuizResults({
  score,
  totalQuestions,
  percentage,
  questions,
  selectedAnswers,
}: QuizResultsProps) {
  const [showExplanations, setShowExplanations] = useState(true);

  const getGrade = () => {
    if (percentage >= 90)
      return { grade: "A", color: "text-green-600", emoji: "🎉" };
    if (percentage >= 80)
      return { grade: "B", color: "text-blue-600", emoji: "👏" };
    if (percentage >= 70)
      return { grade: "C", color: "text-yellow-600", emoji: "👍" };
    if (percentage >= 60)
      return { grade: "D", color: "text-orange-600", emoji: "📚" };
    return { grade: "F", color: "text-red-600", emoji: "💪" };
  };

  const { grade, color, emoji } = getGrade();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Score Card */}
      <Card className="text-center">
        <CardContent className="pt-8 pb-8">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-4xl font-bold mb-2">
            {score} / {totalQuestions}
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            {percentage}% - Grade:{" "}
            <span className={cn("font-bold", color)}>{grade}</span>
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>{score} correct</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span>{totalQuestions - score} incorrect</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toggle Explanations */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Review Answers</h3>
        <Button
          variant="outline"
          onClick={() => setShowExplanations(!showExplanations)}
        >
          {showExplanations ? "Hide" : "Show"} Explanations
        </Button>
      </div>

      {/* Question Review */}
      <div className="space-y-4">
        {questions.map((question, qIndex) => {
          const isCorrect = selectedAnswers[qIndex] === question.correctAnswer;
          const userAnswer = selectedAnswers[qIndex];

          return (
            <Card
              key={qIndex}
              className={cn(isCorrect ? "border-green-500" : "border-red-500")}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-base">
                    {qIndex + 1}. {question.question}
                  </CardTitle>
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Options */}
                {question.options.map((option, oIndex) => (
                  <div
                    key={oIndex}
                    className={cn(
                      "p-3 rounded-lg border",
                      oIndex === question.correctAnswer &&
                        "bg-green-50 border-green-500",
                      oIndex === userAnswer &&
                        oIndex !== question.correctAnswer &&
                        "bg-red-50 border-red-500",
                      oIndex !== question.correctAnswer &&
                        oIndex !== userAnswer &&
                        "bg-muted",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {String.fromCharCode(65 + oIndex)}.
                      </span>
                      <span>{option}</span>
                      {oIndex === question.correctAnswer && (
                        <Badge
                          variant="outline"
                          className="ml-auto bg-green-50 text-green-700 border-green-500"
                        >
                          Correct Answer
                        </Badge>
                      )}
                      {oIndex === userAnswer &&
                        oIndex !== question.correctAnswer && (
                          <Badge
                            variant="outline"
                            className="ml-auto bg-red-50 text-red-700 border-red-500"
                          >
                            Your Answer
                          </Badge>
                        )}
                    </div>
                  </div>
                ))}

                {/* Explanation */}
                {showExplanations && question.explanation && (
                  <Alert>
                    <AlertDescription className="text-sm">
                      <strong>Explanation:</strong> {question.explanation}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
