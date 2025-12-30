import { faDesktop, faMobile, faGlobe } from "@fortawesome/free-solid-svg-icons";

export const PLATFORMS = [
  { id: "windows", name: "Windows", icon: faDesktop, architectures: ["32-bit", "64-bit"] },
  { id: "mac", name: "macOS", icon: faDesktop, architectures: ["64-bit", "arm", "universal"] },
  { id: "linux", name: "Linux", icon: faDesktop, architectures: ["32-bit", "64-bit", "arm"] },
  { id: "android", name: "Android", icon: faMobile, architectures: ["armeabi-v7a", "arm64-v8a", "x86", "x86_64"] },
  { id: "web", name: "Web", icon: faGlobe, architectures: [] },
] as const;

export const PLATFORM_EXTENSIONS = {
  windows: ".exe",
  mac: ".dmg",
  linux: ".AppImage",
  android: ".apk",
  web: ".zip",
} as const;

export type PlatformId = typeof PLATFORMS[number]["id"];

export const DEFAULT_VERSION = "1.0.0";
