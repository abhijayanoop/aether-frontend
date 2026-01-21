import { useState } from "react";
import { Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface URLUploadProps {
  onUpload: (url: string, title: string) => void;
  isUploading: boolean;
}

export function URLUpload({ onUpload, isUploading }: URLUploadProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && title) {
      onUpload(url, title);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info Card */}
      <div className="p-4 bg-accent rounded-lg border">
        <div className="flex items-start gap-3">
          <LinkIcon className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium mb-1">Enter Article or Webpage URL</p>
            <p className="text-sm text-muted-foreground">
              We'll extract the content and make it available for study material
              generation.
            </p>
          </div>
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          disabled={isUploading}
          required
        />
        <p className="text-xs text-muted-foreground">
          Enter the full URL including https://
        </p>
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for this content"
          disabled={isUploading}
          required
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={!url || !title || isUploading}
      >
        {isUploading ? "Processing..." : "Add URL Content"}
      </Button>
    </form>
  );
}
