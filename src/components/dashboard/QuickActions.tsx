import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, BookOpen, Brain } from "lucide-react";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Upload Content",
      description: "Add new study material",
      icon: Upload,
      onClick: () => navigate("/upload"),
      variant: "default" as const,
    },
    {
      title: "Browse Content",
      description: "View your content",
      icon: FileText,
      onClick: () => navigate("/content"),
      variant: "outline" as const,
    },
    {
      title: "Study Materials",
      description: "Review flashcards",
      icon: BookOpen,
      onClick: () => navigate("/materials"),
      variant: "outline" as const,
    },
    {
      title: "Take Quiz",
      description: "Test your knowledge",
      icon: Brain,
      onClick: () => navigate("/materials?type=quiz"),
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="h-auto flex-col items-start gap-2 p-4"
            onClick={action.onClick}
          >
            <div className="flex items-center gap-2 w-full">
              <action.icon className="h-5 w-5" />
              <span className="font-semibold">{action.title}</span>
            </div>
            <p className="text-xs text-muted-foreground text-left">
              {action.description}
            </p>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
