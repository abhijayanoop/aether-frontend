import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  FileText,
  Link,
  Youtube,
  MoreVertical,
  Trash2,
  Eye,
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
import { DeleteDialog } from "./DeleteDialog";
import type { Content } from "@/types";

interface ContentCardProps {
  content: Content;
  onDelete: (id: string) => void;
}

export function ContentCard({ content, onDelete }: ContentCardProps) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getIcon = () => {
    switch (content.type) {
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "url":
        return <Link className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
    }
  };

  const getStatusBadge = () => {
    const variants = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      failed: "destructive",
    } as const;

    return (
      <Badge variant={variants[content.status] || "secondary"}>
        {content.status}
      </Badge>
    );
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent rounded-md">{getIcon()}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{content.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {content.type.toUpperCase()} •{" "}
                  {formatDistanceToNow(new Date(content.createdAt), {
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
                  onClick={() => navigate(`/content/${content._id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Metadata */}
          {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {content.metadata.fileSize && (
              <span>{(content.metadata.fileSize / 1024).toFixed(2)} KB</span>
            )}
            {getStatusBadge()}
          </div> */}
        </CardContent>

        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/content/${content._id}`)}
            disabled={content.status !== "completed"}
          >
            Generate Study Materials
          </Button>
        </CardFooter>
      </Card>

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => onDelete(content._id)}
        title={content.title}
      />
    </>
  );
}
