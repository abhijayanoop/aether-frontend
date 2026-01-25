import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { StudyMaterial, GenerateMaterialRequest } from "@/types";

export function useMaterials(contentId?: string) {
  const queryClient = useQueryClient();

  // Generate flashcards
  const generateFlashcards = useMutation({
    mutationFn: async (data: GenerateMaterialRequest) => {
      const response = await api.post(
        `/study-materials/${contentId}/flashcards/generate-save`,
        data,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Flashcards generated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Generation failed");
    },
  });

  // Generate quiz
  const generateQuiz = useMutation({
    mutationFn: async (data: GenerateMaterialRequest) => {
      const response = await api.post(
        `/study-materials/${contentId}/quiz/generate-save`,
        data,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Quiz generated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Generation failed");
    },
  });

  // Generate summary
  const generateSummary = useMutation({
    mutationFn: async (data: GenerateMaterialRequest) => {
      const response = await api.post(
        `/study-materials/${contentId}/summary/generate-save`,
        data,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Summary generated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Generation failed");
    },
  });

  // Fetch materials for content
  const { data: materials, isLoading } = useQuery({
    queryKey: ["materials", contentId],
    queryFn: async () => {
      const response = await api.get<{ data: StudyMaterial[] }>(
        `/study-materials?contentId=${contentId}`,
      );
      return response.data.data;
    },
    enabled: !!contentId,
  });

  return {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    materials: materials || [],
    isLoading,
    isGenerating:
      generateFlashcards.isPending ||
      generateQuiz.isPending ||
      generateSummary.isPending,
  };
}
