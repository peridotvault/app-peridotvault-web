import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import gameStoreIdl from "../idl/game_store.json";
import type { SvmBuyGameAccounts } from "../contracts/purchase.context";

export type BuildSvmBuyInstructionParams = {
  programId: PublicKey;
  accounts: SvmBuyGameAccounts;
  mintToken?: PublicKey;
  referrer?: PublicKey;
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
    { pubkey: accounts.paymentMint ?? PublicKey.default, isSigner: false, isWritable: false },
    { pubkey: accounts.acceptedPaymentToken ?? PublicKey.default, isSigner: false, isWritable: false },
    { pubkey: accounts.gamePaymentOption ?? PublicKey.default, isSigner: false, isWritable: false },
    { pubkey: accounts.buyerPaymentAccount ?? PublicKey.default, isSigner: false, isWritable: true },
    { pubkey: accounts.publisherPaymentAccount ?? PublicKey.default, isSigner: false, isWritable: true },
    { pubkey: accounts.treasuryPaymentAccount ?? PublicKey.default, isSigner: false, isWritable: true },
    { pubkey: accounts.referrerPaymentAccount ?? PublicKey.default, isSigner: false, isWritable: false },
    { pubkey: accounts.storeActor, isSigner: false, isWritable: false },
    { pubkey: accounts.authorizedActor, isSigner: false, isWritable: false },
    { pubkey: accounts.pgl1Program, isSigner: false, isWritable: false },
    { pubkey: accounts.license, isSigner: false, isWritable: true },
    { pubkey: accounts.purchaseReceipt, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];

  // Encode args: discriminator (8) + mint_token (option<pubkey>) + referrer (option<pubkey>)
  const discriminator = Buffer.from(buyGame.discriminator);
  const mintTokenBuf = params.mintToken
    ? Buffer.concat([Buffer.from([1]), params.mintToken.toBuffer()])
    : Buffer.from([0]);
  const referrerBuf = params.referrer
    ? Buffer.concat([Buffer.from([1]), params.referrer.toBuffer()])
    : Buffer.from([0]);

  const data = Buffer.concat([discriminator, mintTokenBuf, referrerBuf]);

  return new TransactionInstruction({
    programId: params.programId,
    keys: accountKeys,
    data,
  });
}
