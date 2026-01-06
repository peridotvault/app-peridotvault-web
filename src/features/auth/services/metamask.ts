import { SignState } from "../types/sign";
import MetaMaskSDK from "@metamask/sdk";

let sdk: MetaMaskSDK | null = null;

function getSdk(): MetaMaskSDK {
    if (typeof window === "undefined") {
        throw new Error("MetaMask SDK can only be initialized in the browser.");
    }

    if (!sdk) {
        sdk = new MetaMaskSDK({
            dappMetadata: {
                name: "PeridotVault",
                url: window.location.origin, // aman karena sekarang pasti di browser
            },
            // optional:
            // checkInstallationImmediately: false,
            // enableDebug: false,
        });
    }

    return sdk;
}

export class Metamask {

    /**
    * Signs a login message via MetaMask using personal_sign.
    * Note: returning Promise<SignState> is required because wallet calls are async.
    */
    async Login(message: string): Promise<SignState> {
        if (!message || message.trim().length === 0) {
            throw new Error("Message is required.");
        }

        const mm = getSdk();

        const accounts = await mm.connect();

        const accountId = accounts?.[0];
        if (!accountId) {
            throw new Error("No account returned from MetaMask.");
        }

        // personal_sign params: [message, address]
        const signature = await mm.connectAndSign({
            msg: message
        });

        return {
            signature,
            message,
            accountId,
            accountType: "EVM",
        };
    }

    /**
   * Returns true if MetaMask is installed (or detectable among injected providers).
   */
    isMetamaskInstalled(): boolean {
        if (typeof window === "undefined") return false;

        const eth = window.ethereum;
        if (!eth) return false;

        if (Array.isArray(eth.providers)) {
            return eth.providers.some((p) => p.isMetaMask === true);
        }

        return eth.isMetaMask === true;
    }
}