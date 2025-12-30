/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

type SignState = {
  publicKey?: string;
  signature?: string;
  signedMessage?: string;
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

// Challenge builder demo (production: ambil dari server)
function buildMasterChallenge(domain: string) {
  const issuedAt = new Date().toISOString();
  const expirationTime = new Date(Date.now() + 5 * 60_000).toISOString();

  const nonce = crypto.getRandomValues(new Uint8Array(16));
  const nonceHex = Array.from(nonce)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return {
    domain,
    uri: `https://${domain}`,
    nonce: nonceHex,
    issuedAt,
    expirationTime,
    version: "1" as const, // penting: match type "1"
    // statement?: "..."
  };
}

export function ConnectPeridotButton() {
  const [state, setState] = useState<SignState>({
    message: "Login from app.peridotvault.com",
  });
  const [busy, setBusy] = useState(false);
  // const [error, setError] = useState("");

  function getPeridot() {
    if (typeof window === "undefined") return null;
    return (window as any).peridotwallet;
  }

  function assertPeridot() {
    if (!getPeridot().master.isPeridotWallet) {
      throw new Error(
        "PeridotWallet extension not detected (window.peridotwallet.master missing)."
      );
    }
  }

  async function signMaster() {
    setBusy(true);
    // setError("");
    try {
      assertPeridot();

      const domain = window.location.host;
      const challenge = buildMasterChallenge(domain);

      const msgText = state.message ?? "";
      if (!msgText.trim()) throw new Error("Message cannot be empty.");

      // IMPORTANT: runtime terbaru expect { message: Uint8Array, challenge }
      const res = await getPeridot().master.signMessage(
        toU8Message(msgText),
        challenge
      );

      console.log(res);

      // support new nested results OR legacy flat results
      const signature =
        res?.signature?.data ?? res?.signature ?? res?.signatureBase64;
      const publicKey =
        res?.publicKey?.data ?? res?.publicKey ?? res?.publicKeyBase64;
      const signedMessage =
        res?.signedMessage?.data ?? res?.signedMessage ?? undefined;

      if (!signature) throw new Error("signMessage did not return signature.");

      setState((s) => ({
        ...s,
        signature,
        publicKey: publicKey ?? s.publicKey,
        signedMessage,
      }));
    } catch (e: any) {
      // setError(e?.message ?? "Unknown error");
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={signMaster}
      disabled={busy}
      className={
        busy
          ? "rounded px-8 py-2 bg-white text-background cursor-not-allowed opacity-60"
          : "rounded px-8 py-2 bg-white text-background hover:scale-105 cursor-pointer duration-300"
      }
    >
      {state.publicKey
        ? short(state.publicKey)
        : busy
        ? "Connecting..."
        : "Connect"}
    </button>
  );
}
