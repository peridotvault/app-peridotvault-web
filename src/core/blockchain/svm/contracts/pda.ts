import { PublicKey } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, NATIVE_SOL_MINT } from "./program.constants";

export function findGlobalStoreConfigPda(programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("store_config")],
    programId,
  )[0];
}

export function findGameStoreConfigPda(programId: PublicKey, gamePda: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("game_store_config"), gamePda.toBuffer()],
    programId,
  )[0];
}

export function findAcceptedPaymentTokenPda(
  programId: PublicKey,
  paymentMint: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("accepted_payment_token"), paymentMint.toBuffer()],
    programId,
  )[0];
}

export function findGamePaymentOptionPda(
  programId: PublicKey,
  gamePda: PublicKey,
  paymentMint: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("game_payment_option"), gamePda.toBuffer(), paymentMint.toBuffer()],
    programId,
  )[0];
}

export function findPublisherPaymentAccountPda(
  programId: PublicKey,
  publisher: PublicKey,
  paymentMint: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("publisher_payment_account"), publisher.toBuffer(), paymentMint.toBuffer()],
    programId,
  )[0];
}

export function findTreasuryPaymentAccountPda(
  programId: PublicKey,
  treasury: PublicKey,
  paymentMint: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("treasury_payment_account"), treasury.toBuffer(), paymentMint.toBuffer()],
    programId,
  )[0];
}

export function findAuthorizedSourceProgramPda(
  programId: PublicKey,
  sourceProgram: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("authorized_program"), sourceProgram.toBuffer()],
    programId,
  )[0];
}

export function findAuthorizedRegistryProgramPda(
  programId: PublicKey,
  registryProgram: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("authorized_program"), registryProgram.toBuffer()],
    programId,
  )[0];
}

export function findStoreActorPda(programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("store_actor")],
    programId,
  )[0];
}

export function findAuthorizedActorPda(
  pgcProgramId: PublicKey,
  actor: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("authorized_actor"), actor.toBuffer()],
    pgcProgramId,
  )[0];
}

export function findPurchaseReceiptPda(
  programId: PublicKey,
  buyer: PublicKey,
  gamePda: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("purchase_receipt"), buyer.toBuffer(), gamePda.toBuffer()],
    programId,
  )[0];
}

export function findRegistryConfigPda(registryProgramId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("registry_config")],
    registryProgramId,
  )[0];
}

export function findRegistryGamePda(registryProgramId: PublicKey, gamePda: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("registry_game"), gamePda.toBuffer()],
    registryProgramId,
  )[0];
}

export function findPglConfigPda(pgcProgramId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("pgl_config")],
    pgcProgramId,
  )[0];
}

export function findPgcGameAccountPdaFromCreator(
  pgcProgramId: PublicKey,
  creator: PublicKey,
  nonce: bigint,
) {
  const nonceBuf = Buffer.alloc(8);
  nonceBuf.writeBigUInt64LE(nonce);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("game"), creator.toBuffer(), nonceBuf],
    pgcProgramId,
  )[0];
}

export function findPgcLicenseAccountPda(
  pgcProgramId: PublicKey,
  holder: PublicKey,
  gamePda: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("license"), holder.toBuffer(), gamePda.toBuffer()],
    pgcProgramId,
  )[0];
}

export function findAssociatedTokenAddress(
  owner: PublicKey,
  mint: PublicKey,
  tokenProgramId: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), tokenProgramId.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )[0];
}

export function isNativeSolPaymentMint(mint: PublicKey) {
  return mint.toBase58() === NATIVE_SOL_MINT.toBase58();
}
