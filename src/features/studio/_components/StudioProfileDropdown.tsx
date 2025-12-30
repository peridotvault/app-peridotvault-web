"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DropdownMenu } from "@/shared/components/ui/DropdownMenu";
import { DropdownMenuItem, DropdownMenuHeader } from "@/shared/components/ui/DropdownMenuItem";
import { WalletAvatar } from "@/shared/components/WalletAvatar";

function short(v?: string, head = 6, tail = 4) {
  if (!v) return "-";
  if (v.length <= head + tail + 3) return v;
  return `${v.slice(0, head)}...${v.slice(-tail)}`;
}

// Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export function StudioProfileDropdown() {
  const router = useRouter();
  const { credentials, disconnect } = useAuth();

  function handleGoToHome() {
    router.push("/");
  }

  function handleDisconnect() {
    disconnect();
    router.push("/");
  }

  const walletAddress = credentials?.wallet.address;

  return (
    <DropdownMenu
      trigger={
        <div className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-white transition-all duration-200 hover:bg-white/5 cursor-pointer">
          <WalletAvatar address={walletAddress} size="sm" />
          <div className="flex flex-1 flex-col min-w-0">
            <span className="text-sm font-medium truncate">{short(walletAddress)}</span>
            <span className="text-xs text-white/50">Connected</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/50"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      }
      align="start"
      side="right"
      className="w-full"
    >
      <DropdownMenuHeader>
        <div className="flex items-center gap-3">
          <WalletAvatar address={walletAddress} size="md" />
          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <span className="text-xs text-white/50">Wallet Address</span>
            <span className="text-sm font-medium break-all">{walletAddress}</span>
          </div>
        </div>
      </DropdownMenuHeader>

      <DropdownMenuItem onClick={handleGoToHome} icon={<HomeIcon />}>
        Go to Home
      </DropdownMenuItem>

      <DropdownMenuItem onClick={handleDisconnect} icon={<LogoutIcon />} variant="danger">
        Disconnect Wallet
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
