import {
  PublicKey,
  Transaction,
  type SendOptions,
} from "@solana/web3.js";
import { BuyGameInput } from "@/core/blockchain/__core__/types/purchase.type";
import { getSvmProgramId } from "../contracts/program.registry";
import { getSvmBuyGameContext } from "../contracts/purchase.context";
import { buildSvmBuyGameInstruction } from "../instructions/instruction.buy";
import { getSvmConnection, getSvmChainKey } from "../web3";

function getSolanaProvider() {
  return window.solana ?? window.phantom?.solana;
}

export class SvmPurchaseService {
  static async buyGame(input: BuyGameInput) {
    const provider = getSolanaProvider();

    if (!provider) {
      throw new Error("Solana wallet not found");
    }

    const chainKey = getSvmChainKey(input.chainKey);
    const connection = getSvmConnection(chainKey);
    const programId = getSvmProgramId(chainKey);

    const { publicKey } = await provider.connect();
    const buyer = new PublicKey(publicKey.toString());
    const context = await getSvmBuyGameContext({
      buyer,
      connection,
      programId,
      input,
    });
    const instruction = buildSvmBuyGameInstruction({
      programId,
      gameId: context.gameId,
      accounts: context.accounts,
    });

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

    if ((provider as any).isPeridotWallet) {
      const serialized = transaction
        .serialize({ requireAllSignatures: false, verifySignatures: false })
        .toString("base64");

      if (!(provider as any).sendTransaction) {
        throw new Error("PeridotWallet provider does not support sendTransaction");
      }

      signature = await (provider as any).sendTransaction(serialized);
    } else if (provider.signAndSendTransaction) {
      const result = await provider.signAndSendTransaction(
        transaction,
        sendOptions,
      );
      signature = result.signature;
    } else {
      throw new Error(
        "Solana wallet does not support signAndSendTransaction or PeridotWallet protocol",
      );
    }

    await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      "confirmed",
    );

    return signature;
  }
}
