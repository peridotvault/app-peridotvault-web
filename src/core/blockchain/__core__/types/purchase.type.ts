import { ChainKey } from "@/shared/types/chain";

export interface BuyGameInput {
  game_id: string;
  pgl1_address: string;
  payment_token?: string;
  payment_token_id?: number;
  price?: number;
  chainKey?: ChainKey;
}
