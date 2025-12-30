import { useState } from "react";
import { GameBuildInput } from "../interfaces/gameForm";

export type BuildConfig = {
  id: string;
  platform: "windows" | "mac" | "linux" | "android" | "web";
  file: File | null;
  version: string;
  architecture?: string;
  minRequirements?: string;
  recommendedRequirements?: string;
};

export function useGameFormState() {
  // Category management
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(updated);
  };

  // Tag management
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const updated = [...tags, tagInput.trim()];
      setTags(updated);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
  };

  // Media file states
  const [coverVertical, setCoverVertical] = useState<File | null>(null);
  const [coverHorizontal, setCoverHorizontal] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [previews, setPreviews] = useState<Array<{ id: string; file: File; preview: string; type: "image" | "video" }>>([]);
  const [builds, setBuilds] = useState<BuildConfig[]>([]);

  // Preview management
  const handleAddPreview = (file: File, type: "image" | "video") => {
    const preview = {
      id: Date.now().toString(),
      file,
      preview: URL.createObjectURL(file),
      type,
    };
    setPreviews((prev) => [...prev, preview]);
  };

  const handleRemovePreview = (id: string) => {
    setPreviews((prev) => {
      const preview = prev.find((p) => p.id === id);
      if (preview?.preview) {
        URL.revokeObjectURL(preview.preview);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  return {
    selectedCategories,
    handleCategoryToggle,
    tags,
    tagInput,
    handleAddTag,
    handleRemoveTag,
    setTagInput,
    coverVertical,
    setCoverVertical,
    coverHorizontal,
    setCoverHorizontal,
    bannerImage,
    setBannerImage,
    previews,
    builds,
    setBuilds,
    handleAddPreview,
    handleRemovePreview,
  };
}
