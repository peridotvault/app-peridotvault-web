import { faApple, faLinux, faWindows } from "@fortawesome/free-brands-svg-icons";
import { faGlobe, IconDefinition } from "@fortawesome/free-solid-svg-icons";

export const PLATFORM_ICON_MAP: Record<string, IconDefinition> = {
    "web": faGlobe,
    "windows": faWindows,
    "macos": faApple,
    "linux": faLinux,
};
