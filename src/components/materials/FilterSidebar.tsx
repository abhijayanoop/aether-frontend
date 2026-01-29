import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Folder, FileText, Brain, BookOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  selectedType?: string;
  selectedFolder?: string;
  selectedTags: string[];
  folders: string[];
  tags: string[];
  onTypeChange: (type?: string) => void;
  onFolderChange: (folder?: string) => void;
  onTagsChange: (tags: string[]) => void;
  onClearFilters: () => void;
}

export function FilterSidebar({
  selectedType,
  selectedFolder,
  selectedTags,
  folders,
  tags,
  onTypeChange,
  onFolderChange,
  onTagsChange,
  onClearFilters,
}: FilterSidebarProps) {
  const types = [
    { value: "flashcard", label: "Flashcards", icon: FileText },
    { value: "quiz", label: "Quizzes", icon: Brain },
    { value: "summary", label: "Summaries", icon: BookOpen },
  ];

  const hasActiveFilters =
    selectedType || selectedFolder || selectedTags.length > 0;

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}

      {/* Type Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={!selectedType ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTypeChange(undefined)}
          >
            All Types
          </Button>
          {types.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTypeChange(type.value)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {type.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Folder Filter */}
      {folders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Folders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={!selectedFolder ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onFolderChange(undefined)}
            >
              <Folder className="mr-2 h-4 w-4" />
              All Folders
            </Button>
            {folders.map((folder) => (
              <Button
                key={folder}
                variant={selectedFolder === folder ? "default" : "ghost"}
                className="w-full justify-start truncate"
                onClick={() => onFolderChange(folder)}
              >
                <Folder className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{folder}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tags Filter */}
      {tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tags.map((tag) => (
              <label
                key={tag}
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-accent transition-colors",
                  selectedTags.includes(tag) && "bg-accent",
                )}
              >
                <Checkbox
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                />
                <span className="text-sm flex-1 truncate">{tag}</span>
                {selectedTags.includes(tag) && (
                  <Badge variant="secondary" className="text-xs">
                    ✓
                  </Badge>
                )}
              </label>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
