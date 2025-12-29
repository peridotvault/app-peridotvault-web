import { useState } from "react";
import { FileUpload } from "@/shared/components/ui/FileUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faImage } from "@fortawesome/free-solid-svg-icons";

interface PreviewFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

interface MediaUploadTabContentProps {
  coverVertical: File | null;
  onCoverVerticalChange: (file: File | null) => void;
  coverHorizontal: File | null;
  onCoverHorizontalChange: (file: File | null) => void;
  bannerImage: File | null;
  onBannerImageChange: (file: File | null) => void;
}

export function MediaUploadTabContent({
  coverVertical,
  onCoverVerticalChange,
  coverHorizontal,
  onCoverHorizontalChange,
  bannerImage,
  onBannerImageChange,
}: MediaUploadTabContentProps) {
  const [previews, setPreviews] = useState<PreviewFile[]>([]);

  const handleAddPreview = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Please upload an image or video file");
      return;
    }

    const preview: PreviewFile = {
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      type: isImage ? "image" : "video",
    };

    setPreviews([...previews, preview]);
  };

  const handleRemovePreview = (id: string) => {
    setPreviews(previews.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-10">
      {/* Cover Images */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Cover Images</h2>
        <p className="text-sm text-muted-foreground">
          Upload cover images for your game listing
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUpload
            label="Cover Vertical"
            accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
            aspectRatio="portrait"
            onFileSelect={onCoverVerticalChange}
            error={!coverVertical ? "Cover image is required" : undefined}
            helperText="Recommended: 600x800px"
            currentPreview={coverVertical ? URL.createObjectURL(coverVertical) : undefined}
          />

          <FileUpload
            label="Cover Horizontal"
            accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
            aspectRatio="landscape"
            onFileSelect={onCoverHorizontalChange}
            error={!coverHorizontal ? "Cover image is required" : undefined}
            helperText="Recommended: 1280x720px"
            currentPreview={coverHorizontal ? URL.createObjectURL(coverHorizontal) : undefined}
          />
        </div>
      </section>

      {/* Banner Image */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Banner Image</h2>

        <FileUpload
          label="Banner Image"
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
          aspectRatio="video"
          onFileSelect={onBannerImageChange}
          helperText="Recommended: 1920x500px (optional)"
          currentPreview={bannerImage ? URL.createObjectURL(bannerImage) : undefined}
        />
      </section>

      {/* Preview Images */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Screenshots & Videos</h2>
            <p className="text-sm text-muted-foreground">
              Add screenshots and videos to showcase your game
            </p>
          </div>
          <label className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-white hover:bg-accent/90 transition cursor-pointer">
            <FontAwesomeIcon icon={faPlus} />
            Add Preview
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.gif,.mp4,.webm,.mov"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAddPreview(file);
              }}
              className="hidden"
            />
          </label>
        </div>

        {previews.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-border">
            <FontAwesomeIcon icon={faImage} className="text-4xl text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No previews yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add screenshots and videos to showcase your game
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview) => (
              <div
                key={preview.id}
                className="relative group aspect-video bg-muted rounded-lg overflow-hidden"
              >
                {preview.type === "image" ? (
                  <img
                    src={preview.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={preview.preview}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleRemovePreview(preview.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-destructive/90"
                >
                  <FontAwesomeIcon icon={faTimes} size="sm" />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white rounded text-xs">
                  {preview.type === "image" ? "Image" : "Video"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
