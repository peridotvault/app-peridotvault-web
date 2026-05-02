import { Connection, PublicKey } from "@solana/web3.js";
import type { BuyGameInput } from "@/core/blockchain/__core__/types/purchase.type";
import {
  decodeGameAccount,
  decodeGamePaymentOption,
  decodeRegistryGameAccount,
  decodeStoreConfig,
  type SvmGameAccount,
  type SvmGamePaymentOption,
  type SvmRegistryGame,
  type SvmStoreConfig,
} from "./account.state";
import {
  findAssociatedTokenAddress,
  findPgcLicenseAccountPda,
  findPurchaseReceiptPda,
  findGamePaymentOptionPda,
  findPublisherPaymentAccountPda,
  findTreasuryPaymentAccountPda,
  findRegistryGamePda,
  findStoreConfigPda,
  findAuthorizedActorPda,
  findAuthorizedRegistryProgramPda,
  findAuthorizedSourceProgramPda,
  isNativeSolPaymentMint,
} from "./pda";
import {
  SYSTEM_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "./program.constants";
import { getSvmRegistryProgramId, getSvmPgcProgramId } from "./program.registry";

export type SvmBuyGameAccounts = {
  buyer?: PublicKey;
  storeConfig: PublicKey;
  authorizedSourceProgram: PublicKey;
  sourceProgram: PublicKey;
  authorizedRegistryProgram: PublicKey;
  registryProgram: PublicKey;
  game: PublicKey;
  registryGame: PublicKey;
  gameStoreConfig: PublicKey;
  paymentMint: PublicKey;
  acceptedPaymentToken: PublicKey;
  gamePaymentOption: PublicKey;
  buyerPaymentAccount: PublicKey;
  publisherPaymentAccount: PublicKey;
  treasuryPaymentAccount: PublicKey;
  storeActor: PublicKey;
  authorizedActor: PublicKey;
  pgl1Program: PublicKey;
  license: PublicKey;
  purchaseReceipt: PublicKey;
  tokenProgram: PublicKey;
  systemProgram: PublicKey;
};

export type SvmBuyGameContext = {
  accounts: SvmBuyGameAccounts;
  store: SvmStoreConfig;
  game: SvmGameAccount;
  gamePaymentOption: SvmGamePaymentOption;
  registryGame: SvmRegistryGame;
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

  const buyer = params.buyer || PublicKey.default;

  // 1. Fetch Registry Game Account
  const registryGamePda = findRegistryGamePda(registryProgramId, gameId);
  const registryInfo = await params.connection.getAccountInfo(registryGamePda);
  if (!registryInfo) throw new Error(`Game ${gameId} not found in Registry at address ${registryGamePda.toBase58()}`);
  const registryGame = decodeRegistryGameAccount(registryInfo.data);

  // 2. Get PGC Game PDA from registry
  const gamePda = registryGame.pgcPda;

  // 3. Fetch Game Account from PGC program
  const gameInfo = await params.connection.getAccountInfo(gamePda);
  if (!gameInfo) throw new Error("PGC game account not found");
  const game = decodeGameAccount(gameInfo.data);

  // 4. Fetch Store Config (per-game config in new model)
  const storeConfigPda = findStoreConfigPda(params.programId, gamePda);
  const storeInfo = await params.connection.getAccountInfo(storeConfigPda);
  if (!storeInfo) throw new Error("Store config not found");
  const store = decodeStoreConfig(storeInfo.data);

  // 5. Get payment mint from input or default to SOL
  const paymentMint = params.input.payment_token 
    ? new PublicKey(params.input.payment_token)
    : new PublicKey("So11111111111111111111111111111111111111112");

  // 6. Fetch Game Payment Option
  const gamePaymentOptionPda = findGamePaymentOptionPda(params.programId, gamePda, paymentMint);
  const paymentOptionInfo = await params.connection.getAccountInfo(gamePaymentOptionPda);
  if (!paymentOptionInfo) throw new Error(`Game payment option not found for mint ${paymentMint.toBase58()}`);
  const gamePaymentOption = decodeGamePaymentOption(paymentOptionInfo.data);

  // 7. Derive all payment accounts
  const isSol = isNativeSolPaymentMint(paymentMint);
  const publisher = registryGame.publisher;
  
  const buyerPaymentAccount = isSol ? buyer : findAssociatedTokenAddress(
    buyer,
    paymentMint,
    TOKEN_PROGRAM_ID
  );

  const publisherPaymentAccount = findPublisherPaymentAccountPda(params.programId, publisher, paymentMint);
  const treasuryPaymentAccount = findTreasuryPaymentAccountPda(params.programId, store.treasury, paymentMint);

  // 8. Derive authorized actor and program PDAs
  const storeActor = buyer;
  const authorizedActor = findAuthorizedActorPda(pgcProgramId, storeActor);
  const authorizedSourceProgram = findAuthorizedSourceProgramPda(params.programId, pgcProgramId);
  const authorizedRegistryProgram = findAuthorizedRegistryProgramPda(params.programId, registryProgramId);

  // 9. Derive license and purchase receipt PDAs
  const license = findPgcLicenseAccountPda(pgcProgramId, buyer, gamePda);
  const purchaseReceipt = findPurchaseReceiptPda(params.programId, buyer, gamePda);

  return {
    accounts: {
      buyer: params.buyer,
      storeConfig: storeConfigPda,
      authorizedSourceProgram,
      sourceProgram: pgcProgramId,
      authorizedRegistryProgram,
      registryProgram: registryProgramId,
      game: gamePda,
      registryGame: registryGamePda,
      gameStoreConfig: storeConfigPda,
      paymentMint,
      acceptedPaymentToken: gamePaymentOptionPda,
      gamePaymentOption: gamePaymentOptionPda,
      buyerPaymentAccount,
      publisherPaymentAccount,
      treasuryPaymentAccount,
      storeActor,
      authorizedActor,
      pgl1Program: pgcProgramId,
      license,
      purchaseReceipt,
      tokenProgram: isSol ? SYSTEM_PROGRAM_ID : TOKEN_PROGRAM_ID,
      systemProgram: SYSTEM_PROGRAM_ID,
    },
    store,
    game,
    gamePaymentOption,
    registryGame,
  };
}
