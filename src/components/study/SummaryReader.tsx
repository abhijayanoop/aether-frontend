import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface SummaryReaderProps {
  summary: string;
  keyConcepts?: Array<{ term: string; definition: string }>;
}

export function SummaryReader({ summary, keyConcepts }: SummaryReaderProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {summary.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      {keyConcepts && keyConcepts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Concepts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {keyConcepts.map((concept, index) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-1">{concept.term}</h4>
                <p className="text-sm text-muted-foreground">
                  {concept.definition}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
