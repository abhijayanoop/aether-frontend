import { useState } from "react";
import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface YouTubeUploadProps {
  onUpload: (url: string, title: string) => void;
  isUploading: boolean;
}

export function YouTubeUpload({ onUpload, isUploading }: YouTubeUploadProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const validateYouTubeUrl = (url: string): boolean => {
    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setError("");

    if (value && !validateYouTubeUrl(value)) {
      setError("Please enter a valid YouTube URL");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    if (url && title) {
      onUpload(url, title);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info Card */}
      <div className="p-4 bg-accent rounded-lg border">
        <div className="flex items-start gap-3">
          <Youtube className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Enter YouTube Video URL</p>
            <p className="text-sm text-muted-foreground">
              We'll extract the transcript and make it available for study
              material generation.
            </p>
          </div>
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="youtube-url">YouTube URL</Label>
        <Input
          id="youtube-url"
          type="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          disabled={isUploading}
          required
        />
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-muted-foreground">
          Supported formats: youtube.com/watch?v=... or youtu.be/...
        </p>
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for this video"
          disabled={isUploading}
          required
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={!url || !title || !!error || isUploading}
      >
        {isUploading ? "Processing..." : "Add YouTube Video"}
      </Button>
    </form>
  );
}
