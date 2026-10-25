export type NativeTokenInfo = {
  symbol: string;
  decimals: number;
  logo: string;
  name: string;
};

export function resolveNativeTokenInfo(caip2Id?: string | null): NativeTokenInfo {
  const normalized = caip2Id?.toLowerCase() ?? "";

  if (normalized.includes("solana") || normalized.includes("5eykt4usfvxuy2ai9rwtrban1b6badn")) {
    return {
      symbol: "SOL",
      decimals: 9,
      logo: "/images/chains/solana.svg",
      name: "solana",
    };
  }

  if (normalized.includes("eip155")) {
    if (normalized.includes("8453")) {
      return {
        symbol: "ETH",
        decimals: 18,
        logo: "/images/chains/base.svg",
        name: "base",
      };
    }
    return {
      symbol: "ETH",
      decimals: 18,
      logo: "/images/chains/ethereum.svg",
      name: "ethereum",
    };
  }

  return {
    symbol: "SOL",
    decimals: 9,
    logo: "/images/chains/solana.svg",
    name: "solana",
  };
}

const EVM_ZERO = "0x0000000000000000000000000000000000000000";

export { EVM_ZERO };

export interface TokenDeploymentInfo {
  symbol: string;
  name: string;
  decimals: number;
  logoUrl: string | null;
}

export interface GameOnChainPublishLike {
  caip_2_id?: string;
  payment_token: string;
}

export function resolveGamePaymentToken(
  publishes: GameOnChainPublishLike[] | undefined,
  chainCaip2Id?: string,
  tokenLookup?: Map<string, { symbol: string; decimals: number }>,
): NativeTokenInfo {
  const publish = publishes?.[0];
  if (!publish) {
    return resolveNativeTokenInfo(chainCaip2Id);
  }

  const paymentToken = publish.payment_token?.toLowerCase() ?? "";
  const isNative =
    !paymentToken ||
    paymentToken === "native" ||
    paymentToken === EVM_ZERO ||
    paymentToken === "11111111111111111111111111111111";

  if (isNative) {
    return resolveNativeTokenInfo(publish.caip_2_id ?? chainCaip2Id);
  }

  if (tokenLookup) {
    const match = tokenLookup.get(paymentToken);
    if (match) {
      return {
        symbol: match.symbol,
        decimals: match.decimals,
        logo: "",
        name: match.symbol.toLowerCase(),
      };
    }
  }

  return {
    symbol: paymentToken.length > 12
      ? `${paymentToken.slice(0, 4)}...${paymentToken.slice(-4)}`
      : paymentToken.toUpperCase(),
    logo: "",
    name: "unknown",
    decimals: 9,
  };
}
