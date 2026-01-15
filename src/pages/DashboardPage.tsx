import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { FileText, BookOpen, Brain, Folder } from "lucide-react";

export default function DashboardPage() {
  // Mock data - will be replaced with real API data later
  const stats = [
    {
      title: "Total Content",
      value: 45,
      description: "Uploaded documents",
      icon: FileText,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Flashcards",
      value: 123,
      description: "Study cards created",
      icon: BookOpen,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Quizzes",
      value: 67,
      description: "Quizzes generated",
      icon: Brain,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Folders",
      value: 8,
      description: "Organized collections",
      icon: Folder,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your learning overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </Layout>
  );
}
