export const STEP_COUNT = 4;
export const REVIEW_STEP = 4;

export const WIZARD_STEPS = [
  { id: 1, title: 'Basic Info', description: 'Game details' },
  { id: 2, title: 'Media Upload', description: 'Images & videos' },
  { id: 3, title: 'Game Builds', description: 'Platform files' },
  { id: 4, title: 'Review & Publish', description: 'Final review' },
] as const;
