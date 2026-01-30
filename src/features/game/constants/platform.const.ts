import { faApple, faLinux, faWindows } from "@fortawesome/free-brands-svg-icons";
import { faGlobe, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { GamePlatform } from "../types/game.type";

export const PLATFORM_ICON_MAP: Record<GamePlatform, IconDefinition> = {
    web: faGlobe,
    windows: faWindows,
    macos: faApple,
    linux: faLinux,
};
