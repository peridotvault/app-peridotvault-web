import { mockDelay, storage, createMockResponse } from "@/shared/lib/mockApi";
import { StudioGame } from "../interfaces/gameForm";
import { ApiResponse } from "@/shared/interfaces/api";

const STORAGE_KEY = "studio_games";

// Get all games from localStorage
const getAllGames = (): StudioGame[] => {
  return storage.get<StudioGame[]>(STORAGE_KEY, []);
};

// Get user's games (both draft and published)
export async function getUserGames(): Promise<ApiResponse<StudioGame[]>> {
  await mockDelay(500);

  const games = getAllGames();
  return createMockResponse(games, "Games retrieved successfully");
}

// Get user's draft games
export async function getUserDrafts(): Promise<ApiResponse<StudioGame[]>> {
  await mockDelay(500);

  const games = getAllGames();
  const drafts = games.filter((g) => g.status === "draft");

  return createMockResponse(drafts, "Drafts retrieved successfully");
}

// Get user's published games
export async function getUserPublishedGames(): Promise<ApiResponse<StudioGame[]>> {
  await mockDelay(500);

  const games = getAllGames();
  const published = games.filter((g) => g.status === "published");

  return createMockResponse(published, "Published games retrieved successfully");
}

// Get game by ID
export async function getGameById(gameId: string): Promise<ApiResponse<StudioGame>> {
  await mockDelay(500);

  const games = getAllGames();
  const game = games.find((g) => g.id === gameId);

  if (!game) {
    return {
      success: false,
      message: "Game not found",
      data: null as StudioGame | null,
      error: "Game with the given ID does not exist",
    } as ApiResponse<StudioGame>;
  }

  return createMockResponse(game, "Game retrieved successfully");
}

// Delete game
export async function deleteGame(gameId: string): Promise<ApiResponse<void>> {
  await mockDelay(800);

  const games = getAllGames();
  const filteredGames = games.filter((g) => g.id !== gameId);

  storage.set(STORAGE_KEY, filteredGames);

  return createMockResponse(undefined, "Game deleted successfully");
}

// Publish draft
export async function publishGame(gameId: string): Promise<ApiResponse<StudioGame>> {
  await mockDelay(1000);

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

  games[gameIndex].status = "published";
  games[gameIndex].publishedAt = new Date().toISOString();
  games[gameIndex].updatedAt = new Date().toISOString();

  storage.set(STORAGE_KEY, games);

  return createMockResponse(games[gameIndex], "Game published successfully");
}
