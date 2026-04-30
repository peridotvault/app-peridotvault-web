export type NativeTokenInfo = {
  symbol: string;
  decimals: number;
  logo: string;
  name: string;
};

export function resolveNativeTokenInfo(caip2Id?: string | null): NativeTokenInfo {
  const normalized = caip2Id?.toLowerCase() ?? "";

  // Solana
  if (normalized.includes("solana") || normalized.includes("5eykt4usfvxuy2ai9rwtrban1b6badn")) {
    return {
      symbol: "SOL",
      decimals: 9,
      logo: "/images/token/solana.png",
      name: "solana",
    };
  }

  // EVM (Ethereum, Base, Lisk, etc.)
  if (normalized.includes("eip155")) {
    // Base Mainnet: eip155:8453, Base Testnet: eip155:84532
    if (normalized.includes("8453")) {
        return {
            symbol: "ETH",
            decimals: 18,
            logo: "/images/token/base.png", // Assuming this exists
            name: "base",
          };
    }
    
    // Default EVM (Ethereum / Generic)
    return {
      symbol: "ETH",
      decimals: 18,
      logo: "/images/token/eth.png", // Assuming this exists
      name: "ethereum",
    };
  }

  // Fallback (Default to Solana as it's the primary chain for existing games)
  return {
    symbol: "SOL",
    decimals: 9,
    logo: "/images/token/solana.png",
    name: "solana",
  };
}
