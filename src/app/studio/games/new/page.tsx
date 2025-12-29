"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateGame } from "@/features/studio/hooks/useCreateGame";
import { GameFormData, GameBuildInput } from "@/features/studio/interfaces/gameForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { BasicInfoTabContent } from "./_components/BasicInfoTabContent";
import { MediaUploadTabContent } from "./_components/MediaUploadTabContent";
import { BuildsTabContent, BuildConfig } from "./_components/BuildsTabContent";
import { ReviewPublishTabContent } from "./_components/ReviewPublishTabContent";
import { WizardProgress, WIZARD_STEPS } from "./_components/WizardProgress";
import { WizardActions } from "./_components/WizardActions";

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

export default function CreateNewGamePage() {
  const router = useRouter();
  const { createNewGame, isLoading } = useCreateGame();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

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
    trigger,
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

  // Step validation
  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1: // Basic Info
        const isValid = await trigger([
          "name",
          "shortDescription",
          "description",
          "categories"
        ]);
        return isValid && selectedCategories.length > 0;
      case 2: // Media
        return true; // Optional, always valid
      case 3: // Builds
        return true; // Optional, always valid
      default:
        return true;
    }
  };

  // Navigation handlers
  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    // Move to next step
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Mark as completed even if skipped
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = async (stepIndex: number) => {
    // Only allow navigation to completed or previous steps
    if (completedSteps.has(stepIndex + 1) || stepIndex < currentStep - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  // Check if can proceed to next step
  const canGoNext = async () => {
    switch (currentStep) {
      case 1:
        return !!(
          formValues.name &&
          formValues.shortDescription &&
          formValues.description &&
          selectedCategories.length > 0
        );
      case 2:
        return true; // Optional
      case 3:
        return true; // Optional
      default:
        return true;
    }
  };

  const canSkip = currentStep === 2 || currentStep === 3; // Media and Builds are optional

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 px-8">
        <Link
          href="/studio/games"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-4 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="sm" />
          Back to My Games
        </Link>

        <h1 className="text-4xl font-bold text-foreground">
          Create New{" "}
          <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
            Game
          </span>
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Follow the steps to create and publish your game
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-8">
        {/* Left Column: Progress Tracker */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <WizardProgress
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />
          </div>
        </div>

        {/* Right Column: Form Content */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-xl border border-border shadow-md p-8">
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-6 pb-6 border-b border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Basic Information</h2>
                  <p className="text-muted-foreground">
                    Tell us about your game. All fields are required.
                  </p>
                </div>
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
                <WizardActions
                  currentStep={currentStep}
                  totalSteps={WIZARD_STEPS.length}
                  canGoNext={!!(formValues.name && formValues.shortDescription && formValues.description && selectedCategories.length > 0)}
                  canSkip={false}
                  isSubmitting={isLoading}
                  onBack={handleBack}
                  onNext={handleNext}
                  onSaveDraft={() => handleSaveDraft(false)}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-6 pb-6 border-b border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Media Upload</h2>
                  <p className="text-muted-foreground">
                    Add cover images and screenshots. You can skip this step and add media later.
                  </p>
                </div>
                <MediaUploadTabContent
                  coverVertical={coverVertical}
                  onCoverVerticalChange={setCoverVertical}
                  coverHorizontal={coverHorizontal}
                  onCoverHorizontalChange={setCoverHorizontal}
                  bannerImage={bannerImage}
                  onBannerImageChange={setBannerImage}
                />
                <WizardActions
                  currentStep={currentStep}
                  totalSteps={WIZARD_STEPS.length}
                  canGoNext={true}
                  canSkip={true}
                  isSubmitting={isLoading}
                  onBack={handleBack}
                  onNext={handleNext}
                  onSkip={handleSkip}
                  onSaveDraft={() => handleSaveDraft(false)}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-6 pb-6 border-b border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Game Builds</h2>
                  <p className="text-muted-foreground">
                    Upload game files for different platforms. You can skip this step and add builds later.
                  </p>
                </div>
                <BuildsTabContent
                  builds={builds}
                  onBuildsChange={setBuilds}
                />
                <WizardActions
                  currentStep={currentStep}
                  totalSteps={WIZARD_STEPS.length}
                  canGoNext={true}
                  canSkip={true}
                  isSubmitting={isLoading}
                  onBack={handleBack}
                  onNext={handleNext}
                  onSkip={handleSkip}
                  onSaveDraft={() => handleSaveDraft(false)}
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-6 pb-6 border-b border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Review & Publish</h2>
                  <p className="text-muted-foreground">
                    Review your game information and publish when ready.
                  </p>
                </div>
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
                <WizardActions
                  currentStep={currentStep}
                  totalSteps={WIZARD_STEPS.length}
                  canGoNext={false}
                  canSkip={false}
                  isSubmitting={isLoading}
                  onBack={handleBack}
                  onNext={handleNext}
                  onSaveDraft={() => handleSaveDraft(false)}
                  onPublish={() => handleSaveDraft(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
