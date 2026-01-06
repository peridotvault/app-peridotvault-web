import { bytesToBase64 } from "@/shared/utils/cryptoEncoding";
import { SignState } from "../types/sign";
import { BrowserSDK, AddressType } from "@phantom/browser-sdk";

const sdk = new BrowserSDK({
    providers: ["injected"], // Only allow browser extension
    addressTypes: [AddressType.solana],
});

export class Phantom {
    /**
    * Signs a login message via Phantom.
    * Note: returning Promise<SignState> is required because wallet calls are async.
    */
    async Login(message: string): Promise<SignState> {
        if (!message || message.trim().length === 0) {
            throw new Error("Message is required.");
        }

        // Request accounts
        const { addresses } = await sdk.connect({ provider: "injected" });
        console.log("Connected addresses:", addresses[0].address);

        const accountId = addresses?.[0];
        if (!accountId) {
            throw new Error("No account returned from MetaMask.");
        }

        const signature = await sdk.solana.signMessage(message);

        return {
            signature: bytesToBase64(signature.signature),
            message,
            accountId: addresses[0].address,
            accountType: "SOLANA",
        };
    }

    /**
   * Returns true if Phantom is installed (or detectable among injected providers).
   */
    isPhantomInstalled(): boolean {
        if (typeof window === "undefined") return false;

        const isPhantomInstalled = window.isPhantomInstalled;
        if (!isPhantomInstalled) return false;
        return isPhantomInstalled;
    }
}