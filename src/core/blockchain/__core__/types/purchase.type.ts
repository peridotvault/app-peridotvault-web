import { ChainKey } from "@/shared/types/chain";

export interface BuyGameInput {
  game_id: string;
  pgc1_address: string;
  payment_token: string;
  chainKey?: ChainKey;
}
