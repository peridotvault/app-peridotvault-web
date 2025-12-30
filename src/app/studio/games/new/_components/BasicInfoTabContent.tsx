import { Input } from "@/shared/components/ui/Input";
import { Textarea } from "@/shared/components/ui/Textarea";
import { useGetCategories } from "@/shared/hooks/useCategories";

interface BasicInfoTabContentProps {
  register: any;
  errors: any;
  selectedCategories: string[];
  tags: string[];
  tagInput: string;
  gameId: string;
  onCategoryToggle: (categoryId: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onTagInputChange: (value: string) => void;
}

export function BasicInfoTabContent({
  register,
  errors,
  selectedCategories,
  tags,
  tagInput,
  gameId,
  onCategoryToggle,
  onAddTag,
  onRemoveTag,
  onTagInputChange,
}: BasicInfoTabContentProps) {
  const { categories } = useGetCategories();

  return (
    <div className="space-y-10">
      {/* Basic Information */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>

        <Input
          label="Game ID"
          value={gameId}
          disabled
          helperText="Auto-generated unique identifier for your game"
        />

        <Input
          label="Game Name"
          placeholder="Enter game name"
          error={errors.name?.message}
          {...register("name")}
        />

        <Textarea
          label="Short Description"
          placeholder="Brief description for listings (max 200 chars)"
          rows={2}
          error={errors.shortDescription?.message}
          {...register("shortDescription")}
        />

        <Textarea
          label="Full Description"
          placeholder="Detailed game description"
          rows={6}
          error={errors.description?.message}
          {...register("description")}
        />

        <Input
          label="Required Age"
          type="number"
          min="0"
          max="18"
          placeholder="0"
          error={errors.requiredAge?.message}
          {...register("requiredAge", { valueAsNumber: true })}
          helperText="Enter 0 if suitable for all ages"
        />

        <Input
          label="Website URL"
          type="url"
          placeholder="https://example.com"
          error={errors.websiteUrl?.message}
          {...register("websiteUrl")}
          helperText="Optional: Link to your game's official website"
        />
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Categories</h2>
        <p className="text-sm text-muted-foreground">Select at least one category</p>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.category_id}
              type="button"
              onClick={() => onCategoryToggle(category.category_id)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition ${
                selectedCategories.includes(category.category_id)
                  ? "bg-accent text-white shadow-flat-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        {errors.categories?.message && (
          <p className="text-sm text-destructive">{errors.categories.message}</p>
        )}
      </section>

      {/* Tags */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Tags</h2>
        <p className="text-sm text-muted-foreground">Add tags to help users discover your game</p>

        <div className="flex gap-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), onAddTag())}
            placeholder="Enter tag and press Enter"
            className="flex-1 px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          <button
            type="button"
            onClick={onAddTag}
            className="px-4 py-2 rounded-md bg-muted text-foreground hover:bg-muted/80 transition"
          >
            Add Tag
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
