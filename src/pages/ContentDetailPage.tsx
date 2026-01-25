import { useState } from "react";
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
import { GeneratePreviewDialog } from "@/components/materials/GeneratePreviewDialog";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { useMaterials } from "@/hooks/useMaterials";
import { api } from "@/lib/api";
import type { Content } from "@/types";

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Track generated data for preview
  const [flashcardsPreview, setFlashcardsPreview] = useState<any>(null);
  const [quizPreview, setQuizPreview] = useState<any>(null);
  const [summaryPreview, setSummaryPreview] = useState<any>(null);

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
    saveFlashcards,
    saveQuiz,
    saveSummary,
    materials,
    isLoading: materialsLoading,
    isGenerating,
    isSaving,
    deleteMaterial,
  } = useMaterials(id);

  // Handle generation (step 1)
  const handleGenerateFlashcards = async (options: any) => {
    const result = await generateFlashcards.mutateAsync(options);
    setFlashcardsPreview(result);
  };

  const handleGenerateQuiz = async (options: any) => {
    const result = await generateQuiz.mutateAsync(options);
    setQuizPreview(result);
  };

  const handleGenerateSummary = async (options: any) => {
    const result = await generateSummary.mutateAsync(options);
    setSummaryPreview(result);
  };

  // Handle saving (step 2)
  const handleSaveFlashcards = (data: any) => {
    saveFlashcards.mutate(data);
    setFlashcardsPreview(null);
  };

  const handleSaveQuiz = (data: any) => {
    saveQuiz.mutate(data);
    setQuizPreview(null);
  };

  const handleSaveSummary = (data: any) => {
    saveSummary.mutate(data);
    setSummaryPreview(null);
  };

  const handleDeleteMaterial = (materialId: string) => {
    if (confirm("Are you sure you want to delete this material?")) {
      deleteMaterial.mutate(materialId);
    }
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
            <div className="grid gap-4 md:grid-cols-3">
              <GeneratePreviewDialog
                type="flashcard"
                onGenerate={handleGenerateFlashcards}
                onSave={handleSaveFlashcards}
                isGenerating={generateFlashcards.isPending}
                isSaving={saveFlashcards.isPending}
                generatedData={flashcardsPreview}
              />
              <GeneratePreviewDialog
                type="quiz"
                onGenerate={handleGenerateQuiz}
                onSave={handleSaveQuiz}
                isGenerating={generateQuiz.isPending}
                isSaving={saveQuiz.isPending}
                generatedData={quizPreview}
              />
              <GeneratePreviewDialog
                type="summary"
                onGenerate={handleGenerateSummary}
                onSave={handleSaveSummary}
                isGenerating={generateSummary.isPending}
                isSaving={saveSummary.isPending}
                generatedData={summaryPreview}
              />
            </div>
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
