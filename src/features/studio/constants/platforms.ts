export const PLATFORM_CONFIGS = {
  windows: { extension: '.exe', name: 'Windows' },
  android: { extension: '.apk', name: 'Android' },
  mac: { extension: '.dmg', name: 'macOS' },
  linux: { extension: '.AppImage', name: 'Linux' },
  web: { extension: '.zip', name: 'Web' },
} as const;

export type Platform = keyof typeof PLATFORM_CONFIGS;

export const getPlatformExtension = (platform: Platform): string => {
  return PLATFORM_CONFIGS[platform]?.extension || '.zip';
};
