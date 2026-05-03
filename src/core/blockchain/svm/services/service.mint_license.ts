import {
  PublicKey,
  Transaction,
  type SendOptions,
} from "@solana/web3.js";
import { getSvmProgramId, getSvmPgcProgramId } from "../contracts/program.registry";
import { buildSvmBuyGameInstruction } from "../instructions/instruction.buy";
import { getSvmBuyGameContext } from "../contracts/purchase.context";
import { getSvmConnection, getSvmChainKey } from "../web3";
import type { ChainKey } from "@/shared/types/chain";
import { type BuyGameInput } from "@/core/blockchain/__core__/types/purchase.type";

export interface MintLicenseInput {
  pgl1Address: string;
  chainKey?: ChainKey;
  paymentToken?: string;
}

export class SvmMintLicenseService {
  static async mintLicense(input: MintLicenseInput) {
    const provider = getSolanaProvider();
    if (!provider) throw new Error("Solana wallet not found");

    const chainKey = getSvmChainKey(input.chainKey);
    const connection = getSvmConnection(chainKey);
    const programId = getSvmProgramId(chainKey);
    const pgcProgramId = getSvmPgcProgramId();

    const connectionResult = (await provider.connect()) as {
      publicKey: PublicKey;
    };
    const buyer = new PublicKey(connectionResult.publicKey.toString());

    // Use buy_game with paid_amount=0 for free games
    // This goes through game_store which handles validation, mints license via CPI, and creates purchase receipt
    const buyInput: BuyGameInput = {
      game_id: "",
      pgl1_address: input.pgl1Address,
      payment_token: input.paymentToken || "So11111111111111111111111111111111111111112",
      chainKey: chainKey,
    };

    const context = await getSvmBuyGameContext({
      buyer,
      connection,
      programId,
      input: buyInput,
    });

    // Check if already owned
    const existingLicense = await connection.getAccountInfo(context.accounts.license);
    if (existingLicense) {
      throw new Error("Game already owned. You can find it in your Library.");
    }

    const instruction = buildSvmBuyGameInstruction({
      programId,
      accounts: context.accounts,
      mintToken: undefined, // Free game — no mint token
    });

    return await sendTransaction(provider, connection, buyer, instruction);
  }
}

async function sendTransaction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any,
  connection: ReturnType<typeof getSvmConnection>,
  buyer: PublicKey,
  instruction: ReturnType<typeof buildSvmBuyGameInstruction>,
): Promise<string> {
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");

  const transaction = new Transaction({
    feePayer: buyer,
    blockhash,
    lastValidBlockHeight,
  }).add(instruction);

  const sendOptions: SendOptions = {
    preflightCommitment: "confirmed",
    skipPreflight: false,
  };

  let signature: string;

  try {
    if (provider.isPeridotWallet) {
      const serialized = transaction
        .serialize({ requireAllSignatures: false, verifySignatures: false })
        .toString("base64");
      if (!provider.sendTransaction) {
        throw new Error("PeridotWallet provider does not support sendTransaction");
      }
      signature = (await provider.sendTransaction(serialized)) as string;
    } else if (typeof provider.signTransaction === "function") {
      const signedTx = (await provider.signTransaction(
        transaction,
      )) as Transaction;
      signature = await connection.sendRawTransaction(
        signedTx.serialize(),
        sendOptions,
      );
    } else if (typeof provider.sendTransaction === "function") {
      const result = (await provider.sendTransaction(
        transaction,
        connection,
        sendOptions,
      )) as string | { signature: string };
      signature =
        typeof result === "string" ? result : result.signature;
    } else if (typeof provider.signAndSendTransaction === "function") {
      const result = (await provider.signAndSendTransaction(
        transaction,
      )) as { signature: string };
      signature = result.signature;
    } else {
      throw new Error("No supported transaction sending method found on provider");
    }
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Unknown error";
    throw new Error(`Transaction failed: ${errorMessage}`);
  }

  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    "confirmed",
  );

  return signature;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function getSolanaProvider() {
  return (window as any).phantom?.solana ?? (window as any).solana;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
