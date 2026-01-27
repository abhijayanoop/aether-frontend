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

export interface ContentReference {
  _id: string;
  type: "pdf" | "url" | "youtube";
  title: string;
  sourceUrl?: string;
}

export interface StudyMaterial {
  _id: string;
  userId: string;
  contentId: string | ContentReference;
  type: "flashcard" | "quiz" | "summary" | "concepts";
  title: string;
  data: {
    flashcards?: Flashcard[];
    questions?: QuizQuestion[];
    summary?: string;
    concepts?: KeyConcept[];
  };
  tags: string[];
  folder?: string;
  isPublic?: boolean;
  difficulty?: "easy" | "medium" | "hard";
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

export interface KeyConcept {
  term: string;
  definition: string;
  category?: string;
}

// Generation request types
export interface GenerateFlashcardsRequest {
  count?: number; // 5-50, default: 10
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
}

export interface GenerateQuizRequest {
  questionCount?: number; // 5-50, default: 10
  difficulty?: "easy" | "medium" | "hard";
  questionType?: "multiple-choice" | "true-false" | "mixed";
  tags?: string[];
}

export interface GenerateSummaryRequest {
  length?: "short" | "medium" | "long";
  format?: "paragraph" | "bullet-points" | "detailed";
  tags?: string[];
}

// Save request types (after generation)
export interface SaveMaterialRequest {
  title: string;
  data: {
    flashcards?: Flashcard[];
    questions?: QuizQuestion[];
    summary?: string;
    concepts?: KeyConcept[];
  };
  tags?: string[];
  folder?: string;
}
