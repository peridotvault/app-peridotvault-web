import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import gameStoreIdl from "../idl/game_store.json";
import { encodeBorshString } from "../codecs/borsh";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from "../contracts/program.constants";
import type { SvmBuyGameAccounts } from "../contracts/purchase.context";

export type BuildSvmBuyInstructionParams = {
  programId: PublicKey;
  gameId: string;
  accounts: SvmBuyGameAccounts;
};

export function buildSvmBuyGameInstruction(
  params: BuildSvmBuyInstructionParams,
): TransactionInstruction {
  const buyGame = gameStoreIdl.instructions.find(
    (instruction) => instruction.name === "buyGame",
  );

  if (!buyGame) {
    throw new Error("buyGame instruction missing from game_store IDL");
  }

  const { accounts } = params;

  return new TransactionInstruction({
    programId: params.programId,
    keys: [
      { pubkey: accounts.buyer, isSigner: true, isWritable: true },
      { pubkey: accounts.storeState, isSigner: false, isWritable: true },
      { pubkey: accounts.registryState, isSigner: false, isWritable: false },
      { pubkey: accounts.pgcProgram, isSigner: false, isWritable: false },
      { pubkey: accounts.pgcGameState, isSigner: false, isWritable: true },
      { pubkey: accounts.gameAuthority, isSigner: false, isWritable: false },
      { pubkey: accounts.storeMinterAuth, isSigner: false, isWritable: false },
      { pubkey: accounts.licenseAccount, isSigner: false, isWritable: true },
      {
        pubkey: accounts.userGameTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      { pubkey: accounts.gameMint, isSigner: false, isWritable: true },
      { pubkey: accounts.treasury, isSigner: false, isWritable: true },
      { pubkey: accounts.paymentMint, isSigner: false, isWritable: false },
      {
        pubkey: accounts.buyerPaymentTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: accounts.treasuryTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: accounts.storeVaultTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: accounts.paymentTokenProgram,
        isSigner: false,
        isWritable: false,
      },
      { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
      {
        pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: Buffer.concat([
      Buffer.from(buyGame.discriminator),
      encodeBorshString(params.gameId),
    ]),
  });
}
