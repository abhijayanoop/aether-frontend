import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PDFUpload } from "@/components/upload/PDFUpload";
import { URLUpload } from "@/components/upload/URLUpload";
import { YouTubeUpload } from "@/components/upload/YouTubeUpload";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { useUpload } from "@/hooks/useUpload";
import { FileText, Link, Youtube } from "lucide-react";

export default function UploadPage() {
  const navigate = useNavigate();
  const { uploadPDF, uploadURL, uploadYouTube, jobStatus, isUploading } =
    useUpload();
  const [activeTab, setActiveTab] = useState("pdf");

  const handlePDFUpload = (file: File, title: string) => {
    uploadPDF.mutate({ file, title });
  };

  const handleURLUpload = (url: string, title: string) => {
    uploadURL.mutate({ url, title });
  };

  const handleYouTubeUpload = (url: string, title: string) => {
    uploadYouTube.mutate({ url, title });
  };

  const handleComplete = () => {
    // Redirect to content page after successful upload
    setTimeout(() => {
      navigate("/content");
    }, 2000);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Content</h1>
          <p className="text-muted-foreground">
            Add documents, articles, or videos to generate study materials
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Choose Content Type</CardTitle>
            <CardDescription>
              Select the type of content you want to upload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pdf" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger
                  value="youtube"
                  className="flex items-center gap-2"
                >
                  <Youtube className="h-4 w-4" />
                  YouTube
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="pdf" className="space-y-4">
                  <PDFUpload
                    onUpload={handlePDFUpload}
                    isUploading={isUploading}
                  />
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <URLUpload
                    onUpload={handleURLUpload}
                    isUploading={isUploading}
                  />
                </TabsContent>

                <TabsContent value="youtube" className="space-y-4">
                  <YouTubeUpload
                    onUpload={handleYouTubeUpload}
                    isUploading={isUploading}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Upload Progress */}
        {jobStatus && (
          <UploadProgress jobStatus={jobStatus} onComplete={handleComplete} />
        )}
      </div>
    </Layout>
  );
}
