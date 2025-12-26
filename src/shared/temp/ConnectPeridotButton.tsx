/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

type ConnectState = {
  evmAddress?: string;
  solanaPublicKey?: string;
};

function shortAddr(v?: string, head = 6, tail = 4) {
  if (!v) return "-";
  if (v.length <= head + tail + 3) return v;
  return `${v.slice(0, head)}...${v.slice(-tail)}`;
}

export function ConnectPeridotButton() {
  const [state, setState] = useState<ConnectState>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  async function connectAll() {
    setBusy(true);
    setError("");

    try {
      const peridot = (window as any).peridotwallet;

      if (
        !peridot?.ethereum?.isPeridotWallet &&
        !peridot?.solana?.isPeridotWallet
      ) {
        throw new Error(
          "PeridotWallet extension not detected (window.peridotwallet missing)."
        );
      }

      const ethereum = peridot?.ethereum;
      const solana = peridot?.solana;

      // ===== EVM =====
      let evmAddress: string | undefined;
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        evmAddress = accounts?.[0];
      } catch (e: any) {
        console.warn("EVM connect failed:", e?.message);
      }

      // ===== Solana =====
      let solanaPublicKey: string | undefined;
      try {
        const res = await solana.connect();
        // kamu return string publicKey di inpage.ts (OK)
        solanaPublicKey = res?.publicKey;
      } catch (e: any) {
        console.warn("Solana connect failed:", e?.message);
      }

      if (!evmAddress && !solanaPublicKey) {
        throw new Error(
          "PeridotWallet not responding (both EVM & Solana failed)."
        );
      }

      setState({ evmAddress, solanaPublicKey });
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl">
      {state.evmAddress || state.solanaPublicKey ? (
        <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
          {state.evmAddress && (
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs">
                {shortAddr(state.evmAddress)}
              </div>
              <div className="text-xs opacity-70">EVM</div>
            </div>
          )}
          {state.solanaPublicKey && (
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs">
                {shortAddr(state.solanaPublicKey, 6, 6)}
              </div>
              <div className="text-xs opacity-70">Solana</div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-2">
          <button
            onClick={connectAll}
            disabled={busy}
            className={[
              "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium",
              "bg-white text-black hover:bg-white/90",
              "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
          >
            {busy ? "Connecting..." : "Connect PeridotWallet"}
          </button>

          {error && <div className="text-xs text-red-400">{error}</div>}
        </div>
      )}
    </div>
  );
}
