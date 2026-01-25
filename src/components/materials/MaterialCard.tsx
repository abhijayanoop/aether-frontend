import { useNavigate } from "react-router-dom";
import { Play, MoreVertical, Trash2, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StudyMaterial } from "@/types";

interface MaterialCardProps {
  material: StudyMaterial;
  onDelete: (id: string) => void;
}

export function MaterialCard({ material, onDelete }: MaterialCardProps) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (material.type) {
      case "flashcard":
        return "📇";
      case "quiz":
        return "📝";
      case "summary":
        return "📄";
      case "concepts":
        return "💡";
      default:
        return "📚";
    }
  };

  const getCount = () => {
    // Check if data exists first
    if (!material.data) {
      return null;
    }

    // Check each type with proper null guards
    if (material.type === "flashcard") {
      if (material.data.flashcards && Array.isArray(material.data.flashcards)) {
        return `${material.data.flashcards.length} cards`;
      }
      return null;
    }

    if (material.type === "quiz") {
      if (material.data.questions && Array.isArray(material.data.questions)) {
        return `${material.data.questions.length} questions`;
      }
      // Also check for attempts (some quiz data only has attempts)
      if (material.data.attempts && Array.isArray(material.data.attempts)) {
        return `${material.data.attempts.length} attempts`;
      }
      return null;
    }

    if (material.type === "concepts") {
      if (material.data.concepts && Array.isArray(material.data.concepts)) {
        return `${material.data.concepts.length} concepts`;
      }
      // Also check for keyConcepts
      if (
        material.data.keyConcepts &&
        Array.isArray(material.data.keyConcepts)
      ) {
        return `${material.data.keyConcepts.length} concepts`;
      }
      return null;
    }

    if (material.type === "summary") {
      if (material.data.summary) {
        return "Summary";
      }
      return null;
    }

    return null;
  };

  const getRoute = () => {
    switch (material.type) {
      case "flashcard":
        return `/study/flashcards/${material._id}`;
      case "quiz":
        return `/study/quiz/${material._id}`;
      case "summary":
        return `/study/summary/${material._id}`;
      case "concepts":
        return `/study/concepts/${material._id}`;
      default:
        return `/study/${material._id}`;
    }
  };

  const count = getCount();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getIcon()}</span>
            <div>
              <CardTitle className="text-lg">{material.title}</CardTitle>
              {count && (
                <p className="text-sm text-muted-foreground mt-1">{count}</p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(getRoute())}>
                <Edit className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this material?")
                  ) {
                    onDelete(material._id);
                  }
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {/* Tags */}
        {material.tags && material.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {material.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="secondary"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
            {material.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{material.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Folder */}
        {material.folder && (
          <p className="text-xs text-muted-foreground mb-2">
            📁 {material.folder}
          </p>
        )}

        {/* Difficulty */}
        {material.difficulty && (
          <Badge variant="outline" className="text-xs capitalize">
            {material.difficulty}
          </Badge>
        )}

        {/* Show message if data is missing */}
        {!material.data && (
          <p className="text-xs text-muted-foreground italic mt-2">
            Content not available
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button
          variant="default"
          className="w-full"
          onClick={() => navigate(getRoute())}
        >
          <Play className="mr-2 h-4 w-4" />
          {material.type === "summary" ? "Read" : "Start"}
        </Button>
      </CardFooter>
    </Card>
  );
}
