import { Connection, PublicKey } from "@solana/web3.js";
import type { BuyGameInput } from "@/core/blockchain/__core__/types/purchase.type";
import {
  decodePgcGameAccount,
  decodePriceAccount,
  decodeRegistryGameAccount,
  decodeStoreConfig,
  type SvmPgcGameAccount,
  type SvmPriceAccount,
  type SvmRegistryGame,
  type SvmStoreConfig,
} from "./account.state";
import {
  findAssociatedTokenAddress,
  findPgcConfigPda,
  findPgcLicenseAccountPda,
  findPriceAccountPda,
  findPublisherBalancePda,
  findRegistryGamePda,
  findStoreStatePda,
  isNativeSolPaymentMint,
} from "./pda";
import {
  SYSTEM_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "./program.constants";
import { getSvmRegistryProgramId, getSvmPgcProgramId } from "./program.registry";

export type SvmBuyGameAccounts = {
  buyer?: PublicKey;
  storeState: PublicKey;
  treasury: PublicKey;
  registryGame: PublicKey;
  priceAccount: PublicKey;
  publisher: PublicKey;
  publisherBalance: PublicKey;
  pgcProgram: PublicKey;
  pgcConfig: PublicKey;
  licensePda: PublicKey;
  tokenProgram: PublicKey;
  buyerTokenAccount: PublicKey;
  treasuryTokenAccount: PublicKey;
  publisherTokenAccount: PublicKey;
  systemProgram: PublicKey;
};

export type SvmBuyGameContext = {
  accounts: SvmBuyGameAccounts;
  store: SvmStoreConfig;
  pgc: SvmPgcGameAccount;
  price: SvmPriceAccount;
  game: SvmRegistryGame;
};

export async function getSvmBuyGameContext(params: {
  connection: Connection;
  programId: PublicKey;
  input: BuyGameInput;
  buyer?: PublicKey;
}): Promise<SvmBuyGameContext> {
  const gameId = params.input.game_id?.trim();
  if (!gameId) {
    throw new Error("Missing game_id for Solana purchase");
  }

  const pgcProgramId = getSvmPgcProgramId();
  const registryProgramId = getSvmRegistryProgramId();

  // 1. Initial lookup PDAs
  const storeStatePda = findStoreStatePda(params.programId);
  const registryGamePda = findRegistryGamePda(registryProgramId, gameId);
  
  // 2. Fetch Registry Account (Individual PDA in this program version)
  const registryInfo = await params.connection.getAccountInfo(registryGamePda);
  if (!registryInfo) throw new Error(`Game ${gameId} not found in Registry at address ${registryGamePda.toBase58()}`);
  const game = decodeRegistryGameAccount(registryInfo.data);

  // 3. Source of Truth Addresses (PGC PDA is obtained from the registry game entry)
  const pgcGameStatePda = game.pgcPda;
  const pgcConfigPda = findPgcConfigPda(pgcProgramId);
  
  // CRITICAL FIX: Price account is derived using PGC Game PDA, not Registry PDA
  const priceAccountPda = findPriceAccountPda(params.programId, pgcGameStatePda);

  // 4. Batch fetch core states
  const [storeInfo, pgcInfo, priceInfo] = await params.connection.getMultipleAccountsInfo([
    storeStatePda,
    pgcGameStatePda,
    priceAccountPda,
  ]);

  if (!storeInfo) throw new Error("Store config not found");
  if (!pgcInfo) throw new Error("PGC game account not found");
  if (!priceInfo) throw new Error(`Price account not found for this game at ${priceAccountPda.toBase58()}`);

  const store = decodeStoreConfig(storeInfo.data);
  const pgc = decodePgcGameAccount(pgcInfo.data);
  const price = decodePriceAccount(priceInfo.data);

  // 5. Final Derivations
  const buyer = params.buyer || PublicKey.default;
  const paymentMint = price.currency;
  const isSol = isNativeSolPaymentMint(paymentMint);

  const publisher = game.publisher;
  const publisherBalancePda = findPublisherBalancePda(params.programId, publisher, paymentMint);
  const licensePda = findPgcLicenseAccountPda(pgcProgramId, buyer, pgcGameStatePda);
  
  // Associated Token Accounts (AATAs)
  const buyerTokenAccount = isSol ? publisherBalancePda : findAssociatedTokenAddress(
    buyer,
    paymentMint,
    TOKEN_PROGRAM_ID
  );

  const treasuryTokenAccount = isSol ? publisherBalancePda : findAssociatedTokenAddress(
    store.treasury,
    paymentMint,
    TOKEN_PROGRAM_ID
  );

  const publisherTokenAccount = isSol ? publisherBalancePda : findAssociatedTokenAddress(
    publisher,
    paymentMint,
    TOKEN_PROGRAM_ID
  );

  return {
    accounts: {
      buyer: params.buyer,
      storeState: storeStatePda,
      treasury: store.treasury,
      registryGame: pgcGameStatePda, // The store program expects the PGC Game PDA here
      priceAccount: priceAccountPda,
      publisher,
      publisherBalance: publisherBalancePda,
      pgcProgram: pgcProgramId,
      pgcConfig: pgcConfigPda,
      licensePda,
      tokenProgram: isSol ? SYSTEM_PROGRAM_ID : TOKEN_PROGRAM_ID,
      buyerTokenAccount,
      treasuryTokenAccount,
      publisherTokenAccount,
      systemProgram: SYSTEM_PROGRAM_ID,
    },
    store,
    pgc,
    price,
    game,
  };
}
