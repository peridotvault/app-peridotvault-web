export interface WishlistToggleResponse {
  game_id: string;
  is_wishlisted: boolean;
  id: string;
}

export interface WishlistStatusResponse {
  game_id: string;
  is_wishlisted: boolean;
}

export interface WishlistCountResponse {
  game_id: string;
  count: number;
}

export interface WishlistItem {
  id: string;
  game_id: string;
  created_at: string;
}
