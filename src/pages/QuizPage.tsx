import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { QuizInterface } from "@/components/study/QuizInterface";
import { useStudyMaterial } from "@/hooks/useStudyMaterial";

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { material, isLoading } = useStudyMaterial(undefined, id);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleComplete = async (
    _score: number,
    _totalQuestions: number,
    _answers: number[],
  ) => {
    // TODO: Add recordAttempt mutation to useStudyMaterial hook
    setQuizCompleted(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!material || !material.data?.questions) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Quiz not found</p>
          <Button onClick={() => navigate("/materials")}>
            Back to Materials
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        {!quizCompleted && (
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/materials")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Materials
            </Button>
            <h1 className="text-3xl font-bold">{material.title}</h1>
            <p className="text-muted-foreground">
              {material.data.questions.length} questions
            </p>
          </div>
        )}

        {/* Quiz Interface */}
        <QuizInterface
          questions={material.data.questions}
          onComplete={handleComplete}
          timeLimit={30} // 30 minutes
        />

        {/* Navigation after completion */}
        {quizCompleted && (
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retake Quiz
            </Button>
            <Button onClick={() => navigate("/materials")}>
              Back to Materials
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
