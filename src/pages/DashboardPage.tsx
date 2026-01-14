import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
        <p>Welcome, {user?.name}!</p>
      </div>
    </div>
  );
}
