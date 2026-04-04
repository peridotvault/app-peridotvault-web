import { clusterApiUrl, Connection } from "@solana/web3.js";
import { DEFAULT_CHAIN_KEY, CHAIN_CONFIGS } from "@/shared/constants/chain";
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
  const selected =
    chainKey ?? useChainStore.getState().chainKey ?? DEFAULT_CHAIN_KEY;

  if (selected === "solana-mainnet" || selected === "solana-testnet") {
    return selected;
  }

  // Fallback: If an EVM chain is selected, use the corresponding Solana chain based on network
  const config = CHAIN_CONFIGS[selected];
  if (config?.network === "mainnet") {
    return "solana-mainnet";
  }

  return "solana-testnet";
}

export function getSvmRpcUrl(chainKey?: ChainKey) {
  const resolvedKey = getSvmChainKey(chainKey);
  return SVM_RPC_URLS[resolvedKey];
}

export function getSvmConnection(chainKey?: ChainKey) {
  return new Connection(getSvmRpcUrl(chainKey), "confirmed");
}
