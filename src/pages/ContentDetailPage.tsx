import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GenerateDialog } from "@/components/materials/GenerateDialog";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { useMaterials } from "@/hooks/useMaterials";
import { api } from "@/lib/api";
import type { Content } from "@/types";

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch content details
  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ["content", id],
    queryFn: async () => {
      const response = await api.get<{ data: Content }>(`/content/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  // Materials hook
  const {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    materials,
    isLoading: materialsLoading,
    isGenerating,
  } = useMaterials(id);

  const handleGenerateFlashcards = (title: string, count?: number) => {
    generateFlashcards.mutate({ title, count });
  };

  const handleGenerateQuiz = (title: string, count?: number) => {
    generateQuiz.mutate({ title, count });
  };

  const handleGenerateSummary = (title: string) => {
    generateSummary.mutate({ title });
  };

  const handleDeleteMaterial = async (materialId: string) => {
    // TODO: Implement delete
  };

  if (contentLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64" />
        </div>
      </Layout>
    );
  }

  if (!content) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Content not found</p>
          <Button onClick={() => navigate("/content")} className="mt-4">
            Back to Content
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
            onClick={() => navigate("/content")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Content
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
          <p className="text-muted-foreground">
            Generate AI-powered study materials from this content
          </p>
        </div>

        {/* Generation Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Study Materials</CardTitle>
            <CardDescription>
              Use AI to create flashcards, quizzes, or summaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-3 text-muted-foreground">
                  Generating materials with AI...
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <GenerateDialog
                  type="flashcard"
                  onGenerate={handleGenerateFlashcards}
                  isGenerating={isGenerating}
                />
                <GenerateDialog
                  type="quiz"
                  onGenerate={handleGenerateQuiz}
                  isGenerating={isGenerating}
                />
                <GenerateDialog
                  type="summary"
                  onGenerate={handleGenerateSummary}
                  isGenerating={isGenerating}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing Materials */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Study Materials</h2>
          {materialsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : materials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <MaterialCard
                  key={material._id}
                  material={material}
                  onDelete={handleDeleteMaterial}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No study materials yet. Generate some using the buttons above!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
