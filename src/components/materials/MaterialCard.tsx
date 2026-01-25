import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  BookOpen,
  Brain,
  FileText,
  MoreVertical,
  Play,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
        return <BookOpen className="h-5 w-5 text-blue-600" />;
      case "quiz":
        return <Brain className="h-5 w-5 text-green-600" />;
      case "summary":
        return <FileText className="h-5 w-5 text-purple-600" />;
    }
  };

  const getCount = () => {
    switch (material.type) {
      case "flashcard":
        return `${material.data.flashcards?.length || 0} cards`;
      case "quiz":
        return `${material.data.questions?.length || 0} questions`;
      case "summary":
        return "Summary";
    }
  };

  const getRoute = () => {
    switch (material.type) {
      case "flashcard":
        return `/materials/flashcards/${material._id}`;
      case "quiz":
        return `/materials/quiz/${material._id}`;
      case "summary":
        return `/materials/summary/${material._id}`;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-accent rounded-md">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{material.title}</h3>
              <p className="text-sm text-muted-foreground">
                {getCount()} •{" "}
                {formatDistanceToNow(new Date(material.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onDelete(material._id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tags */}
        {material.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {material.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
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
          <p className="text-xs text-muted-foreground">📁 {material.folder}</p>
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
