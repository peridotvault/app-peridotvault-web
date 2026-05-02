import { PublicKey } from "@solana/web3.js";
import type { ChainKey, SvmChainKey } from "@/shared/types/chain";
import { getSvmChainKey } from "../web3";
import gameStoreIdl from "../idl/game_store.json";
import pgl1Idl from "../idl/pgl1.json";
import registryIdl from "../idl/registry.json";

const SVM_PROGRAM_IDS: Record<SvmChainKey, string> = {
  "solana-mainnet":
    process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID_MAINNET ?? gameStoreIdl.address,
  "solana-devnet":
    process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID_DEVNET ??
    process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID_TESTNET ??
    gameStoreIdl.address,
};

export function getSvmProgramId(chainKey?: ChainKey) {
  const resolvedKey = getSvmChainKey(chainKey);
  const programId = SVM_PROGRAM_IDS[resolvedKey];

  if (!programId) {
    throw new Error(`SVM_PROGRAM_NOT_CONFIGURED:${resolvedKey}`);
  }

  return new PublicKey(programId);
}

export function getSvmRegistryProgramId() {
  return new PublicKey(registryIdl.address);
}

export function getSvmPgcProgramId() {
  return new PublicKey(pgl1Idl.address);
}
