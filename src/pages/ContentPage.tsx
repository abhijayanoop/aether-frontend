import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentCard } from "@/components/content/ContentCard";
import { SearchFilter } from "@/components/content/SearchFilter";
import { EmptyState } from "@/components/content/EmptyState";
import { useContent } from "@/hooks/useContent";

export default function ContentPage() {
  const navigate = useNavigate();
  const { content, isLoading, deleteContent } = useContent();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  console.log("content:", content);

  // Filter and search
  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || item.processingStatus === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [content, search, typeFilter, statusFilter]);

  const hasFilters = search || typeFilter !== "all" || statusFilter !== "all";

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Content</h1>
            <p className="text-muted-foreground">
              Manage your uploaded documents and media
            </p>
          </div>
          <Button onClick={() => navigate("/upload")}>
            <Plus className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>

        {/* Search & Filters */}
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : filteredContent.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.map((item) => (
              <ContentCard
                key={item._id}
                content={item}
                onDelete={() => deleteContent.mutate(item._id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState hasFilters={hasFilters} />
        )}
      </div>
    </Layout>
  );
}
