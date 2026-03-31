import { PublicKey } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, NATIVE_SOL_MINT } from "./program.constants";

export function findStoreStatePda(programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    programId,
  )[0];
}

export function findPriceAccountPda(programId: PublicKey, gamePda: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("price"), gamePda.toBuffer()],
    programId,
  )[0];
}

export function findPublisherBalancePda(
  programId: PublicKey,
  publisher: PublicKey,
  mint: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("balance"), publisher.toBuffer(), mint.toBuffer()],
    programId,
  )[0];
}

export function findRegistryConfigPda(registryProgramId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    registryProgramId,
  )[0];
}

/**
 * Registry uses an individual account model for games.
 */
export function findRegistryGamePda(registryProgramId: PublicKey, gameId: string) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("game"), Buffer.from(gameId)],
    registryProgramId,
  )[0];
}

export function findPgcConfigPda(pgcProgramId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    pgcProgramId,
  )[0];
}

export function findPgcGameAccountPda(pgcProgramId: PublicKey, gameId: string) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("game"), Buffer.from(gameId)],
    pgcProgramId,
  )[0];
}

export function findPgcMinterAccountPda(
  pgcProgramId: PublicKey,
  gamePda: PublicKey,
  minter: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("minter_auth"), gamePda.toBuffer(), minter.toBuffer()],
    pgcProgramId,
  )[0];
}

export function findPgcLicenseAccountPda(
  pgcProgramId: PublicKey,
  buyer: PublicKey,
  gamePda: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("license"), buyer.toBuffer(), gamePda.toBuffer()],
    pgcProgramId,
  )[0];
}

export function findPgcGameAuthorityPda(pgcProgramId: PublicKey, gamePda: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("game_authority"), gamePda.toBuffer()],
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
