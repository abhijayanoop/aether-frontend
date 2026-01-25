import { useNavigate } from "react-router-dom";
import { Upload, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <div className="text-center py-12">
        <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No content found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No content yet</h3>
      <p className="text-muted-foreground mb-6">
        Upload your first document, article, or video to get started
      </p>
      <Button onClick={() => navigate("/upload")}>
        <Upload className="mr-2 h-4 w-4" />
        Upload Content
      </Button>
    </div>
  );
}
