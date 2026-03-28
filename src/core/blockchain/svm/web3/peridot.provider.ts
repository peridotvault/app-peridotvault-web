/* eslint-disable @typescript-eslint/no-explicit-any */

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
        msg.error ? reject(new Error(msg.error)) : resolve(msg.result);
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
    connect: () => peridot.request({ method: "solana_connect" }),
    signMessage: (msg: Uint8Array) =>
      peridot.request({
        method: "solana_signMessage",
        params: { message: Array.from(msg) },
      }),
    signTransaction: (transaction: string) =>
      peridot.request({
        method: "solana_signTransaction",
        params: { transaction, encoding: "base64" },
      }),
    sendTransaction: (transaction: string) =>
      peridot.request({
        method: "solana_sendTransaction",
        params: { transaction, encoding: "base64" },
      }),
  };
}
