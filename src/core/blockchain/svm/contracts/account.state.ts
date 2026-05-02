import { PublicKey } from "@solana/web3.js";
import gameStoreIdl from "../idl/game_store.json";
import pgl1Idl from "../idl/pgl1.json";
import registryIdl from "../idl/registry.json";
import { BorshReader, stripAccountDiscriminator } from "../codecs/borsh";

export type SvmGamePaymentOption = {
  bump: number;
  game: PublicKey;
  paymentMint: PublicKey;
  price: bigint;
  discountBps: number;
  active: boolean;
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

export type SvmGameAccount = {
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

export type SvmPurchaseReceipt = {
  bump: number;
  buyer: PublicKey;
  game: PublicKey;
  purchasedAt: bigint;
  expiresAt: bigint;
  price: bigint;
  paymentMint: PublicKey;
};

function getAccountDiscriminator(idl: { accounts?: Array<{ name: string; discriminator: number[] }> }, name: string) {
  const account = idl.accounts?.find((item) => item.name === name);

  if (!account) {
    throw new Error(`Missing IDL account discriminator for ${name}`);
  }

  return account.discriminator;
}

export function decodeGamePaymentOption(data: Uint8Array): SvmGamePaymentOption {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(gameStoreIdl, "gamePaymentOption"),
    "gamePaymentOption",
  );
  const reader = new BorshReader(bytes);

  return {
    bump: reader.readU8(),
    game: reader.readPublicKey(),
    paymentMint: reader.readPublicKey(),
    price: reader.readU64(),
    discountBps: reader.readU16(),
    active: reader.readBool(),
  };
}

export function decodeStoreConfig(data: Uint8Array): SvmStoreConfig {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(gameStoreIdl, "storeConfig"),
    "storeConfig",
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
    getAccountDiscriminator(registryIdl, "registryGame"),
    "registryGame",
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

export function decodeGameAccount(data: Uint8Array): SvmGameAccount {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(pgl1Idl, "game"),
    "game",
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
    getAccountDiscriminator(pgl1Idl, "license"),
    "license",
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

export function decodePurchaseReceipt(data: Uint8Array): SvmPurchaseReceipt {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(gameStoreIdl, "purchaseReceipt"),
    "purchaseReceipt",
  );
  const reader = new BorshReader(bytes);

  return {
    bump: reader.readU8(),
    buyer: reader.readPublicKey(),
    game: reader.readPublicKey(),
    purchasedAt: reader.readI64(),
    expiresAt: reader.readI64(),
    price: reader.readU64(),
    paymentMint: reader.readPublicKey(),
  };
}
