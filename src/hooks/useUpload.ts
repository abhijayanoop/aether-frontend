import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { UploadResponse, Content, JobStatus } from "@/types";

interface PDFUploadData {
  file: File;
  title: string;
}

interface URLUploadData {
  url: string;
  title: string;
}

interface YouTubeUploadData {
  url: string;
  title: string;
}

export function useUpload() {
  const [jobId, setJobId] = useState<string | null>(null);

  // PDF Upload
  const uploadPDF = useMutation({
    mutationFn: async (data: PDFUploadData) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("title", data.title);

      const response = await api.post<UploadResponse>(
        "/content/pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("PDF uploaded successfully!");
      if (data.data.jobId) {
        setJobId(data.data.jobId);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Upload failed");
    },
  });

  // URL Upload
  const uploadURL = useMutation({
    mutationFn: async (data: URLUploadData) => {
      const response = await api.post<UploadResponse>("/content/url", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("URL content uploaded successfully!");
      if (data.data.jobId) {
        setJobId(data.data.jobId);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Upload failed");
    },
  });

  // YouTube Upload
  const uploadYouTube = useMutation({
    mutationFn: async (data: YouTubeUploadData) => {
      const response = await api.post<UploadResponse>("/content/youtube", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("YouTube video uploaded successfully!");
      if (data.data.jobId) {
        setJobId(data.data.jobId);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Upload failed");
    },
  });

  // Poll Job Status
  const { data: jobStatus } = useQuery({
    queryKey: ["job-status", jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const response = await api.get<{ data: JobStatus }>(
        `/content/job/${jobId}`,
      );
      return response.data.data;
    },
    enabled: !!jobId,
    refetchInterval: (data) => {
      // Stop polling when job is completed or failed
      if (!data || data.status === "completed" || data.status === "failed") {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
  });

  return {
    uploadPDF,
    uploadURL,
    uploadYouTube,
    jobStatus,
    isUploading:
      uploadPDF.isPending || uploadURL.isPending || uploadYouTube.isPending,
  };
}
