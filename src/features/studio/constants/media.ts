export const IMAGE_DIMENSIONS = {
  COVER_VERTICAL: { width: 600, height: 800, label: '600x800px' },
  COVER_HORIZONTAL: { width: 1280, height: 720, label: '1280x720px' },
  BANNER: { width: 1920, height: 500, label: '1920x500px' },
} as const;

export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 50 * 1024 * 1024, // 50MB
  BUILD: 500 * 1024 * 1024, // 500MB
} as const;

export const RECENT_GAMES_COUNT = 6;
