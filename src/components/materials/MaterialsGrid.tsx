import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Trash2,
  Edit,
  FolderInput,
  CheckSquare,
  Square,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { StudyMaterial } from "@/types";

interface MaterialsGridProps {
  materials: StudyMaterial[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onDelete: (id: string) => void;
  selectionMode: boolean;
}

export function MaterialsGrid({
  materials,
  selectedIds,
  onSelect,
  onSelectAll,
  onDelete,
  selectionMode,
}: MaterialsGridProps) {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case "flashcard":
        return "📇";
      case "quiz":
        return "📝";
      case "summary":
        return "📄";
      default:
        return "📚";
    }
  };

  const getRoute = (material: StudyMaterial) => {
    switch (material.type) {
      case "flashcard":
        return `/study/flashcards/${material._id}`;
      case "quiz":
        return `/study/quiz/${material._id}`;
      case "summary":
        return `/study/summary/${material._id}`;
      default:
        return `/study/${material._id}`;
    }
  };

  const getCount = (material: StudyMaterial) => {
    if (!material.data) return null;

    if (material.type === "flashcard" && material.data.flashcards) {
      return `${material.data.flashcards.length} cards`;
    }
    if (material.type === "quiz" && material.data.questions) {
      return `${material.data.questions.length} questions`;
    }
    return null;
  };

  if (materials.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No materials found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or create new study materials
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {materials.map((material) => {
        const isSelected = selectedIds.includes(material._id);
        const count = getCount(material);

        return (
          <Card
            key={material._id}
            className={cn(
              "hover:shadow-lg transition-all relative",
              isSelected && "ring-2 ring-primary",
            )}
          >
            {selectionMode && (
              <div className="absolute top-4 left-4 z-10">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onSelect(material._id)}
                />
              </div>
            )}

            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div
                  className={cn(
                    "flex items-center gap-2",
                    selectionMode && "ml-8",
                  )}
                >
                  <span className="text-2xl">{getIcon(material.type)}</span>
                  <div>
                    <h3 className="font-semibold line-clamp-1">
                      {material.title}
                    </h3>
                    {count && (
                      <p className="text-sm text-muted-foreground">{count}</p>
                    )}
                  </div>
                </div>

                {!selectionMode && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(getRoute(material))}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(material._id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {/* Tags */}
              {material.tags && material.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
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
                <p className="text-xs text-muted-foreground">
                  📁 {material.folder}
                </p>
              )}

              {/* Content Info */}
              {material.contentId && typeof material.contentId === "object" && (
                <p className="text-xs text-muted-foreground mt-2 truncate">
                  From: {material.contentId.title}
                </p>
              )}
            </CardContent>

            <CardFooter>
              <Button
                variant="default"
                className="w-full"
                onClick={() => navigate(getRoute(material))}
              >
                {material.type === "summary" ? "Read" : "Start"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
}
