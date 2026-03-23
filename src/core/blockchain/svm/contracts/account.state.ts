import { PublicKey } from "@solana/web3.js";
import gameStoreIdl from "../idl/game_store.json";
import pgc1Idl from "../idl/pgc1.json";
import registryIdl from "../idl/registry.json";
import { BorshReader, stripAccountDiscriminator } from "../codecs/borsh";

export type SvmPriceConfig = {
  gameId: string;
  publisher: PublicKey;
  price: bigint;
  currency: PublicKey;
  discountBps: number;
};

export type SvmPublisherBalance = {
  publisher: PublicKey;
  token: PublicKey;
  amount: bigint;
};

export type SvmStoreState = {
  bump: number;
  registry: PublicKey;
  governance: PublicKey;
  treasury: PublicKey;
  platformFeeBps: number;
  prices: SvmPriceConfig[];
  publisherBalances: SvmPublisherBalance[];
};

export type SvmRegistryGame = {
  gameId: string;
  contractAddress: PublicKey;
  status: number;
};

export type SvmRegistryState = {
  bump: number;
  governance: PublicKey;
  treasury: PublicKey;
  factory: PublicKey;
  registrationFeeOptions: {
    paymentMethod: PublicKey;
    amount: bigint;
  }[];
  admins: PublicKey[];
  feeExemptions: PublicKey[];
  games: SvmRegistryGame[];
  allGameIds: string[];
};

export type SvmPgcGameState = {
  bump: number;
  authorityBump: number;
  mint: PublicKey;
  gameId: string;
  publisher: PublicKey;
  metadataUri: string;
};

function getAccountDiscriminator(idl: { accounts?: Array<{ name: string; discriminator: number[] }> }, name: string) {
  const account = idl.accounts?.find((item) => item.name === name);

  if (!account) {
    throw new Error(`Missing IDL account discriminator for ${name}`);
  }

  return account.discriminator;
}

function readPriceConfig(reader: BorshReader): SvmPriceConfig {
  return {
    gameId: reader.readString(),
    publisher: reader.readPublicKey(),
    price: reader.readU64(),
    currency: reader.readPublicKey(),
    discountBps: reader.readU16(),
  };
}

function readPublisherBalance(reader: BorshReader): SvmPublisherBalance {
  return {
    publisher: reader.readPublicKey(),
    token: reader.readPublicKey(),
    amount: reader.readU64(),
  };
}

export function decodeStoreState(data: Uint8Array): SvmStoreState {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(gameStoreIdl, "storeState"),
    "storeState",
  );
  const reader = new BorshReader(bytes);

  return {
    bump: reader.readU8(),
    registry: reader.readPublicKey(),
    governance: reader.readPublicKey(),
    treasury: reader.readPublicKey(),
    platformFeeBps: reader.readU16(),
    prices: reader.readVec(readPriceConfig),
    publisherBalances: reader.readVec(readPublisherBalance),
  };
}

export function decodeRegistryState(data: Uint8Array): SvmRegistryState {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(registryIdl, "registryState"),
    "registryState",
  );
  const reader = new BorshReader(bytes);

  return {
    bump: reader.readU8(),
    governance: reader.readPublicKey(),
    treasury: reader.readPublicKey(),
    factory: reader.readPublicKey(),
    registrationFeeOptions: reader.readVec((itemReader) => ({
      paymentMethod: itemReader.readPublicKey(),
      amount: itemReader.readU64(),
    })),
    admins: reader.readVec((itemReader) => itemReader.readPublicKey()),
    feeExemptions: reader.readVec((itemReader) => itemReader.readPublicKey()),
    games: reader.readVec((itemReader) => ({
      gameId: itemReader.readString(),
      contractAddress: itemReader.readPublicKey(),
      status: itemReader.readU8(),
    })),
    allGameIds: reader.readVec((itemReader) => itemReader.readString()),
  };
}

export function decodePgcGameState(data: Uint8Array): SvmPgcGameState {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(pgc1Idl, "gameState"),
    "pgc gameState",
  );
  const reader = new BorshReader(bytes);

  return {
    bump: reader.readU8(),
    authorityBump: reader.readU8(),
    mint: reader.readPublicKey(),
    gameId: reader.readString(),
    publisher: reader.readPublicKey(),
    metadataUri: reader.readString(),
  };
}
