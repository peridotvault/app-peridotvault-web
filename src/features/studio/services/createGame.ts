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

// Create new game
export async function createGame(formData: GameFormData): Promise<ApiResponse<StudioGame>> {
  await mockDelay(1000);

  try {
    // Upload images if they are File objects
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

    // Create new game object
    const newGame: StudioGame = {
      ...formData,
      id: formData.gameId, // Use the game ID from form instead of generating new one
      coverVerticalImage,
      coverHorizontalImage,
      bannerImage,
      previews,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: formData.status === "published" ? new Date().toISOString() : undefined,
      views: 0,
      purchases: 0,
    };

    // Save to localStorage
    const games = getAllGames();
    games.push(newGame);
    saveAllGames(games);

    return createMockResponse(newGame, "Game created successfully");
  } catch (error) {
    return {
      success: false,
      message: "Failed to create game",
      data: null as StudioGame | null,
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse<StudioGame>;
  }
}
