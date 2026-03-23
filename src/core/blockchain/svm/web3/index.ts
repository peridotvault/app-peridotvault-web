import { clusterApiUrl, Connection } from "@solana/web3.js";
import { DEFAULT_CHAIN_KEY } from "@/shared/constants/chain";
import { useChainStore } from "@/shared/states/chain.store";
import type { ChainKey, SvmChainKey } from "@/shared/types/chain";

const SVM_RPC_URLS: Record<SvmChainKey, string> = {
  "solana-mainnet":
    process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL ??
    clusterApiUrl("mainnet-beta"),
  "solana-testnet":
    process.env.NEXT_PUBLIC_SOLANA_TESTNET_RPC_URL ??
    process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL ??
    clusterApiUrl("devnet"),
};

export function getSvmChainKey(chainKey?: ChainKey): SvmChainKey {
  const selected = chainKey ?? useChainStore.getState().chainKey ?? DEFAULT_CHAIN_KEY;

  if (selected === "solana-mainnet" || selected === "solana-testnet") {
    return selected;
  }

  throw new Error(`SVM_UNSUPPORTED_CHAIN:${selected}`);
}

export function getSvmRpcUrl(chainKey?: ChainKey) {
  const resolvedKey = getSvmChainKey(chainKey);
  return SVM_RPC_URLS[resolvedKey];
}

export function getSvmConnection(chainKey?: ChainKey) {
  return new Connection(getSvmRpcUrl(chainKey), "confirmed");
}
