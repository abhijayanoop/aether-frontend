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
  processingStatus: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
}

export interface JobStatus {
  _id: string;
  status: "waiting" | "active" | "completed" | "failed";
  progress?: number;
  result?: any;
  error?: string;
}

export interface StudyMaterial {
  _id: string;
  userId: string;
  contentId: string;
  type: "flashcard" | "quiz" | "summary";
  title: string;
  data: {
    flashcards?: Flashcard[];
    questions?: QuizQuestion[];
    summary?: string;
  };
  tags: string[];
  folder?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface GenerateMaterialRequest {
  title: string;
  count?: number;
  tags?: string[];
  folder?: string;
}
