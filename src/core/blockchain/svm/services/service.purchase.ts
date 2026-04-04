import {
  Connection,
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
  // Be more specific: Prioritize window.phantom.solana if it exists,
  // to avoid conflicts with window.solana which might be other wallets.
  return window.phantom?.solana ?? window.solana;
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

    console.log(`[SVM-PURCHASE-V2] Start for game: ${input.game_id}`);

    // Initial validation
    await getSvmBuyGameContext({
      connection,
      programId,
      input,
    });

    // Try silent connection if public key is not already available
    let publicKey = provider.publicKey;
    if (!publicKey) {
      try {
        const resp = await Promise.race([
          (provider as any).connect({ onlyIfTrusted: true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 500))
        ]);
        publicKey = resp.publicKey;
      } catch (e) {
        // Ignore timeout or rejection for silent check
      }
    }

    if (publicKey) {
      const buyer = new PublicKey(publicKey.toString());
      await getSvmBuyGameContext({
        buyer,
        connection,
        programId,
        input,
      });
    }

    // Now call full connect()
    const connectionResult = await (provider as any).connect();
    const buyer = new PublicKey(connectionResult.publicKey.toString());
    
    const context = await getSvmBuyGameContext({
      buyer,
      connection,
      programId,
      input,
    });
    
    // Explicitly check if the user already owns the game
    const existingLicense = await connection.getAccountInfo(context.accounts.licensePda);
    if (existingLicense) {
      throw new Error("Game already owned. You can find it in your Library.");
    }
    
    console.log(`[SVM-PURCHASE-V2] Resolved context for ${buyer.toBase58()}`);
    console.log(`[SVM-PURCHASE-V2] 15 Accounts:`, {
      "01. Buyer (S, W)": context.accounts.buyer?.toBase58(),
      "02. Store Config (W)": context.accounts.storeState.toBase58(),
      "03. Treasury (W)": context.accounts.treasury.toBase58(),
      "04. PGC Game State": context.accounts.registryGame.toBase58(),
      "05. Price Account": context.accounts.priceAccount.toBase58(),
      "06. Publisher": context.accounts.publisher.toBase58(),
      "07. Publisher Balance (W)": context.accounts.publisherBalance.toBase58(),
      "08. PGC Program": context.accounts.pgcProgram.toBase58(),
      "09. PGC Config": context.accounts.pgcConfig.toBase58(),
      "10. License PDA (W)": context.accounts.licensePda.toBase58(),
      "11. Token Program": context.accounts.tokenProgram.toBase58(),
      "12. Buyer Token Acc (W)": context.accounts.buyerTokenAccount.toBase58(),
      "13. Treasury Token Acc (W)": context.accounts.treasuryTokenAccount.toBase58(),
      "14. Publisher Token Acc (W)": context.accounts.publisherTokenAccount.toBase58(),
      "15. System Program": context.accounts.systemProgram.toBase58(),
    });
    
    const instruction = buildSvmBuyGameInstruction({
      programId,
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

    try {
      if ((provider as any).isPeridotWallet) {
        console.log(`[SVM-PURCHASE-V2] Using PeridotWallet bridge`);
        const serialized = transaction
          .serialize({ requireAllSignatures: false, verifySignatures: false })
          .toString("base64");

        if (!(provider as any).sendTransaction) {
          throw new Error("PeridotWallet provider does not support sendTransaction");
        }
        signature = await (provider as any).sendTransaction(serialized);
      } else {
        // High-reliability signing strategy for modern wallets
        console.log(`[SVM-PURCHASE-V2] Attempting to sign transaction...`);
        
        if (typeof (provider as any).signTransaction === "function") {
          console.log(`[SVM-PURCHASE-V2] Strategy: signTransaction + sendRawTransaction`);
          const signedTx = await (provider as any).signTransaction(transaction);
          signature = await connection.sendRawTransaction(signedTx.serialize(), sendOptions);
        } else if (typeof (provider as any).sendTransaction === "function") {
          console.log(`[SVM-PURCHASE-V2] Strategy: provider.sendTransaction`);
          const result = await (provider as any).sendTransaction(transaction, connection, sendOptions);
          signature = typeof result === "string" ? result : result.signature;
        } else if (typeof (provider as any).signAndSendTransaction === "function") {
          console.log(`[SVM-PURCHASE-V2] Strategy: signAndSendTransaction (Legacy Fallback)`);
          const result = await (provider as any).signAndSendTransaction(transaction);
          signature = result.signature;
        } else {
          throw new Error("No supported transaction sending method found on provider");
        }
      }
    } catch (e: any) {
      console.error(`[SVM-PURCHASE-V2] Transaction signing failed:`, e);
      throw new Error(`Transaction failed: ${e.message || "Unknown error"}`);
    }

    console.log(`[SVM-PURCHASE-V2] Transaction sent: ${signature}`);

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
