import { useState } from "react";
import { Brain, Loader2 } from "lucide-react";
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

interface GenerateDialogProps {
  type: "flashcard" | "quiz" | "summary";
  onGenerate: (title: string, count?: number) => void;
  isGenerating: boolean;
}

export function GenerateDialog({
  type,
  onGenerate,
  isGenerating,
}: GenerateDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [count, setCount] = useState(10);

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
          default: 10,
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
          default: 10,
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
          default: 0,
        };
    }
  };

  const config = getConfig();

  const handleGenerate = () => {
    if (title) {
      onGenerate(title, type === "summary" ? undefined : count);
      setOpen(false);
      setTitle("");
      setCount(config.default);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Brain className="mr-2 h-4 w-4" />
          {config.buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{config.icon}</span>
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder={`My ${type} collection`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Count Slider (not for summary) */}
          {config.countLabel && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{config.countLabel}</Label>
                <span className="text-sm text-muted-foreground">{count}</span>
              </div>
              <Slider
                value={[count]}
                onValueChange={(value) => setCount(value[0])}
                min={config.min}
                max={config.max}
                step={5}
                disabled={isGenerating}
              />
              <p className="text-xs text-muted-foreground">
                Range: {config.min}-{config.max} items
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleGenerate}
            disabled={!title || isGenerating}
            className="w-full"
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? "Generating..." : config.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
