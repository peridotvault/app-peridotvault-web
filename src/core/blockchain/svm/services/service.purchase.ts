import {
  PublicKey,
  Transaction,
  SystemProgram,
  type SendOptions,
} from "@solana/web3.js";
import { BuyGameInput } from "@/core/blockchain/__core__/types/purchase.type";
import { getSvmProgramId } from "../contracts/program.registry";
import { getSvmBuyGameContext } from "../contracts/purchase.context";
import { buildSvmBuyGameInstruction } from "../instructions/instruction.buy";
import { getSvmConnection, getSvmChainKey } from "../web3";
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "../contracts/program.constants";
import {
  findAssociatedTokenAddress,
} from "../contracts/pda";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SolanaProvider = any;

function getSolanaProvider(): SolanaProvider | undefined {
  // Be more specific: Prioritize window.phantom.solana if it exists,
  // to avoid conflicts with window.solana which might be other wallets.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).phantom?.solana ?? (window as any).solana;
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
    console.log(`[SVM-PURCHASE-V2] Input: payment_token=${input.payment_token}, pgl1=${input.pgl1_address}, price=${input.price}, chainKey=${input.chainKey}`);

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
          provider.connect({ onlyIfTrusted: true }),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 500))
        ]) as { publicKey: PublicKey };
        publicKey = resp.publicKey;
      } catch {
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
    const connectionResult = await provider.connect() as { publicKey: PublicKey };
    const buyer = new PublicKey(connectionResult.publicKey.toString());
    
    const context = await getSvmBuyGameContext({
      buyer,
      connection,
      programId,
      input,
    });
    
    // Explicitly check if the user already owns the game
    const existingLicense = await connection.getAccountInfo(context.accounts.license);
    if (existingLicense) {
      throw new Error("Game already owned. You can find it in your Library.");
    }
    
    console.log(`[SVM-PURCHASE-V2] Resolved context for ${buyer.toBase58()}`);
    console.log(`[SVM-PURCHASE-V2] Accounts:`, {
      "01. Buyer (S, W)": context.accounts.buyer?.toBase58(),
      "02. Store Config": context.accounts.storeConfig.toBase58(),
      "03. Auth Source Program": context.accounts.authorizedSourceProgram.toBase58(),
      "04. Source Program (PGC)": context.accounts.sourceProgram.toBase58(),
      "05. Auth Registry Program": context.accounts.authorizedRegistryProgram.toBase58(),
      "06. Registry Program": context.accounts.registryProgram.toBase58(),
      "07. Game (PGC PDA)": context.accounts.game.toBase58(),
      "08. Registry Game": context.accounts.registryGame.toBase58(),
      "09. Game Store Config": context.accounts.gameStoreConfig.toBase58(),
      "10. Payment Mint": context.accounts.paymentMint.toBase58(),
      "11. Accepted Payment Token": context.accounts.acceptedPaymentToken?.toBase58() ?? "N/A",
      "12. Game Payment Option": context.accounts.gamePaymentOption?.toBase58() ?? "N/A",
      "13. Buyer Payment Acc (W)": context.accounts.buyerPaymentAccount?.toBase58() ?? "N/A",
      "14. Publisher Payment Acc (W)": context.accounts.publisherPaymentAccount?.toBase58() ?? "N/A",
      "15. Treasury Payment Acc (W)": context.accounts.treasuryPaymentAccount?.toBase58() ?? "N/A",
      "16. Store Actor (S)": context.accounts.storeActor.toBase58(),
      "17. Authorized Actor": context.accounts.authorizedActor.toBase58(),
      "18. PGL1 Program": context.accounts.pgl1Program.toBase58(),
      "19. License (W)": context.accounts.license.toBase58(),
      "20. Purchase Receipt (W)": context.accounts.purchaseReceipt.toBase58(),
      "21. Token Program": context.accounts.tokenProgram.toBase58(),
      "22. System Program": context.accounts.systemProgram.toBase58(),
    });
    
    const instructions: Transaction['instructions'] = [];

    if (input.payment_token && context.accounts.buyerPaymentAccount) {
      const buyerAta = context.accounts.buyerPaymentAccount;
      const buyerAtaInfo = await connection.getAccountInfo(buyerAta);

      let tokenProgram = context.accounts.tokenProgram;

      if (buyerAtaInfo) {
        const ownerProgramId = new PublicKey(buyerAtaInfo.owner.toBase58());
        tokenProgram = ownerProgramId.equals(TOKEN_2022_PROGRAM_ID) ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
      } else {
        const mintInfo = await connection.getAccountInfo(context.accounts.paymentMint);
        if (mintInfo) {
          const mintOwner = new PublicKey(mintInfo.owner.toBase58());
          tokenProgram = mintOwner.equals(TOKEN_2022_PROGRAM_ID) ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
        }
      }

      if (!tokenProgram.equals(context.accounts.tokenProgram)) {
        console.log(`[SVM-PURCHASE-V2] Updating token program: ${context.accounts.tokenProgram.toBase58()} -> ${tokenProgram.toBase58()}`);
        context.accounts.tokenProgram = tokenProgram;
        context.accounts.buyerPaymentAccount = findAssociatedTokenAddress(buyer, context.accounts.paymentMint, tokenProgram);

        const publisher = context.game.publisher;
        context.accounts.publisherPaymentAccount = findAssociatedTokenAddress(publisher, context.accounts.paymentMint, tokenProgram);
        context.accounts.treasuryPaymentAccount = findAssociatedTokenAddress(context.store.treasury, context.accounts.paymentMint, tokenProgram);
      }

      if (!buyerAtaInfo) {
        console.log(`[SVM-PURCHASE-V2] Buyer ATA does not exist, creating: ${buyerAta.toBase58()}`);
        
        const createAtaInstruction = {
          programId: ASSOCIATED_TOKEN_PROGRAM_ID,
          keys: [
            { pubkey: buyer, isSigner: false, isWritable: true },
            { pubkey: buyerAta, isSigner: false, isWritable: true },
            { pubkey: buyer, isSigner: true, isWritable: false },
            { pubkey: context.accounts.paymentMint, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            { pubkey: context.accounts.tokenProgram, isSigner: false, isWritable: false },
          ],
          data: Buffer.alloc(0),
        };
        instructions.push(createAtaInstruction);
      } else {
        console.log(`[SVM-PURCHASE-V2] Buyer ATA already exists: ${buyerAta.toBase58()}`);

        const buyerAtaOwner = new PublicKey(buyerAtaInfo.data.slice(32, 64)).toBase58();
        const buyerAtaMint = new PublicKey(buyerAtaInfo.data.slice(0, 32)).toBase58();
        console.log(`[SVM-PURCHASE-V2] Buyer ATA owner: ${buyerAtaOwner}, Buyer ATA mint: ${buyerAtaMint}`);
        
        if (buyerAtaInfo.data.length >= 72) {
          const balance = Number(buyerAtaInfo.data.readBigUInt64LE(64));
          console.log(`[SVM-PURCHASE-V2] Buyer ATA balance: ${balance}`);
          
          const gamePaymentOption = context.gamePaymentOption;
          if (gamePaymentOption) {
            const basePrice = Number(gamePaymentOption.basePrice);
            const now = Math.floor(Date.now() / 1000);
            const discountBps = context.gameStoreCfg.discountBps;
            const discountStartsAt = context.gameStoreCfg.discountStartsAt ? Number(context.gameStoreCfg.discountStartsAt) : null;
            const discountExpiresAt = context.gameStoreCfg.discountExpiresAt ? Number(context.gameStoreCfg.discountExpiresAt) : null;
            
            let finalPrice = basePrice;
            if (discountBps !== null && discountBps <= 10000) {
              const inWindow = (!discountStartsAt || now >= discountStartsAt) && (!discountExpiresAt || now <= discountExpiresAt);
              if (inWindow) {
                const discountAmount = Math.floor((basePrice * discountBps) / 10000);
                finalPrice = basePrice - discountAmount;
              }
            }
            
            console.log(`[SVM-PURCHASE-V2] Base price: ${basePrice}, Final price: ${finalPrice}`);
            
            if (balance < finalPrice) {
              const mintInfo = await connection.getParsedAccountInfo(context.accounts.paymentMint);
              const decimals = (mintInfo.value?.data as any)?.parsed?.info?.decimals ?? 6;
              const balanceFormatted = (balance / Math.pow(10, decimals)).toFixed(decimals);
              const requiredFormatted = (finalPrice / Math.pow(10, decimals)).toFixed(decimals);
              throw new Error(`Insufficient token balance. You have ${balanceFormatted}, need ${requiredFormatted}`);
            }
          }
        }
      }

      const publisherAta = context.accounts.publisherPaymentAccount;
      const publisherAtaInfo = publisherAta ? await connection.getAccountInfo(publisherAta) : null;
      if (!publisherAtaInfo) {
        console.log(`[SVM-PURCHASE-V2] Publisher ATA does not exist: ${publisherAta?.toBase58()}`);
        throw new Error(`Publisher has not set up a token account for this payment token. Please contact support.`);
      }

      const treasuryAta = context.accounts.treasuryPaymentAccount;
      const treasuryAtaInfo = treasuryAta ? await connection.getAccountInfo(treasuryAta) : null;
      if (!treasuryAtaInfo) {
        console.log(`[SVM-PURCHASE-V2] Treasury ATA does not exist: ${treasuryAta?.toBase58()}`);
        throw new Error(`Treasury has not set up a token account for this payment token. Please contact support.`);
      }

      const mintInfo = await connection.getAccountInfo(context.accounts.paymentMint);
      const mintOwner = mintInfo ? new PublicKey(mintInfo.owner.toBase58()).toBase58() : "unknown";
      const mintParsed = await connection.getParsedAccountInfo(context.accounts.paymentMint);
      const decimals = (mintParsed?.value?.data as any)?.parsed?.info?.decimals ?? "N/A";
      console.log(`[SVM-PURCHASE-V2] Mint owner: ${mintOwner} | decimals: ${decimals} | Mint: ${context.accounts.paymentMint.toBase58()}`);

      if (context.gamePaymentOption) {
        console.log(`[SVM-PURCHASE-V2] GamePaymentOption on-chain: basePrice=${context.gamePaymentOption.basePrice.toString()}, active=${context.gamePaymentOption.active}, mint=${context.gamePaymentOption.mint.toBase58()}`);
      }
      console.log(`[SVM-PURCHASE-V2] StoreConfig: platformFeeBps=${context.store.platformFeeBps}, treasury=${context.store.treasury.toBase58()} | defaultReferralBps=${context.store.defaultReferralBps} maxReferralBps=${context.store.maxReferralBps}`);
      console.log(`[SVM-PURCHASE-V2] Buyer pk: ${buyer.toBase58()} | Treasury: ${context.store.treasury.toBase58()} | Publisher: ${context.game.publisher.toBase58()}`);

      if (publisherAtaInfo && publisherAtaInfo.data.length >= 72) {
        const pubAtaOwner = new PublicKey(publisherAtaInfo.data.slice(32, 64)).toBase58();
        const pubAtaMint = new PublicKey(publisherAtaInfo.data.slice(0, 32)).toBase58();
        console.log(`[SVM-PURCHASE-V2] Publisher ATA owner: ${pubAtaOwner} | mint: ${pubAtaMint}`);
      }
      if (treasuryAtaInfo.data.length >= 72) {
        const trAtaOwner = new PublicKey(treasuryAtaInfo.data.slice(32, 64)).toBase58();
        const trAtaMint = new PublicKey(treasuryAtaInfo.data.slice(0, 32)).toBase58();
        console.log(`[SVM-PURCHASE-V2] Treasury ATA owner: ${trAtaOwner} | mint: ${trAtaMint}`);
      }
    }

    const buyInstruction = buildSvmBuyGameInstruction({
      programId,
      accounts: context.accounts,
      mintToken: input.payment_token
        ? context.accounts.paymentMint
        : undefined,
      referrer: context.accounts.referrerPaymentAccount,
    });
    instructions.push(buyInstruction);
 
    console.log(`[SVM-PURCHASE-V2] Total instructions in transaction: ${instructions.length}`);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("confirmed");
 
    const transaction = new Transaction({
      feePayer: buyer,
      blockhash,
      lastValidBlockHeight,
    }).add(...instructions);

    const sendOptions: SendOptions = {
      preflightCommitment: "confirmed",
      skipPreflight: false,
    };

    let signature: string;

    try {
      if (provider.isPeridotWallet) {
        console.log(`[SVM-PURCHASE-V2] Using PeridotWallet bridge`);
        const serialized = transaction
          .serialize({ requireAllSignatures: false, verifySignatures: false })
          .toString("base64");

        if (!provider.sendTransaction) {
          throw new Error("PeridotWallet provider does not support sendTransaction");
        }
        signature = await provider.sendTransaction(serialized) as string;
      } else {
        // High-reliability signing strategy for modern wallets
        console.log(`[SVM-PURCHASE-V2] Attempting to sign transaction...`);
        
        if (typeof provider.signTransaction === "function") {
          console.log(`[SVM-PURCHASE-V2] Strategy: signTransaction + sendRawTransaction`);
          const signedTx = await provider.signTransaction(transaction) as Transaction;
          signature = await connection.sendRawTransaction(signedTx.serialize(), sendOptions);
        } else if (typeof provider.sendTransaction === "function") {
          console.log(`[SVM-PURCHASE-V2] Strategy: provider.sendTransaction`);
          const result = await provider.sendTransaction(transaction, connection, sendOptions) as string | { signature: string };
          signature = typeof result === "string" ? result : result.signature;
        } else if (typeof provider.signAndSendTransaction === "function") {
          console.log(`[SVM-PURCHASE-V2] Strategy: signAndSendTransaction (Legacy Fallback)`);
          const result = await provider.signAndSendTransaction(transaction) as { signature: string };
          signature = result.signature;
        } else {
          throw new Error("No supported transaction sending method found on provider");
        }
      }
    } catch (e: unknown) {
      console.error(`[SVM-PURCHASE-V2] Transaction signing failed:`, e);
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      throw new Error(`Transaction failed: ${errorMessage}`);
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
