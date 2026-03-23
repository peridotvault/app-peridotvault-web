import { PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_SOL_MINT,
  SYSTEM_PROGRAM_ID,
} from "./program.constants";

export function findStoreStatePda(programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("game_store_state")],
    programId,
  )[0];
}

export function findPgcGameAuthorityPda(
  pgcProgramId: PublicKey,
  gameState: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("game_authority"), gameState.toBuffer()],
    pgcProgramId,
  )[0];
}

export function findPgcMinterAuthorityPda(
  pgcProgramId: PublicKey,
  gameState: PublicKey,
  account: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("minter_auth"), gameState.toBuffer(), account.toBuffer()],
    pgcProgramId,
  )[0];
}

export function findPgcLicenseAccountPda(
  pgcProgramId: PublicKey,
  gameState: PublicKey,
  user: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("license"), gameState.toBuffer(), user.toBuffer()],
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
  const base58 = mint.toBase58();
  return (
    base58 === SYSTEM_PROGRAM_ID.toBase58() ||
    base58 === NATIVE_SOL_MINT.toBase58()
  );
}
