/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";

function short(v?: string, head = 6, tail = 4) {
  if (!v) return "-";
  if (v.length <= head + tail + 3) return v;
  return `${v.slice(0, head)}...${v.slice(-tail)}`;
}

export function ConnectPeridotButton() {
  const { isAuthenticated, isLoading, credentials, error, connect, disconnect } = useAuth();

  async function handleClick() {
    if (isAuthenticated) {
      disconnect();
    } else {
      try {
        await connect();
      } catch (err) {
        // Error is already handled in AuthContext
        console.error("Connection failed:", err);
      }
    }
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={[
          "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium",
          isAuthenticated
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-white text-black hover:bg-white/90",
          "disabled:cursor-not-allowed disabled:opacity-60",
        ].join(" ")}
      >
        {isLoading
          ? "Connecting..."
          : isAuthenticated
            ? short(credentials?.wallet.address)
            : "Connect Wallet"}
      </button>

      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
}
