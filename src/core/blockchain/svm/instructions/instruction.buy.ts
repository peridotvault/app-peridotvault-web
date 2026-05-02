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

  const accountKeys: { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[] = [
    { pubkey: accounts.buyer!, isSigner: true, isWritable: true },
    { pubkey: accounts.storeConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.authorizedSourceProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.sourceProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.authorizedRegistryProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.registryProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.game, isSigner: false, isWritable: false },
    { pubkey: accounts.registryGame, isSigner: false, isWritable: false },
    { pubkey: accounts.gameStoreConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.paymentMint, isSigner: false, isWritable: false },
    { pubkey: accounts.acceptedPaymentToken, isSigner: false, isWritable: false },
    { pubkey: accounts.gamePaymentOption, isSigner: false, isWritable: false },
    { pubkey: accounts.buyerPaymentAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.publisherPaymentAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.treasuryPaymentAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.storeActor, isSigner: true, isWritable: false },
    { pubkey: accounts.authorizedActor, isSigner: false, isWritable: false },
    { pubkey: accounts.pgl1Program, isSigner: false, isWritable: false },
    { pubkey: accounts.license, isSigner: false, isWritable: true },
    { pubkey: accounts.purchaseReceipt, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    programId: params.programId,
    keys: accountKeys,
    data: Buffer.from(buyGame.discriminator),
  });
}
