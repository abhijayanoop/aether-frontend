import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Content } from "@/types";

export interface ContentResponse {
  contents: Content[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export function useContent() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["content"],
    queryFn: async () => {
      const response = await api.get<{ data: ContentResponse }>("/content");
      return response.data.data.contents;
    },
  });

  const deleteContent = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success("Content deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Delete failed");
    },
  });

  return {
    content: data || [],
    isLoading,
    error,
    deleteContent,
  };
}
