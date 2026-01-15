import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, BookOpen, Brain } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: "content" | "flashcard" | "quiz";
  title: string;
  timestamp: Date;
}

const iconMap = {
  content: FileText,
  flashcard: BookOpen,
  quiz: Brain,
};

const typeColors = {
  content: "default",
  flashcard: "secondary",
  quiz: "outline",
} as const;

export function RecentActivity() {
  // Mock data - will be replaced with real data later
  const activities: Activity[] = [
    {
      id: "1",
      type: "content",
      title: "Biology Chapter 1.pdf",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      type: "flashcard",
      title: "Math Flashcards",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: "3",
      type: "quiz",
      title: "History Quiz",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = iconMap[activity.type];
            return (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent rounded-md">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <Badge variant={typeColors[activity.type]}>
                  {activity.type}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
