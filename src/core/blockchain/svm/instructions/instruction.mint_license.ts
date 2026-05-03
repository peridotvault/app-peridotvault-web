import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import pgl1Idl from "../idl/pgl1.json";

export type BuildSvmMintLicenseParams = {
  programId: PublicKey;
  actor: PublicKey;
  holder: PublicKey;
  authorizedActor: PublicKey;
  game: PublicKey;
  license: PublicKey;
  systemProgram: PublicKey;
};

export function buildSvmMintLicenseInstruction(
  params: BuildSvmMintLicenseParams,
): TransactionInstruction {
  const mintLicense = pgl1Idl.instructions.find(
    (ix) => ix.name === "mint_license",
  );

  if (!mintLicense) {
    throw new Error("mint_license instruction missing from pgl1 IDL");
  }

  const accountKeys: { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[] = [
    { pubkey: params.actor, isSigner: true, isWritable: true },
    { pubkey: params.holder, isSigner: false, isWritable: false },
    { pubkey: params.authorizedActor, isSigner: false, isWritable: false },
    { pubkey: params.game, isSigner: false, isWritable: false },
    { pubkey: params.license, isSigner: false, isWritable: true },
    { pubkey: params.systemProgram, isSigner: false, isWritable: false },
  ];

  // Args: discriminator (8) + expires_at (option<i64> = null => 1 byte 0x00)
  const discriminator = Buffer.from(mintLicense.discriminator);
  const expiresAtBuf = Buffer.from([0]); // None

  return new TransactionInstruction({
    programId: params.programId,
    keys: accountKeys,
    data: Buffer.concat([discriminator, expiresAtBuf]),
  });
}
