import { createMockResponse, mockDelay, mockFileUpload, storage } from "@/shared/lib/mockApi";
import { GameFormData, StudioGame } from "../interfaces/gameForm";
import { ApiResponse } from "@/shared/interfaces/api";

const STORAGE_KEY = "studio_games";

// Get all games from localStorage
const getAllGames = (): StudioGame[] => {
  return storage.get<StudioGame[]>(STORAGE_KEY, []);
};

// Save all games to localStorage
const saveAllGames = (games: StudioGame[]) => {
  storage.set(STORAGE_KEY, games);
};

// Update existing game
export async function updateGame(
  gameId: string,
  formData: GameFormData
): Promise<ApiResponse<StudioGame>> {
  await mockDelay(1000);

  try {
    const games = getAllGames();
    const gameIndex = games.findIndex((g) => g.id === gameId);

    if (gameIndex === -1) {
      return {
        success: false,
        message: "Game not found",
        data: null as StudioGame | null,
        error: "Game with the given ID does not exist",
      } as ApiResponse<StudioGame>;
    }

    // Upload new images if they are File objects
    const coverVerticalImage =
      formData.coverVerticalImage instanceof File
        ? await mockFileUpload(formData.coverVerticalImage)
        : formData.coverVerticalImage;

    const coverHorizontalImage =
      formData.coverHorizontalImage instanceof File
        ? await mockFileUpload(formData.coverHorizontalImage)
        : formData.coverHorizontalImage;

    const bannerImage =
      formData.bannerImage instanceof File ? await mockFileUpload(formData.bannerImage) : formData.bannerImage;

    // Upload preview images/videos
    const previews = await Promise.all(
      formData.previews.map(async (preview) => ({
        ...preview,
        src: preview.src instanceof File ? await mockFileUpload(preview.src) : preview.src,
      }))
    );

    // Update game object
    const existingGame = games[gameIndex];
    const updatedGame: StudioGame = {
      ...existingGame,
      ...formData,
      coverVerticalImage,
      coverHorizontalImage,
      bannerImage,
      previews,
      updatedAt: new Date().toISOString(),
      // Update publishedAt if status changed to published
      publishedAt:
        formData.status === "published" && !existingGame.publishedAt
          ? new Date().toISOString()
          : existingGame.publishedAt,
    };

    games[gameIndex] = updatedGame;
    saveAllGames(games);

    return createMockResponse(updatedGame, "Game updated successfully");
  } catch (error) {
    return {
      success: false,
      message: "Failed to update game",
      data: null as StudioGame | null,
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse<StudioGame>;
  }
}
