/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DropdownMenu } from "@/shared/components/ui/DropdownMenu";
import { DropdownMenuItem, DropdownMenuHeader } from "@/shared/components/ui/DropdownMenuItem";

/**
 * ConnectPeridotButton Component
 *
 * A button that allows users to connect their Peridot Wallet.
 * When authenticated, shows a dropdown with wallet info and actions.
 *
 * Features:
 * - Connect/disconnect wallet
 * - Display wallet address (shortened)
 * - Navigate to studio
 * - Error handling and display
 */

function short(v?: string, head = 6, tail = 4) {
  if (!v) return "-";
  if (v.length <= head + tail + 3) return v;
  return `${v.slice(0, head)}...${v.slice(-tail)}`;
}

// Icons
const StudioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </svg>
);

export function ConnectPeridotButton() {
  const router = useRouter();
  const { isAuthenticated, isLoading, credentials, error, connect, disconnect } = useAuth();

  async function handleConnect() {
    try {
      await connect();
    } catch (err) {
      // Error is already handled in AuthContext
      console.error("Connection failed:", err);
    }
  }

  function handleGoToStudio() {
    router.push("/studio");
  }

  function handleDisconnect() {
    disconnect();
  }

  // Not authenticated - show connect button
  if (!isAuthenticated) {
    return (
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className={[
            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium",
            "bg-white text-black hover:bg-white/90",
            "transition-all duration-200",
            "disabled:cursor-not-allowed disabled:opacity-60",
          ].join(" ")}
        >
          <WalletIcon />
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </button>

        {error && <div className="text-xs text-red-400">{error}</div>}
      </div>
    );
  }

  // Authenticated - show dropdown menu with wallet info
  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <DropdownMenu
        trigger={
          <button
            className={[
              "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium",
              "bg-accent text-accent-foreground hover:bg-accent/90",
              "transition-all duration-200",
            ].join(" ")}
          >
            <WalletIcon />
            {short(credentials?.wallet.address)}
          </button>
        }
        align="end"
      >
        <DropdownMenuHeader>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-white/60">Connected as</span>
            <span className="text-sm font-medium">{credentials?.wallet.address}</span>
          </div>
        </DropdownMenuHeader>

        <DropdownMenuItem onClick={handleGoToStudio} icon={<StudioIcon />}>
          Go to Studio
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDisconnect} icon={<LogoutIcon />} variant="danger">
          Disconnect
        </DropdownMenuItem>
      </DropdownMenu>

      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
}
