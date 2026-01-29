import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, BookOpen, FolderOpen } from "lucide-react";

interface StatsCardProps {
  stats?: {
    total: number;
    byType: Record<string, number>;
  };
  folders: string[];
  tags: string[];
}

export function StatsCard({ stats, folders, tags }: StatsCardProps) {
  const typeIcons = {
    flashcard: FileText,
    quiz: Brain,
    summary: BookOpen,
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Total Materials */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total || 0}</div>
          <p className="text-xs text-muted-foreground">
            Across {folders.length} folders
          </p>
        </CardContent>
      </Card>

      {/* Flashcards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.byType?.flashcard || 0}
          </div>
          <p className="text-xs text-muted-foreground">Study card sets</p>
        </CardContent>
      </Card>

      {/* Quizzes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.byType?.quiz || 0}</div>
          <p className="text-xs text-muted-foreground">Practice tests</p>
        </CardContent>
      </Card>

      {/* Summaries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Summaries</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.byType?.summary || 0}
          </div>
          <p className="text-xs text-muted-foreground">Content summaries</p>
        </CardContent>
      </Card>
    </div>
  );
}
