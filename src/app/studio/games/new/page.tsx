"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateGame } from "@/features/studio/hooks/useCreateGame";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Textarea } from "@/shared/components/ui/Textarea";
import { FileUpload } from "@/shared/components/ui/FileUpload";
import { GameFormData } from "@/features/studio/interfaces/gameForm";

// Validation schema
const gameFormSchema = z.object({
  name: z.string().min(1, "Game name is required").min(3, "Game name must be at least 3 characters"),
  shortDescription: z.string().min(1, "Short description is required"),
  description: z.string().min(1, "Full description is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()),
  requiredAge: z.number().min(0).max(18),
  price: z.number().min(0),
  releaseDate: z.date().nullable(),
});

type GameFormInput = z.infer<typeof gameFormSchema>;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSave,
  faPaperPlane,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useGetCategories } from "@/shared/hooks/useCategories";

export default function CreateNewGamePage() {
  const router = useRouter();
  const { createNewGame, isLoading } = useCreateGame();
  const { categories } = useGetCategories();

  // Form state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverVertical, setCoverVertical] = useState<File | null>(null);
  const [coverHorizontal, setCoverHorizontal] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<GameFormInput>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      categories: [],
      tags: [],
      requiredAge: 0,
      price: 0,
      releaseDate: null,
    },
  });

  const handleCategoryToggle = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(updated);
    setValue("categories", updated);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const updated = [...tags, tagInput.trim()];
      setTags(updated);
      setValue("tags", updated);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
    setValue("tags", updated);
  };

  const onSubmit = async (data: GameFormInput, publish: boolean = false) => {
    const formData: GameFormData = {
      ...data,
      categories: selectedCategories,
      tags,
      coverVerticalImage: coverVertical,
      coverHorizontalImage: coverHorizontal,
      bannerImage: bannerImage || null,
      previews: [],
      distributions: [],
      price: Number(data.price),
      requiredAge: Number(data.requiredAge),
      status: publish ? "published" : "draft",
      releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
      tokenSymbol: "ICP", // Default token
    };

    const result = await createNewGame(formData);

    if (result.success) {
      router.push("/studio/games");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/studio/games" className="text-sm text-muted-foreground hover:text-accent mb-4 inline-block">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to My Games
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Create New Game</h1>
        <p className="text-muted-foreground mt-1">Fill in the details to create your game</p>
      </div>

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()} className="bg-card rounded-lg border border-border p-8">
        <div className="flex flex-col gap-6">
          {/* Basic Info */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>

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
          </section>

          {/* Categories */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Categories</h2>
            <p className="text-sm text-muted-foreground">Select at least one category</p>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.category_id}
                  type="button"
                  onClick={() => handleCategoryToggle(category.category_id)}
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
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Tags</h2>
            <p className="text-sm text-muted-foreground">Add tags to help users discover your game</p>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Enter tag and press Enter"
                className="flex-1 px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                Add Tag
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Media */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Media</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                label="Cover Vertical"
                accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                aspectRatio="portrait"
                onFileSelect={setCoverVertical}
                error={!coverVertical ? "Cover image is required" : undefined}
                helperText="Recommended: 600x800px"
              />

              <FileUpload
                label="Cover Horizontal"
                accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                aspectRatio="landscape"
                onFileSelect={setCoverHorizontal}
                error={!coverHorizontal ? "Cover image is required" : undefined}
                helperText="Recommended: 1280x720px"
              />
            </div>

            <FileUpload
              label="Banner Image"
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
              aspectRatio="video"
              onFileSelect={setBannerImage}
              helperText="Recommended: 1920x500px (optional)"
            />
          </section>

          {/* Pricing */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Pricing</h2>

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
          </section>

          {/* Actions */}
          <section className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
            <Button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, false))}
              isLoading={isLoading}
              className="flex-1 gap-2"
            >
              <FontAwesomeIcon icon={faSave} />
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, true))}
              isLoading={isLoading}
              className="flex-1 gap-2"
              variant="primary"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              Publish Game
            </Button>
          </section>
        </div>
      </form>
    </div>
  );
}
