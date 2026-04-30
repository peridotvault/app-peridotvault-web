import { PublicKey } from "@solana/web3.js";
import gameStoreIdl from "../idl/game_store.json";
import pgc1Idl from "../idl/pgc1.json";
import registryIdl from "../idl/registry.json";
import { BorshReader, stripAccountDiscriminator } from "../codecs/borsh";

export type SvmPriceAccount = {
  bump: number;
  game: PublicKey;
  price: bigint;
  currency: PublicKey;
  discountBps: number;
};

export type SvmPublisherBalanceAccount = {
  bump: number;
  publisher: PublicKey;
  token: PublicKey;
  amount: bigint;
};

export type SvmStoreConfig = {
  bump: number;
  treasury: PublicKey;
  governance: PublicKey;
  platformFeeBps: number;
};

export type SvmRegistrationFeeOption = {
  paymentMethod: PublicKey;
  amount: bigint;
};

export type SvmRegistryGame = {
  gameId: string;
  publisher: PublicKey;
  pgcPid: PublicKey;
  pgcPda: PublicKey;
  active: boolean;
  createdAt: bigint;
  bump: number;
};

export type SvmPgcGameAccount = {
  gameId: string;
  publisher: PublicKey;
  metadataUri: string;
  createdAt: bigint;
  bump: number;
};

export type SvmLicenseAccount = {
  owner: PublicKey;
  game: PublicKey;
  issuedAt: bigint;
  expiresAt: bigint;
  bump: number;
};

function getAccountDiscriminator(idl: { accounts?: Array<{ name: string; discriminator: number[] }> }, name: string) {
  const account = idl.accounts?.find((item) => item.name === name);

  if (!account) {
    throw new Error(`Missing IDL account discriminator for ${name}`);
  }

  return account.discriminator;
}

export function decodePriceAccount(data: Uint8Array): SvmPriceAccount {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(gameStoreIdl, "PriceAccount"),
    "PriceAccount",
  );
  const reader = new BorshReader(bytes);

  return {
    bump: reader.readU8(),
    game: reader.readPublicKey(),
    price: reader.readU64(),
    currency: reader.readPublicKey(),
    discountBps: reader.readU16(),
  };
}

export function decodePublisherBalanceAccount(data: Uint8Array): SvmPublisherBalanceAccount {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(gameStoreIdl, "PublisherBalanceAccount"),
    "PublisherBalanceAccount",
  );
  const reader = new BorshReader(bytes);

  return {
    bump: reader.readU8(),
    publisher: reader.readPublicKey(),
    token: reader.readPublicKey(),
    amount: reader.readU64(),
  };
}

export function decodeStoreConfig(data: Uint8Array): SvmStoreConfig {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(gameStoreIdl, "StoreConfig"),
    "StoreConfig",
  );
  const reader = new BorshReader(bytes);

  return {
    bump: reader.readU8(),
    treasury: reader.readPublicKey(),
    governance: reader.readPublicKey(),
    platformFeeBps: reader.readU16(),
  };
}

export function decodeRegistryGameAccount(data: Uint8Array): SvmRegistryGame {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(registryIdl, "RegistryGameAccount"),
    "RegistryGameAccount",
  );
  const reader = new BorshReader(bytes);

  return {
    gameId: reader.readString(),
    publisher: reader.readPublicKey(),
    pgcPid: reader.readPublicKey(),
    pgcPda: reader.readPublicKey(),
    active: reader.readBool(),
    createdAt: reader.readI64(),
    bump: reader.readU8(),
  };
}

export function decodePgcGameAccount(data: Uint8Array): SvmPgcGameAccount {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(pgc1Idl, "PgcGameAccount"),
    "PgcGameAccount",
  );
  const reader = new BorshReader(bytes);

  return {
    gameId: reader.readString(),
    publisher: reader.readPublicKey(),
    metadataUri: reader.readString(),
    createdAt: reader.readI64(),
    bump: reader.readU8(),
  };
}

export function decodeLicenseAccount(data: Uint8Array): SvmLicenseAccount {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(pgc1Idl, "LicenseAccount"),
    "LicenseAccount",
  );
  const reader = new BorshReader(bytes);

  return {
    owner: reader.readPublicKey(),
    game: reader.readPublicKey(),
    issuedAt: reader.readI64(),
    expiresAt: reader.readI64(),
    bump: reader.readU8(),
  };
}
