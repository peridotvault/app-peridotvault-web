import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import gameStoreIdl from "../idl/game_store.json";
import type { SvmBuyGameAccounts } from "../contracts/purchase.context";

export type BuildSvmBuyInstructionParams = {
  programId: PublicKey;
  accounts: SvmBuyGameAccounts;
};

export function buildSvmBuyGameInstruction(
  params: BuildSvmBuyInstructionParams,
): TransactionInstruction {
  const buyGame = gameStoreIdl.instructions.find(
    (instruction) => instruction.name === "buy_game",
  );

  if (!buyGame) {
    throw new Error("buy_game instruction missing from game_store IDL");
  }

  const { accounts } = params;

  return new TransactionInstruction({
    programId: params.programId,
    keys: [
      { pubkey: accounts.buyer!, isSigner: true, isWritable: true },
      { pubkey: accounts.storeState, isSigner: false, isWritable: false },
      { pubkey: accounts.treasury, isSigner: false, isWritable: true },
      { pubkey: accounts.registryGame, isSigner: false, isWritable: false },
      { pubkey: accounts.priceAccount, isSigner: false, isWritable: false },
      { pubkey: accounts.publisher, isSigner: false, isWritable: false },
      { pubkey: accounts.publisherBalance, isSigner: false, isWritable: true },
      { pubkey: accounts.pgcProgram, isSigner: false, isWritable: false },
      { pubkey: accounts.pgcConfig, isSigner: false, isWritable: false },
      { pubkey: accounts.licensePda, isSigner: false, isWritable: true },
      { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
      { pubkey: accounts.buyerTokenAccount, isSigner: false, isWritable: true },
      { pubkey: accounts.treasuryTokenAccount, isSigner: false, isWritable: true },
      { pubkey: accounts.publisherTokenAccount, isSigner: false, isWritable: true },
      { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(buyGame.discriminator),
  });
}
