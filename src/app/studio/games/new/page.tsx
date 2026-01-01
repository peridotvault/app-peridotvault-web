"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { generateGameId } from "@/shared/utils/generateGameId";
import { BasicInfoTabContent } from "./_components/BasicInfoTabContent";
import { MediaUploadTabContent } from "./_components/MediaUploadTabContent";
import { BuildsTabContent } from "./_components/BuildsTabContent";
import { ReviewPublishTabContent } from "./_components/ReviewPublishTabContent";
import { WizardProgress, WIZARD_STEPS } from "./_components/WizardProgress";
import { WizardActions } from "./_components/WizardActions";
import { useGameFormWizard } from "@/features/studio/hooks/useGameFormWizard";
import { useGameFormState } from "@/features/studio/hooks/useGameFormState";
import { useGameFormSubmission } from "@/features/studio/hooks/useGameFormSubmission";
import { transformToGameFormData } from "@/features/studio/utils/gameFormTransformer";
import { WIZARD_STEPS as CONST_WIZARD_STEPS } from "@/features/studio/constants/steps";

// Validation schema
const gameFormSchema = z.object({
  gameId: z.string().min(8, "Game ID must be 8 characters"),
  name: z.string().min(1, "Game name is required").min(3, "Game name must be at least 3 characters"),
  shortDescription: z.string().min(1, "Short description is required"),
  description: z.string().min(1, "Full description is required"),
  websiteUrl: z.string().url().nullable().optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()),
  requiredAge: z.number().min(0).max(18),
  price: z.number().min(0),
  releaseDate: z.date().nullable(),
});

export type GameFormInput = z.infer<typeof gameFormSchema>;

export default function CreateNewGamePage() {
  const router = useRouter();

  // Generate unique game ID on mount
  const [gameId] = useState(() => generateGameId());

  // Use custom hooks
  const {
    currentStep,
    completedSteps,
    handleNext,
    handleBack,
    handleSkip,
    handleStepClick,
  } = useGameFormWizard(CONST_WIZARD_STEPS.length);

  const {
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
  } = useGameFormState();

  const { handleSubmit: submitForm, isSubmitting } = useGameFormSubmission();

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<GameFormInput>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      gameId: gameId,
      name: "",
      shortDescription: "",
      description: "",
      websiteUrl: null,
      categories: [],
      tags: [],
      requiredAge: 0,
      price: 0,
      releaseDate: null,
    },
  });

  const formValues = watch();

  // Sync categories and tags with React Hook Form
  useEffect(() => {
    setValue("categories", selectedCategories);
  }, [selectedCategories, setValue]);

  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const handleSaveDraft = async (publish: boolean = false) => {
    const mediaState = {
      coverVerticalImage: coverVertical,
      coverHorizontalImage: coverHorizontal,
      bannerImage: bannerImage,
      previews,
    };

    const buildState = { builds };

    const formData = transformToGameFormData(
      {
        ...formValues,
        gameId,
        categories: selectedCategories,
        tags,
      },
      mediaState,
      buildState,
      publish
    );

    const result = await submitForm(formData);

    if (result.success) {
      router.push("/studio/games");
    } else if (result.error) {
      // Error is already set in the hook
      console.error("Failed to save game:", result.error);
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

  const handleNextWithValidation = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    await handleNext();
  };

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
                  gameId={gameId}
                  onCategoryToggle={handleCategoryToggle}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  onTagInputChange={setTagInput}
                />
                <WizardActions
                  currentStep={currentStep}
                  totalSteps={WIZARD_STEPS.length}
                  canGoNext={!!(
                    formValues.name &&
                    formValues.shortDescription &&
                    formValues.description &&
                    selectedCategories.length > 0
                  )}
                  canSkip={false}
                  isSubmitting={isSubmitting}
                  onBack={handleBack}
                  onNext={handleNextWithValidation}
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
                  isSubmitting={isSubmitting}
                  onBack={handleBack}
                  onNext={handleNextWithValidation}
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
                  isSubmitting={isSubmitting}
                  onBack={handleBack}
                  onNext={handleNextWithValidation}
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
                    gameId: gameId,
                    name: formValues.name || "",
                    shortDescription: formValues.shortDescription || "",
                    description: formValues.description || "",
                    websiteUrl: formValues.websiteUrl || null,
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
                  register={register}
                  errors={errors}
                />
                <WizardActions
                  currentStep={currentStep}
                  totalSteps={WIZARD_STEPS.length}
                  canGoNext={false}
                  canSkip={false}
                  isSubmitting={isSubmitting}
                  onBack={handleBack}
                  onNext={handleNextWithValidation}
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
