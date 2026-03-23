import { Connection, PublicKey } from "@solana/web3.js";
import type { BuyGameInput } from "@/core/blockchain/__core__/types/purchase.type";
import {
  decodePgcGameState,
  decodeRegistryState,
  decodeStoreState,
} from "./account.state";
import {
  findAssociatedTokenAddress,
  findPgcGameAuthorityPda,
  findPgcLicenseAccountPda,
  findPgcMinterAuthorityPda,
  findStoreStatePda,
  isNativeSolPaymentMint,
} from "./pda";
import { TOKEN_2022_PROGRAM_ID } from "./program.constants";
import { getSvmPgcProgramId } from "./program.registry";

export type SvmBuyGameAccounts = {
  buyer: PublicKey;
  storeState: PublicKey;
  registryState: PublicKey;
  pgcProgram: PublicKey;
  pgcGameState: PublicKey;
  gameAuthority: PublicKey;
  storeMinterAuth: PublicKey;
  licenseAccount: PublicKey;
  userGameTokenAccount: PublicKey;
  gameMint: PublicKey;
  treasury: PublicKey;
  paymentMint: PublicKey;
  buyerPaymentTokenAccount: PublicKey;
  treasuryTokenAccount: PublicKey;
  storeVaultTokenAccount: PublicKey;
  paymentTokenProgram: PublicKey;
};

export type SvmBuyGameContext = {
  gameId: string;
  accounts: SvmBuyGameAccounts;
};

function parsePublicKey(value: string, label: string) {
  try {
    return new PublicKey(value);
  } catch {
    throw new Error(`Invalid Solana ${label}: ${value}`);
  }
}

export async function getSvmBuyGameContext(params: {
  buyer: PublicKey;
  connection: Connection;
  programId: PublicKey;
  input: BuyGameInput;
}) {
  const gameId = params.input.game_id?.trim();
  if (!gameId) {
    throw new Error("Missing game_id for Solana purchase");
  }

  const pgcGameState = parsePublicKey(params.input.pgc1_address, "game state");
  const paymentMint = parsePublicKey(params.input.payment_token, "payment mint");

  if (isNativeSolPaymentMint(paymentMint)) {
    throw new Error("Native SOL purchases are not configured in this client yet");
  }

  const storeState = findStoreStatePda(params.programId);
  const [storeStateAccount, pgcGameStateAccount, paymentMintAccount] =
    await params.connection.getMultipleAccountsInfo([
      storeState,
      pgcGameState,
      paymentMint,
    ]);

  if (!storeStateAccount) {
    throw new Error("Store state account not found");
  }
  if (!pgcGameStateAccount) {
    throw new Error("Selected PGC game state account not found");
  }
  if (!paymentMintAccount) {
    throw new Error("Selected payment mint account not found");
  }

  const store = decodeStoreState(storeStateAccount.data);
  const pgcGame = decodePgcGameState(pgcGameStateAccount.data);

  if (pgcGame.gameId !== gameId) {
    throw new Error("Selected game does not match the on-chain PGC game state");
  }

  const registryState = store.registry;
  const registryStateAccount = await params.connection.getAccountInfo(registryState);

  if (!registryStateAccount) {
    throw new Error("Registry state account not found");
  }

  const registry = decodeRegistryState(registryStateAccount.data);
  const registryGame = registry.games.find((item) => item.gameId === gameId);

  if (!registryGame) {
    throw new Error("Game not registered in Solana registry");
  }

  if (!registryGame.contractAddress.equals(pgcGameState)) {
    throw new Error("Selected game state does not match registry data");
  }

  const priceConfig = store.prices.find(
    (item) => item.gameId === gameId && item.currency.equals(paymentMint),
  );

  if (!priceConfig) {
    throw new Error("Selected payment mint is not configured for this game");
  }

  const pgcProgram = getSvmPgcProgramId();
  const paymentTokenProgram = paymentMintAccount.owner;
  const licenseAccount = findPgcLicenseAccountPda(
    pgcProgram,
    pgcGameState,
    params.buyer,
  );
  const existingLicense = await params.connection.getAccountInfo(licenseAccount);

  if (existingLicense) {
    throw new Error("Game already owned");
  }

  return {
    gameId,
    accounts: {
      buyer: params.buyer,
      storeState,
      registryState,
      pgcProgram,
      pgcGameState,
      gameAuthority: findPgcGameAuthorityPda(pgcProgram, pgcGameState),
      storeMinterAuth: findPgcMinterAuthorityPda(
        pgcProgram,
        pgcGameState,
        storeState,
      ),
      licenseAccount,
      userGameTokenAccount: findAssociatedTokenAddress(
        params.buyer,
        pgcGame.mint,
        TOKEN_2022_PROGRAM_ID,
      ),
      gameMint: pgcGame.mint,
      treasury: store.treasury,
      paymentMint,
      buyerPaymentTokenAccount: findAssociatedTokenAddress(
        params.buyer,
        paymentMint,
        paymentTokenProgram,
      ),
      treasuryTokenAccount: findAssociatedTokenAddress(
        store.treasury,
        paymentMint,
        paymentTokenProgram,
      ),
      storeVaultTokenAccount: findAssociatedTokenAddress(
        storeState,
        paymentMint,
        paymentTokenProgram,
      ),
      paymentTokenProgram,
    },
  } satisfies SvmBuyGameContext;
}
