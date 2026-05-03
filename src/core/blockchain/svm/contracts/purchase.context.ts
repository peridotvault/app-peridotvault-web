import { Connection, PublicKey } from "@solana/web3.js";
import type { BuyGameInput } from "@/core/blockchain/__core__/types/purchase.type";
import {
  decodeGameAccount,
  decodeGamePaymentOption,
  decodeGameStoreConfig,
  decodeRegistryGameAccount,
  decodeStoreConfig,
  type SvmGameAccount,
  type SvmGamePaymentOption,
  type SvmGameStoreConfig,
  type SvmRegistryGame,
  type SvmStoreConfig,
} from "./account.state";
import {
  findAssociatedTokenAddress,
  findPgcLicenseAccountPda,
  findPurchaseReceiptPda,
  findGamePaymentOptionPda,
  findGameStoreConfigPda,
  findGlobalStoreConfigPda,
  findAcceptedPaymentTokenPda,
  findRegistryGamePda,
  findAuthorizedActorPda,
  findAuthorizedRegistryProgramPda,
  findAuthorizedSourceProgramPda,
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
  acceptedPaymentToken?: PublicKey;
  gamePaymentOption?: PublicKey;
  buyerPaymentAccount?: PublicKey;
  publisherPaymentAccount?: PublicKey;
  treasuryPaymentAccount?: PublicKey;
  referrerPaymentAccount?: PublicKey;
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
  gameStoreCfg: SvmGameStoreConfig;
  game: SvmGameAccount;
  gamePaymentOption?: SvmGamePaymentOption;
  registryGame: SvmRegistryGame;
};

export async function getSvmBuyGameContext(params: {
  connection: Connection;
  programId: PublicKey;
  input: BuyGameInput;
  buyer?: PublicKey;
}): Promise<SvmBuyGameContext> {
  const pgl1Address = params.input.pgl1_address?.trim();
  if (!pgl1Address) {
    throw new Error("Missing pgl1_address for Solana purchase");
  }

  const pgcProgramId = getSvmPgcProgramId();
  const registryProgramId = getSvmRegistryProgramId();

  const buyer = params.buyer || PublicKey.default;
  const gamePda = new PublicKey(pgl1Address);

  // 1. Fetch Registry Game — PDA: ["registry_game", gamePda]
  const registryGamePda = findRegistryGamePda(registryProgramId, gamePda);
  const registryInfo = await params.connection.getAccountInfo(registryGamePda);
  if (!registryInfo) throw new Error(`Game not found in Registry at address ${registryGamePda.toBase58()}`);
  const registryGame = decodeRegistryGameAccount(registryInfo.data);

  // 2. Fetch Game Account from PGC program
  const gameInfo = await params.connection.getAccountInfo(gamePda);
  if (!gameInfo) throw new Error("PGC game account not found");
  const game = decodeGameAccount(gameInfo.data);

  // 3. Fetch Global Store Config — PDA: ["store_config"]
  const globalStoreConfigPda = findGlobalStoreConfigPda(params.programId);
  const globalStoreInfo = await params.connection.getAccountInfo(globalStoreConfigPda);
  if (!globalStoreInfo) throw new Error("Global store config not found");
  const store = decodeStoreConfig(globalStoreInfo.data);

  // 4. Fetch Game Store Config (per-game) — PDA: ["game_store_config", gamePda]
  const gameStoreConfigPda = findGameStoreConfigPda(params.programId, gamePda);
  const gameStoreCfgInfo = await params.connection.getAccountInfo(gameStoreConfigPda);
  if (!gameStoreCfgInfo) throw new Error("Game store config not found");
  const gameStoreCfg = decodeGameStoreConfig(gameStoreCfgInfo.data);

  // 5. Get payment mint from input — null for free games
  const paymentMint = params.input.payment_token
    ? new PublicKey(params.input.payment_token)
    : null;

  // 6. Fetch Game Payment Option — PDA: ["game_payment_option", gamePda, paymentMint]
  let gamePaymentOptionPda: PublicKey | undefined;
  let paymentOptionInfo = null;
  let isFreeGame = true;

  if (paymentMint) {
    gamePaymentOptionPda = findGamePaymentOptionPda(params.programId, gamePda, paymentMint);
    paymentOptionInfo = await params.connection.getAccountInfo(gamePaymentOptionPda);
    isFreeGame = !paymentOptionInfo;
  }

  const gamePaymentOption = paymentOptionInfo ? decodeGamePaymentOption(paymentOptionInfo.data) : undefined;

  // 7. Accepted Payment Token — PDA: ["accepted_payment_token", paymentMint]
  const acceptedPaymentTokenPda = paymentMint
    ? findAcceptedPaymentTokenPda(params.programId, paymentMint)
    : undefined;

  // 8. Derive payment accounts — only for paid games
  // For free games, these are null (program skips payment validation)
  const publisher = game.publisher;

  const buyerPaymentAccount = paymentMint
    ? findAssociatedTokenAddress(buyer, paymentMint, TOKEN_PROGRAM_ID)
    : undefined;

  const publisherPaymentAccount = paymentMint
    ? findAssociatedTokenAddress(publisher, paymentMint, TOKEN_PROGRAM_ID)
    : undefined;

  const treasuryPaymentAccount = paymentMint
    ? findAssociatedTokenAddress(store.treasury, paymentMint, TOKEN_PROGRAM_ID)
    : undefined;

  // 9. Derive authorized actor and program PDAs
  // store_actor is stored in store_config (set during initialize_store). 
  // It's a PDA of game_store that the program uses to sign CPI calls to PGL1.
  // Read it from on-chain store config.
  const storeActor = store.storeActor;
  const authorizedActor = findAuthorizedActorPda(pgcProgramId, storeActor);
  const authorizedSourceProgram = findAuthorizedSourceProgramPda(params.programId, pgcProgramId);
  const authorizedRegistryProgram = findAuthorizedRegistryProgramPda(params.programId, registryProgramId);

  // 10. Derive license and purchase receipt PDAs
  const license = findPgcLicenseAccountPda(pgcProgramId, buyer, gamePda);
  const purchaseReceipt = findPurchaseReceiptPda(params.programId, buyer, gamePda);

  return {
    accounts: {
      buyer: params.buyer,
      storeConfig: globalStoreConfigPda,
      authorizedSourceProgram,
      sourceProgram: pgcProgramId,
      authorizedRegistryProgram,
      registryProgram: registryProgramId,
      game: gamePda,
      registryGame: registryGamePda,
      gameStoreConfig: gameStoreConfigPda,
      paymentMint: paymentMint ?? PublicKey.default,
      acceptedPaymentToken: acceptedPaymentTokenPda,
      gamePaymentOption: gamePaymentOptionPda,
      buyerPaymentAccount,
      publisherPaymentAccount,
      treasuryPaymentAccount,
      storeActor,
      authorizedActor,
      pgl1Program: pgcProgramId,
      license,
      purchaseReceipt,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SYSTEM_PROGRAM_ID,
    },
    store,
    gameStoreCfg,
    game,
    gamePaymentOption,
    registryGame,
  };
}
