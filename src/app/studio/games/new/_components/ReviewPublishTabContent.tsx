import { Input } from "@/shared/components/ui/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { BuildConfig } from "./BuildsTabContent";

interface ReviewPublishTabContentProps {
  formData: {
    gameId: string;
    name: string;
    shortDescription: string;
    description: string;
    websiteUrl: string | null;
    requiredAge: number;
    categories: string[];
    tags: string[];
  };
  mediaData: {
    coverVertical: File | null;
    coverHorizontal: File | null;
    bannerImage: File | null;
    previews: Array<{ file: File }>;
  };
  buildsData: BuildConfig[];
  pricingData: {
    price: number;
    releaseDate: Date | null;
  };
  register: any;
  errors: any;
  onPublish: () => void;
  onSaveDraft: () => void;
  isPublishing: boolean;
}

export function ReviewPublishTabContent({
  formData,
  mediaData,
  buildsData,
  pricingData,
  register,
  errors,
  onPublish,
  onSaveDraft,
  isPublishing,
}: ReviewPublishTabContentProps) {
  // Validation checks
  const checks = {
    basicInfo: {
      label: "Basic Information",
      items: [
        { label: "Game Name", valid: !!formData.name, required: true },
        { label: "Short Description", valid: !!formData.shortDescription, required: true },
        { label: "Full Description", valid: !!formData.description, required: true },
        { label: "Categories", valid: formData.categories.length > 0, required: true },
      ],
    },
    media: {
      label: "Media",
      items: [
        { label: "Cover Vertical", valid: !!mediaData.coverVertical, required: true },
        { label: "Cover Horizontal", valid: !!mediaData.coverHorizontal, required: true },
      ],
    },
    builds: {
      label: "Builds",
      items: [
        {
          label: "At least one build",
          valid: buildsData.length > 0 && buildsData.some((b) => b.file),
          required: true,
        },
      ],
    },
  };

  const allRequiredValid = Object.values(checks).every((section) =>
    section.items.every((item) => !item.required || item.valid)
  );

  return (
    <div className="space-y-8">
      {/* Validation Summary */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Review Your Game</h2>
        <p className="text-sm text-muted-foreground">
          Review your game information before publishing. Make sure all required fields are
          complete.
        </p>

        {Object.entries(checks).map(([sectionKey, section]) => (
          <div key={sectionKey} className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">{section.label}</h3>
            <div className="space-y-3">
              {section.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={item.valid ? faCheckCircle : faExclamationCircle}
                      className={
                        item.valid ? "text-success" : item.required ? "text-destructive" : "text-warning"
                      }
                    />
                    <span className={item.valid ? "text-foreground" : "text-muted-foreground"}>
                      {item.label}
                      {item.required && <span className="text-destructive ml-1">*</span>}
                    </span>
                  </div>
                  {!item.valid && item.required && (
                    <span className="text-sm text-destructive">Required</span>
                  )}
                  {!item.valid && !item.required && (
                    <span className="text-sm text-muted-foreground">Optional</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Data Summary */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Game Information</h2>

        {/* Basic Info Summary */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Basic Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Game ID</span>
              <span className="text-foreground font-medium font-mono">{formData.gameId || "-"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Name</span>
              <span className="text-foreground font-medium">{formData.name || "-"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Website URL</span>
              {formData.websiteUrl ? (
                <a
                  href={formData.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-medium"
                >
                  {formData.websiteUrl}
                </a>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Required Age</span>
              <span className="text-foreground font-medium">
                {formData.requiredAge || 0}+ years
              </span>
            </div>
            <div className="py-2">
              <span className="text-muted-foreground block mb-2">Short Description</span>
              <p className="text-foreground">{formData.shortDescription || "-"}</p>
            </div>
            <div className="py-2">
              <span className="text-muted-foreground block mb-2">Categories</span>
              <div className="flex flex-wrap gap-2">
                {formData.categories.length > 0 ? (
                  formData.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-1 bg-accent/20 text-accent rounded text-xs"
                    >
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
            </div>
            <div className="py-2">
              <span className="text-muted-foreground block mb-2">Tags</span>
              <div className="flex flex-wrap gap-2">
                {formData.tags.length > 0 ? (
                  formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-accent/20 text-accent rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Media Summary */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Media</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Cover Vertical</span>
              {mediaData.coverVertical ? (
                <img
                  src={URL.createObjectURL(mediaData.coverVertical)}
                  alt="Cover Vertical"
                  className="mt-2 w-full aspect-[3/4] object-cover rounded"
                />
              ) : (
                <div className="mt-2 w-full aspect-[3/4] bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
                  Not uploaded
                </div>
              )}
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Cover Horizontal</span>
              {mediaData.coverHorizontal ? (
                <img
                  src={URL.createObjectURL(mediaData.coverHorizontal)}
                  alt="Cover Horizontal"
                  className="mt-2 w-full aspect-video object-cover rounded"
                />
              ) : (
                <div className="mt-2 w-full aspect-video bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
                  Not uploaded
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Builds Summary */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Builds ({buildsData.length})</h3>
          {buildsData.length > 0 ? (
            <div className="space-y-2">
              {buildsData.map((build) => (
                <div
                  key={build.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground capitalize">{build.platform}</span>
                    <span className="text-sm text-muted-foreground">{build.version}</span>
                    {build.architecture && (
                      <span className="text-xs text-muted-foreground">({build.architecture})</span>
                    )}
                  </div>
                  {build.file ? (
                    <span className="text-xs text-success">File uploaded</span>
                  ) : (
                    <span className="text-xs text-destructive">No file</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No builds configured</p>
          )}
        </div>
      </section>

      {/* Pricing & Settings */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Pricing & Release</h2>

        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <Input
            label="Price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            error={errors.price?.message}
            {...register("price", { valueAsNumber: true })}
            helperText="Enter 0 for free games"
          />

          <Input
            label="Release Date"
            type="date"
            {...register("releaseDate", { valueAsDate: true })}
            helperText="Leave empty if not yet decided"
          />
        </div>
      </section>

      {/* Warning if not ready */}
      {!allRequiredValid && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
          <p className="text-sm text-warning font-medium">
            ⚠️ Please complete all required fields before publishing
          </p>
        </div>
      )}
    </div>
  );
}
