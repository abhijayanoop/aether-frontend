export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface UploadResponse {
  success: boolean;
  data: {
    content: Content;
    jobId?: string;
  };
}

export interface Content {
  _id: string;
  userId: string;
  type: "pdf" | "url" | "youtube";
  title: string;
  sourceUrl?: string;
  filePath?: string;
  metadata: {
    fileSize?: number;
    mimeType?: string;
    duration?: number;
  };
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
}

export interface JobStatus {
  _id: string;
  status: "waiting" | "active" | "completed" | "failed";
  progress?: number;
  result?: any;
  error?: string;
}
