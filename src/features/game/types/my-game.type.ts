import { GameDetailApi } from "@/core/api/game.api.type";

export type MyGameItem = Pick<
  GameDetailApi,
  | "game_id"
  | "name"
  | "description"
  | "cover_vertical_image"
  | "cover_horizontal_image"
  | "release_date"
  | "website_url"
  | "distributions"
> & {
  active: boolean;
  pgc1_address: string;
  publisher: string;
  created_at: bigint;
  metadata_uri: string | null;
};
