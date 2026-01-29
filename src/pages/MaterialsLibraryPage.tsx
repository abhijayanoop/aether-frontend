import { useState, useMemo } from "react";
import { Search, Trash2, Grid3x3, List } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterSidebar } from "@/components/materials/FilterSidebar";
import { MaterialsGrid } from "@/components/materials/MaterialsGrid";
import { StatsCard } from "@/components/materials/StatsCard";
import { useAllMaterials } from "@/hooks/useAllMaterials";
import { useDebounce } from "@/hooks/useDebounce";

export default function MaterialsLibraryPage() {
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>();
  const [selectedFolder, setSelectedFolder] = useState<string>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  // Debounce search
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch materials
  const {
    materials,
    pagination,
    isLoading,
    folders,
    tags,
    stats,
    deleteMaterial,
    bulkDelete,
  } = useAllMaterials({
    search: debouncedSearch,
    type: selectedType as any,
    folder: selectedFolder,
    tags: selectedTags,
  });

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedType(undefined);
    setSelectedFolder(undefined);
    setSelectedTags([]);
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === materials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(materials.map((m) => m._id));
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`Delete ${selectedIds.length} materials?`)) {
      await bulkDelete.mutateAsync(selectedIds);
      setSelectedIds([]);
      setSelectionMode(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this material?")) {
      await deleteMaterial.mutateAsync(id);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Study Materials</h1>
          <p className="text-muted-foreground">
            Manage and organize your learning materials
          </p>
        </div>

        {/* Stats */}
        <StatsCard stats={stats} folders={folders} tags={tags} />

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            variant={selectionMode ? "default" : "outline"}
            onClick={() => {
              setSelectionMode(!selectionMode);
              setSelectedIds([]);
            }}
          >
            {selectionMode ? "Cancel" : "Select"}
          </Button>

          {selectionMode && selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={bulkDelete.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedIds.length})
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <FilterSidebar
              selectedType={selectedType}
              selectedFolder={selectedFolder}
              selectedTags={selectedTags}
              folders={folders}
              tags={tags}
              onTypeChange={setSelectedType}
              onFolderChange={setSelectedFolder}
              onTagsChange={setSelectedTags}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Materials Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <MaterialsGrid
                  materials={materials}
                  selectedIds={selectedIds}
                  onSelect={handleSelect}
                  onSelectAll={handleSelectAll}
                  onDelete={handleDelete}
                  selectionMode={selectionMode}
                />
              </div>
            )}

            {/* Pagination Info */}
            {pagination && pagination.total > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Showing {materials.length} of {pagination.total} materials
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
