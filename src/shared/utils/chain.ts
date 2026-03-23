import type { ChainKey } from "../types/chain";

type ChainMetadata = {
  caip2Id?: string | null;
  name?: string | null;
  namespace?: string | null;
  reference?: string | null;
  isTestnet?: boolean | null;
};

export function resolveChainKeyFromMetadata(
  metadata: ChainMetadata,
): ChainKey | null {
  const caip2Id = metadata.caip2Id?.toLowerCase() ?? "";
  const name = metadata.name?.toLowerCase() ?? "";
  const namespace = metadata.namespace?.toLowerCase() ?? "";
  const reference = metadata.reference?.toLowerCase() ?? "";
  const explicitTestnet = metadata.isTestnet === true;

  if (caip2Id.includes("84532")) return "base-testnet";
  if (caip2Id.includes("8453")) return "base-mainnet";
  if (caip2Id.includes("4202")) return "lisk-testnet";
  if (caip2Id.includes("1135")) return "lisk-mainnet";

  const isSolana =
    namespace === "solana" ||
    caip2Id.includes("solana") ||
    name.includes("solana") ||
    reference.includes("solana");
  if (isSolana) {
    const testnet =
      explicitTestnet ||
      caip2Id.includes("devnet") ||
      caip2Id.includes("testnet") ||
      name.includes("devnet") ||
      name.includes("testnet") ||
      reference.includes("devnet") ||
      reference.includes("testnet");

    return testnet ? "solana-testnet" : "solana-mainnet";
  }

  const isBase =
    caip2Id.includes("base") ||
    name.includes("base") ||
    reference.includes("base");
  if (isBase) {
    const testnet =
      explicitTestnet ||
      caip2Id.includes("sepolia") ||
      caip2Id.includes("testnet") ||
      name.includes("sepolia") ||
      name.includes("testnet") ||
      reference.includes("sepolia") ||
      reference.includes("testnet");

    return testnet ? "base-testnet" : "base-mainnet";
  }

  const isLisk =
    caip2Id.includes("lisk") ||
    name.includes("lisk") ||
    reference.includes("lisk");
  if (isLisk) {
    const testnet =
      explicitTestnet ||
      caip2Id.includes("sepolia") ||
      caip2Id.includes("testnet") ||
      name.includes("sepolia") ||
      name.includes("testnet") ||
      reference.includes("sepolia") ||
      reference.includes("testnet");

    return testnet ? "lisk-testnet" : "lisk-mainnet";
  }

  return null;
}
