import { useState, useEffect } from "react";
import { Brain, Loader2, Save, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Flashcard, QuizQuestion } from "@/types";

interface GeneratePreviewDialogProps {
  type: "flashcard" | "quiz" | "summary";
  onGenerate: (options: any) => Promise<void>;
  onSave: (data: {
    title: string;
    data: any;
    tags?: string[];
    folder?: string;
  }) => void;
  isGenerating: boolean;
  isSaving: boolean;
  generatedData?: any;
}

export function GeneratePreviewDialog({
  type,
  onGenerate,
  onSave,
  isGenerating,
  isSaving,
  generatedData,
}: GeneratePreviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"configure" | "preview">("configure");

  // Configuration state
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );

  // Save state
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [folder, setFolder] = useState("");

  // Editable data
  const [editedData, setEditedData] = useState<any>(null);

  // When data is generated, extract the actual content and move to preview
  useEffect(() => {
    if (generatedData && step === "configure") {
      // Extract the actual data based on type
      let actualData;

      if (type === "flashcard" && generatedData.flashcards) {
        actualData = generatedData.flashcards;
      } else if (type === "quiz" && generatedData.quiz) {
        actualData = generatedData.quiz;
      } else if (type === "summary" && generatedData.summary) {
        actualData = generatedData.summary;
      } else {
        // Fallback: assume the data is already in the right format
        actualData = generatedData;
      }

      setEditedData(actualData);
      setStep("preview");
    }
  }, [generatedData, step, type]);

  const getConfig = () => {
    switch (type) {
      case "flashcard":
        return {
          title: "Generate Flashcards",
          description: "Create AI-powered flashcards from your content",
          buttonText: "Generate Flashcards",
          icon: "📇",
          countLabel: "Number of flashcards",
          min: 5,
          max: 50,
          showDifficulty: true,
        };
      case "quiz":
        return {
          title: "Generate Quiz",
          description: "Create a multiple-choice quiz from your content",
          buttonText: "Generate Quiz",
          icon: "📝",
          countLabel: "Number of questions",
          min: 5,
          max: 20,
          showDifficulty: true,
        };
      case "summary":
        return {
          title: "Generate Summary",
          description: "Create a concise summary of your content",
          buttonText: "Generate Summary",
          icon: "📄",
          countLabel: null,
          min: 0,
          max: 0,
          showDifficulty: false,
        };
    }
  };

  const config = getConfig();

  const handleGenerate = async () => {
    const options: any = {};

    if (type === "flashcard") {
      options.count = count;
      options.difficulty = difficulty;
    } else if (type === "quiz") {
      options.questionCount = count;
      options.difficulty = difficulty;
      options.questionType = "multiple-choice";
    } else if (type === "summary") {
      options.length = "medium";
      options.format = "paragraph";
    }

    await onGenerate(options);
  };

  const handleSave = () => {
    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      title,
      data:
        type === "flashcard"
          ? { flashcards: editedData }
          : type === "quiz"
            ? { questions: editedData }
            : { summary: editedData },
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      folder: folder || undefined,
    });

    // Reset and close
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep("configure");
      setTitle("");
      setTags("");
      setFolder("");
      setEditedData(null);
      setCount(10);
      setDifficulty("medium");
    }, 200);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Brain className="mr-2 h-4 w-4" />
          {config.buttonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{config.icon}</span>
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {step === "configure" && (
            <div className="space-y-4">
              {/* Count Slider */}
              {config.countLabel && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{config.countLabel}</Label>
                    <span className="text-sm text-muted-foreground">
                      {count}
                    </span>
                  </div>
                  <Slider
                    value={[count]}
                    onValueChange={(value) => setCount(value[0])}
                    min={config.min}
                    max={config.max}
                    step={5}
                    disabled={isGenerating}
                  />
                </div>
              )}

              {/* Difficulty */}
              {config.showDifficulty && (
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Tabs
                    value={difficulty}
                    onValueChange={(v: any) => setDifficulty(v)}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="easy">Easy</TabsTrigger>
                      <TabsTrigger value="medium">Medium</TabsTrigger>
                      <TabsTrigger value="hard">Hard</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}
            </div>
          )}

          {step === "preview" && editedData && (
            <div className="space-y-4">
              {/* Save Configuration */}
              <div className="space-y-4 border-b pb-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder={`My ${type} collection`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="math, physics, exam"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="folder">Folder</Label>
                    <Input
                      id="folder"
                      placeholder="Midterm Prep"
                      value={folder}
                      onChange={(e) => setFolder(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>

              {/* Preview Generated Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Preview & Edit</Label>
                  <p className="text-sm text-muted-foreground">
                    {type === "flashcard" &&
                      Array.isArray(editedData) &&
                      `${editedData.length} flashcards`}
                    {type === "quiz" &&
                      Array.isArray(editedData) &&
                      `${editedData.length} questions`}
                  </p>
                </div>

                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                  {type === "flashcard" && Array.isArray(editedData) && (
                    <FlashcardPreview
                      flashcards={editedData}
                      onChange={setEditedData}
                    />
                  )}
                  {type === "quiz" && Array.isArray(editedData) && (
                    <QuizPreview
                      questions={editedData}
                      onChange={setEditedData}
                    />
                  )}
                  {type === "summary" && typeof editedData === "string" && (
                    <Textarea
                      value={editedData}
                      onChange={(e) => setEditedData(e.target.value)}
                      rows={15}
                      className="resize-none"
                      placeholder="Summary will appear here..."
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === "configure" ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setStep("configure");
                  setEditedData(null);
                }}
              >
                Regenerate
              </Button>
              <Button onClick={handleSave} disabled={!title || isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Material
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Preview Components
function FlashcardPreview({
  flashcards,
  onChange,
}: {
  flashcards: Flashcard[];
  onChange: (data: Flashcard[]) => void;
}) {
  const updateFlashcard = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    const updated = [...flashcards];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {flashcards.map((card, index) => (
        <div key={index} className="border rounded-lg p-3 space-y-2 bg-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Card {index + 1}
            </span>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Question</Label>
            <Input
              value={card.question}
              onChange={(e) =>
                updateFlashcard(index, "question", e.target.value)
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Answer</Label>
            <Textarea
              value={card.answer}
              onChange={(e) => updateFlashcard(index, "answer", e.target.value)}
              rows={3}
              className="mt-1 resize-none"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function QuizPreview({
  questions,
  onChange,
}: {
  questions: QuizQuestion[];
  onChange: (data: QuizQuestion[]) => void;
}) {
  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    const newOptions = [...updated[qIndex].options];
    newOptions[optIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options: newOptions };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="border rounded-lg p-4 space-y-3 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Question {qIndex + 1}
            </span>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Question</Label>
            <Textarea
              value={q.question}
              onChange={(e) =>
                updateQuestion(qIndex, "question", e.target.value)
              }
              rows={2}
              className="mt-1 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Options</Label>
            {q.options.map((opt, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <span className="text-xs w-6 text-muted-foreground">
                  {String.fromCharCode(65 + optIndex)}.
                </span>
                <Input
                  value={opt}
                  onChange={(e) =>
                    updateOption(qIndex, optIndex, e.target.value)
                  }
                  className={
                    q.correctAnswer === optIndex
                      ? "border-green-500 bg-green-50"
                      : ""
                  }
                />
                {q.correctAnswer === optIndex && (
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Correct
                  </span>
                )}
              </div>
            ))}
          </div>

          {q.explanation && (
            <div>
              <Label className="text-xs text-muted-foreground">
                Explanation
              </Label>
              <Textarea
                value={q.explanation}
                onChange={(e) =>
                  updateQuestion(qIndex, "explanation", e.target.value)
                }
                rows={2}
                className="mt-1 resize-none text-sm"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
