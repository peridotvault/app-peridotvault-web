"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateGame } from "@/features/studio/hooks/useCreateGame";
import { GameFormData, GameBuildInput } from "@/features/studio/interfaces/gameForm";
import { Tabs } from "@/shared/components/ui/Tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSave,
  faInfoCircle,
  faImage,
  faCloudUploadAlt,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { BasicInfoTabContent } from "./_components/BasicInfoTabContent";
import { MediaUploadTabContent } from "./_components/MediaUploadTabContent";
import { BuildsTabContent, BuildConfig } from "./_components/BuildsTabContent";
import { ReviewPublishTabContent } from "./_components/ReviewPublishTabContent";
import { Button } from "@/shared/components/ui/Button";

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

const TAB_STEPS = [
  { id: "basic-info", label: "Basic Info", icon: faInfoCircle, step: 1 },
  { id: "media-upload", label: "Media", icon: faImage, step: 2 },
  { id: "builds", label: "Builds", icon: faCloudUploadAlt, step: 3 },
  { id: "review-publish", label: "Review", icon: faSave, step: 4 },
] as const;

export default function CreateNewGamePage() {
  const router = useRouter();
  const { createNewGame, isLoading } = useCreateGame();

  // Tab state
  const [activeTab, setActiveTab] = useState("basic-info");

  // Form state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverVertical, setCoverVertical] = useState<File | null>(null);
  const [coverHorizontal, setCoverHorizontal] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [previews, setPreviews] = useState<Array<{ id: string; file: File; preview: string; type: "image" | "video" }>>([]);
  const [builds, setBuilds] = useState<BuildConfig[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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

  const formValues = watch();

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

  const handleSaveDraft = async (publish: boolean = false) => {
    const formData: GameFormData = {
      name: formValues.name,
      shortDescription: formValues.shortDescription,
      description: formValues.description,
      categories: selectedCategories,
      tags: tags,
      requiredAge: formValues.requiredAge,
      price: formValues.price,
      releaseDate: formValues.releaseDate,
      coverVerticalImage: coverVertical,
      coverHorizontalImage: coverHorizontal,
      bannerImage: bannerImage || null,
      previews: previews.map((preview) => ({
        id: preview.id,
        kind: preview.type,
        src: preview.file,
        order: 0,
      })),
      distributions: [],
      builds: builds.map((build) => ({
        id: build.id,
        platform: build.platform,
        file: build.file || undefined,
        version: build.version,
        architecture: build.architecture,
        minRequirements: build.minRequirements,
        recommendedRequirements: build.recommendedRequirements,
      })),
      status: publish ? "published" : "draft",
      tokenSymbol: "ICP",
    };

    const result = await createNewGame(formData);

    if (result.success) {
      router.push("/studio/games");
    }
  };

  // Calculate completion for each tab
  const getTabCompletion = (tabId: string) => {
    switch (tabId) {
      case "basic-info":
        return !!(
          formValues.name &&
          formValues.shortDescription &&
          formValues.description &&
          selectedCategories.length > 0
        );
      case "media-upload":
        return !!(coverVertical && coverHorizontal);
      case "builds":
        return builds.length > 0;
      case "review-publish":
        return false;
      default:
        return false;
    }
  };

  const currentStep = TAB_STEPS.findIndex((t) => t.id === activeTab) + 1;

  // Enhanced tab definitions with icons and completion status
  const tabs = TAB_STEPS.map((tab) => {
    let content;
    switch (tab.id) {
      case "basic-info":
        content = (
          <BasicInfoTabContent
            register={register}
            errors={errors}
            selectedCategories={selectedCategories}
            tags={tags}
            tagInput={tagInput}
            onCategoryToggle={handleCategoryToggle}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onTagInputChange={setTagInput}
          />
        );
        break;
      case "media-upload":
        content = (
          <MediaUploadTabContent
            coverVertical={coverVertical}
            onCoverVerticalChange={setCoverVertical}
            coverHorizontal={coverHorizontal}
            onCoverHorizontalChange={setCoverHorizontal}
            bannerImage={bannerImage}
            onBannerImageChange={setBannerImage}
          />
        );
        break;
      case "builds":
        content = (
          <BuildsTabContent
            builds={builds}
            onBuildsChange={setBuilds}
          />
        );
        break;
      case "review-publish":
        content = (
          <ReviewPublishTabContent
            formData={{
              name: formValues.name || "",
              shortDescription: formValues.shortDescription || "",
              description: formValues.description || "",
              requiredAge: formValues.requiredAge || 0,
              categories: selectedCategories,
              tags: tags,
            }}
            mediaData={{
              coverVertical,
              coverHorizontal,
              bannerImage,
              previews,
            }}
            buildsData={builds}
            pricingData={{
              price: formValues.price || 0,
              releaseDate: formValues.releaseDate,
            }}
            register={register}
            errors={errors}
            onPublish={() => handleSaveDraft(true)}
            onSaveDraft={() => handleSaveDraft(false)}
            isPublishing={isLoading}
          />
        );
        break;
    }

    return {
      id: tab.id,
      label: tab.label,
      content,
    };
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Progress */}
      <div className="mb-10">
        <Link
          href="/studio/games"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-4 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="sm" />
          Back to My Games
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Create New{" "}
              <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                Game
              </span>
            </h1>
            {/* <p className="text-muted-foreground mt-2 text-lg"> */}
            {/*   Step {currentStep} of 4: {TAB_STEPS[currentStep - 1]?.label} */}
            {/* </p> */}
          </div>

          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-2">
            {TAB_STEPS.map((step, index) => {
              const isCompleted = getTabCompletion(step.id);
              const isActive = activeTab === step.id;
              const isPast = index < currentStep - 1;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm transition-all ${isActive
                      ? "bg-accent text-white shadow-lg scale-110"
                      : isCompleted
                        ? "bg-success text-white"
                        : isPast
                          ? "bg-success/20 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {isCompleted ? (
                      <FontAwesomeIcon icon={faCheck} size="sm" />
                    ) : (
                      step.step
                    )}
                  </div>
                  {index < TAB_STEPS.length - 1 && (
                    <div
                      className={`w-12 h-0.5 ${isPast ? "bg-success" : "bg-border"
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabbed Form with Enhanced Styling */}
      <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden">
        <Tabs
          tabs={tabs}
          defaultTab="basic-info"
          variant="underline"
          onTabChange={(tabId) => setActiveTab(tabId)}
        />
      </div>

      {/* Floating Save Draft Button for Tabs 1-3 */}
      {activeTab !== "review-publish" && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={() => handleSaveDraft(false)}
            isLoading={isLoading}
            size="lg"
            className="gap-3 shadow-xl hover:shadow-2xl transition-shadow rounded-full px-8 py-6"
          >
            <FontAwesomeIcon icon={faSave} />
            Save as Draft
          </Button>
        </div>
      )}
    </div>
  );
}
