import { GameDistribution, GamePlatform } from "@/features/game/types/game.type";

export function getSupportedPlatforms(
    distributions: GameDistribution[],
): Set<GamePlatform> {
    const platforms = new Set<GamePlatform>();

    for (const dist of distributions) {
        if ("web" in dist) {
            platforms.add("web");
        }

        if ("native" in dist) {
            const os = dist.native.os.toLowerCase();

            if (os.includes("win")) platforms.add("windows");
            if (os.includes("mac") || os.includes("osx")) platforms.add("macos");
            if (os.includes("linux")) platforms.add("linux");
        }
    }

    return platforms;
}
