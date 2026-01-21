import { useEffect } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { JobStatus } from "@/types";

interface UploadProgressProps {
  jobStatus: JobStatus | null;
  onComplete?: () => void;
}

export function UploadProgress({ jobStatus, onComplete }: UploadProgressProps) {
  useEffect(() => {
    if (jobStatus?.status === "completed" && onComplete) {
      onComplete();
    }
  }, [jobStatus?.status, onComplete]);

  if (!jobStatus) return null;

  const getStatusIcon = () => {
    switch (jobStatus.status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
    }
  };

  const getStatusMessage = () => {
    switch (jobStatus.status) {
      case "waiting":
        return "Waiting in queue...";
      case "active":
        return "Processing content...";
      case "completed":
        return "Content processed successfully!";
      case "failed":
        return jobStatus.error || "Processing failed";
      default:
        return "Processing...";
    }
  };

  const getVariant = () => {
    if (jobStatus.status === "completed") return "default";
    if (jobStatus.status === "failed") return "destructive";
    return "default";
  };

  return (
    <Alert variant={getVariant()}>
      <div className="flex items-start gap-3">
        {getStatusIcon()}
        <div className="flex-1 space-y-2">
          <AlertTitle>
            {jobStatus.status === "completed"
              ? "Success"
              : jobStatus.status === "failed"
                ? "Error"
                : "Processing"}
          </AlertTitle>
          <AlertDescription>{getStatusMessage()}</AlertDescription>

          {/* Progress Bar */}
          {jobStatus.status === "active" && (
            <Progress value={jobStatus.progress || 0} className="w-full" />
          )}
        </div>
      </div>
    </Alert>
  );
}
