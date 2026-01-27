import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FlashcardViewer } from "@/components/study/FlashcardViewer";
import { useStudyMaterial } from "@/hooks/useStudyMaterial";

export default function FlashcardsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { material, isLoading } = useStudyMaterial(undefined, id);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!material || !material.data?.flashcards) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Flashcards not found</p>
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
          {material.tags.length > 0 && (
            <div className="flex gap-2 mt-2">
              {material.tags.map((tag) => (
                <span key={tag} className="text-sm text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Flashcard Viewer */}
        <FlashcardViewer flashcards={material.data.flashcards} />
      </div>
    </Layout>
  );
}
