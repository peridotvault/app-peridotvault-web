import { PublicKey } from "@solana/web3.js";
import gameStoreIdl from "../idl/game_store.json";
import pgl1Idl from "../idl/pgl1.json";
import registryIdl from "../idl/registry.json";
import { BorshReader, stripAccountDiscriminator } from "../codecs/borsh";

export type SvmGamePaymentOption = {
  game: PublicKey;
  mint: PublicKey;
  basePrice: bigint;
  active: boolean;
  bump: number;
};

export type SvmStoreConfig = {
  authority: PublicKey;
  treasury: PublicKey;
  platformFeeBps: number;
  defaultReferralBps: number;
  maxReferralBps: number;
  storeActor: PublicKey;
  bump: number;
};

export type SvmGameStoreConfig = {
  game: PublicKey;
  active: boolean;
  referralBps: number | null;
  discountBps: number | null;
  discountStartsAt: bigint | null;
  discountExpiresAt: bigint | null;
  bump: number;
};

export type SvmRegistrationFeeOption = {
  paymentMethod: PublicKey;
  amount: bigint;
};

export type SvmRegistryGame = {
  game: PublicKey;
  gameId: string;
  registeredAt: bigint;
  status: number;
  bump: number;
};

export type SvmGameAccount = {
  creator: PublicKey;
  nonce: bigint;
  publisher: PublicKey;
  gameId: string;
  metadataUri: string;
  createdAt: bigint;
  bump: number;
};

export type SvmLicenseAccount = {
  holder: PublicKey;
  game: PublicKey;
  issuedAt: bigint;
  expiresAt: bigint | null;
  bump: number;
};

export type SvmPurchaseReceipt = {
  buyer: PublicKey;
  game: PublicKey;
  paymentMint: PublicKey;
  paidAmount: bigint;
  finalPrice: bigint;
  referrer: PublicKey;
  referralBpsApplied: number;
  purchasedAt: bigint;
  bump: number;
};

function getAccountDiscriminator(idl: { accounts?: Array<{ name: string; discriminator: number[] }> }, name: string) {
  const account = idl.accounts?.find((item) => item.name === name);

  if (!account) {
    throw new Error(`Missing IDL account discriminator for ${name}`);
  }

  return account.discriminator;
}

function readOptionU16(reader: BorshReader): number | null {
  return reader.readBool() ? reader.readU16() : null;
}

function readOptionI64(reader: BorshReader): bigint | null {
  return reader.readBool() ? reader.readI64() : null;
}

export function decodeGamePaymentOption(data: Uint8Array): SvmGamePaymentOption {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(gameStoreIdl, "GamePaymentOption"),
    "GamePaymentOption",
  );
  const reader = new BorshReader(bytes);

  return {
    game: reader.readPublicKey(),
    mint: reader.readPublicKey(),
    basePrice: reader.readU64(),
    active: reader.readBool(),
    bump: reader.readU8(),
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
    authority: reader.readPublicKey(),
    treasury: reader.readPublicKey(),
    platformFeeBps: reader.readU16(),
    defaultReferralBps: reader.readU16(),
    maxReferralBps: reader.readU16(),
    storeActor: reader.readPublicKey(),
    bump: reader.readU8(),
  };
}

export function decodeGameStoreConfig(data: Uint8Array): SvmGameStoreConfig {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(gameStoreIdl, "GameStoreConfig"),
    "GameStoreConfig",
  );
  const reader = new BorshReader(bytes);

  return {
    game: reader.readPublicKey(),
    active: reader.readBool(),
    referralBps: readOptionU16(reader),
    discountBps: readOptionU16(reader),
    discountStartsAt: readOptionI64(reader),
    discountExpiresAt: readOptionI64(reader),
    bump: reader.readU8(),
  };
}

export function decodeRegistryGameAccount(data: Uint8Array): SvmRegistryGame {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(registryIdl, "RegistryGame"),
    "RegistryGame",
  );
  const reader = new BorshReader(bytes);

  return {
    game: reader.readPublicKey(),
    gameId: reader.readString(),
    registeredAt: reader.readI64(),
    status: reader.readU8(),
    bump: reader.readU8(),
  };
}

export function decodeGameAccount(data: Uint8Array): SvmGameAccount {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(pgl1Idl, "Game"),
    "Game",
  );
  const reader = new BorshReader(bytes);

  return {
    creator: reader.readPublicKey(),
    nonce: reader.readU64(),
    publisher: reader.readPublicKey(),
    gameId: reader.readString(),
    metadataUri: reader.readString(),
    createdAt: reader.readI64(),
    bump: reader.readU8(),
  };
}

export function decodeLicenseAccount(data: Uint8Array): SvmLicenseAccount {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(pgl1Idl, "License"),
    "License",
  );
  const reader = new BorshReader(bytes);

  return {
    holder: reader.readPublicKey(),
    game: reader.readPublicKey(),
    issuedAt: reader.readI64(),
    expiresAt: readOptionI64(reader),
    bump: reader.readU8(),
  };
}

export function decodePurchaseReceipt(data: Uint8Array): SvmPurchaseReceipt {
  const bytes = stripAccountDiscriminator(
    data,
    getAccountDiscriminator(gameStoreIdl, "PurchaseReceipt"),
    "PurchaseReceipt",
  );
  const reader = new BorshReader(bytes);

  return {
    buyer: reader.readPublicKey(),
    game: reader.readPublicKey(),
    paymentMint: reader.readPublicKey(),
    paidAmount: reader.readU64(),
    finalPrice: reader.readU64(),
    referrer: reader.readPublicKey(),
    referralBpsApplied: reader.readU16(),
    purchasedAt: reader.readI64(),
    bump: reader.readU8(),
  };
}
