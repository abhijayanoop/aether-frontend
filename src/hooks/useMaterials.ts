import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type {
  StudyMaterial,
  GenerateFlashcardsRequest,
  GenerateQuizRequest,
  GenerateSummaryRequest,
  SaveMaterialRequest,
} from "@/types";

export function useMaterials(contentId?: string) {
  const queryClient = useQueryClient();

  // STEP 1: Generate (returns preview data)
  const generateFlashcards = useMutation({
    mutationFn: async (data: GenerateFlashcardsRequest) => {
      const response = await api.post(
        `/study-materials/${contentId}/flashcards`,
        data,
      );
      return response.data.data; // Returns { flashcards: [...] }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Generation failed");
    },
  });

  const generateQuiz = useMutation({
    mutationFn: async (data: GenerateQuizRequest) => {
      const response = await api.post(
        `/study-materials/${contentId}/quiz`,
        data,
      );
      return response.data.data; // Returns { quiz: [...] }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Generation failed");
    },
  });

  const generateSummary = useMutation({
    mutationFn: async (data: GenerateSummaryRequest) => {
      const response = await api.post(
        `/study-materials/${contentId}/summary`,
        data,
      );
      return response.data.data; // Returns { summary: "..." }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Generation failed");
    },
  });

  const generateConcepts = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/study-materials/${contentId}/concepts`);
      return response.data.data; // Returns { concepts: [...] }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Extraction failed");
    },
  });

  // STEP 2: Save (saves to database)
  const saveFlashcards = useMutation({
    mutationFn: async (data: SaveMaterialRequest) => {
      const response = await api.post(
        `/study-materials/${contentId}/flashcards/save`,
        data,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Flashcards saved successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Save failed");
    },
  });

  const saveQuiz = useMutation({
    mutationFn: async (data: SaveMaterialRequest) => {
      const response = await api.post(
        `/study-materials/${contentId}/quiz/save`,
        data,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Quiz saved successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Save failed");
    },
  });

  const saveSummary = useMutation({
    mutationFn: async (data: SaveMaterialRequest) => {
      const response = await api.post(
        `/study-materials/${contentId}/summary/save`,
        data,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Summary saved successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Save failed");
    },
  });

  // Fetch all materials for a content item
  const { data: materials, isLoading } = useQuery({
    queryKey: ["materials", contentId],
    queryFn: async () => {
      const response = await api.get<{ data: { materials: StudyMaterial[] } }>(
        `/study-materials`,
      );

      // Filter by contentId on frontend
      const allMaterials = response.data.data.materials || [];

      // If contentId is provided, filter by it
      if (contentId) {
        return allMaterials.filter((m) => {
          // Handle both string and object contentId
          const materialContentId =
            typeof m.contentId === "string" ? m.contentId : m.contentId._id;
          return materialContentId === contentId;
        });
      }

      return allMaterials;
    },
    enabled: !!contentId,
  });

  // Delete material
  const deleteMaterial = useMutation({
    mutationFn: async (materialId: string) => {
      await api.delete(`/study-materials/${materialId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Delete failed");
    },
  });

  return {
    // Generation (step 1)
    generateFlashcards,
    generateQuiz,
    generateSummary,
    generateConcepts,

    // Saving (step 2)
    saveFlashcards,
    saveQuiz,
    saveSummary,

    // Data & state
    materials: materials || [],
    isLoading,
    isGenerating:
      generateFlashcards.isPending ||
      generateQuiz.isPending ||
      generateSummary.isPending ||
      generateConcepts.isPending,
    isSaving:
      saveFlashcards.isPending || saveQuiz.isPending || saveSummary.isPending,

    // Management
    deleteMaterial,
  };
}
