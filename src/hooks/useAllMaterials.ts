import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { StudyMaterial } from "@/types";

interface MaterialFilters {
  search?: string;
  type?: "flashcard" | "quiz" | "summary";
  folder?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

interface MaterialsResponse {
  materials: StudyMaterial[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function useAllMaterials(filters: MaterialFilters = {}) {
  const queryClient = useQueryClient();

  // Fetch all materials with filters
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-materials", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.type) params.append("type", filters.type);
      if (filters.folder) params.append("folder", filters.folder);
      if (filters.tags && filters.tags.length > 0) {
        params.append("tags", filters.tags.join(","));
      }
      params.append("page", String(filters.page || 1));
      params.append("limit", String(filters.limit || 20));

      const response = await api.get<{ data: MaterialsResponse }>(
        `/study-materials?${params.toString()}`,
      );
      return response.data.data;
    },
  });

  // Get folders
  const { data: foldersData } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const response = await api.get<{ data: { folders: string[] } }>(
        "/study-materials/folders",
      );
      return response.data.data.folders;
    },
  });

  // Get tags
  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await api.get<{ data: { tags: string[] } }>(
        "/study-materials/tags",
      );
      return response.data.data.tags;
    },
  });

  // Get stats
  const { data: statsData } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await api.get<{
        data: {
          total: number;
          byType: Record<string, number>;
        };
      }>("/study-materials/stats");
      return response.data.data;
    },
  });

  // Delete material
  const deleteMaterial = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/study-materials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-materials"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Material deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete");
    },
  });

  // Bulk delete
  const bulkDelete = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => api.delete(`/study-materials/${id}`)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-materials"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Materials deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete materials",
      );
    },
  });

  // Update material (for moving to folder)
  const updateMaterial = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<StudyMaterial>;
    }) => {
      const response = await api.put(`/study-materials/${id}`, updates);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-materials"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Material updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update");
    },
  });

  return {
    materials: data?.materials || [],
    pagination: data?.pagination,
    isLoading,
    error,
    folders: foldersData || [],
    tags: tagsData || [],
    stats: statsData,
    deleteMaterial,
    bulkDelete,
    updateMaterial,
  };
}
