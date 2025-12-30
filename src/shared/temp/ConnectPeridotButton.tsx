/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

type SignState = {
  signature?: string;
  publicKey?: string;
  message?: string;
};

function short(v?: string, head = 10, tail = 10) {
  if (!v) return "-";
  if (v.length <= head + tail + 3) return v;
  return `${v.slice(0, head)}...${v.slice(-tail)}`;
}

function toU8Message(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

export function ConnectPeridotButton() {
  const [state, setState] = useState<SignState>({
    message: "halo tolong sign message ini",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signMaster() {
    setBusy(true);
    setError("");

    try {
      const peridot = (window as any).peridotwallet;

      if (!peridot?.master?.isPeridotWallet) {
        throw new Error(
          "PeridotWallet extension not detected (window.peridotwallet.master missing)."
        );
      }

      const msg = state.message ?? "";
      if (!msg.trim()) throw new Error("Message cannot be empty.");

      // IMPORTANT:
      // Runtime kamu expect params: { message: number[] }
      // Jadi kita kirim Uint8Array (kebanyakan provider akan serialize ke number[])
      const bytes = toU8Message(msg);

      // ✅ master API: signMessage(messageBytes)
      const res = await peridot.master.signMessage(bytes);
      console.log(res);

      // Asumsi hasilnya { signature, publicKey } (sesuai ConnectPage kamu)
      const signature =
        res?.signature ?? res?.signatureBase64 ?? res?.signatureHex;
      const publicKey =
        res?.publicKey ?? res?.publicKeyBase64 ?? res?.publicKeyBase58;

      if (!signature) {
        throw new Error("signMessage did not return a signature.");
      }

      setState((s) => ({ ...s, signature, publicKey }));
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <button
        onClick={signMaster}
        disabled={busy}
        className={[
          "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium",
          "bg-white text-black hover:bg-white/90",
          "disabled:cursor-not-allowed disabled:opacity-60",
        ].join(" ")}
      >
        {state.signature
          ? short(state.publicKey)
          : busy
          ? "Connecting..."
          : "Connect"}
      </button>

      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
}
