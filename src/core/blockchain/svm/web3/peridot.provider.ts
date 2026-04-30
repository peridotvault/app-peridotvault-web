/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChainStore } from "@/shared/states/chain.store";
import { getSvmChainKey } from "./index";

class PeridotInpageProvider {
  request<T = any>({ method, params }: { method: string; params?: any }): Promise<T> {
    const id = crypto.randomUUID();

    const targetWindow = window.parent !== window ? window.parent : window;
    targetWindow.postMessage({ target: "PERIDOT_CS", id, method, params }, "*");

    return new Promise<T>((resolve, reject) => {
      const handler = (ev: MessageEvent) => {
        // IMPORTANT: message response comes from parent window in iframe context
        if (ev.source !== window && ev.source !== window.parent) return;

        const msg = ev.data;
        if (!msg || msg.target !== "PERIDOT_INPAGE" || msg.id !== id) return;

        window.removeEventListener("message", handler);
        if (msg.error) {
          reject(new Error(msg.error));
        } else {
          resolve(msg.result);
        }
      };

      window.addEventListener("message", handler);
    });
  }
}

/**
 * Injects Peridot specific wallet providers (EVM/Solana) into the window object.
 */
export function injectPeridotWallet() {
  if (typeof window === "undefined") return;
  if ((window as any).peridotwallet) return;

  const peridot = new PeridotInpageProvider();
  (window as any).peridotwallet = peridot;

  // EVM adapter (minimal EIP-1193-ish)
  (window as any).ethereum = {
    isPeridotWallet: true,
    request: (args: any) => peridot.request(args),
  };

  // Solana adapter (minimal)
  (window as any).solana = {
    isPeridotWallet: true,
    connect: () => {
      // Get current Solana chain and pass it to the wallet
      const chainKey = getSvmChainKey(useChainStore.getState().chainKey);
      return peridot.request({ 
        method: "solana_connect",
        params: { chainId: chainKey }
      });
    },
    signMessage: (msg: Uint8Array) => {
      const chainKey = getSvmChainKey(useChainStore.getState().chainKey);
      return peridot.request({
        method: "solana_signMessage",
        params: { message: Array.from(msg), chainId: chainKey },
      });
    },
    signTransaction: (transaction: string) => {
      const chainKey = getSvmChainKey(useChainStore.getState().chainKey);
      return peridot.request({
        method: "solana_signTransaction",
        params: { transaction, encoding: "base64", chainId: chainKey },
      });
    },
    sendTransaction: (transaction: string) => {
      const chainKey = getSvmChainKey(useChainStore.getState().chainKey);
      return peridot.request({
        method: "solana_sendTransaction",
        params: { transaction, encoding: "base64", chainId: chainKey },
      });
    },
  };
}
