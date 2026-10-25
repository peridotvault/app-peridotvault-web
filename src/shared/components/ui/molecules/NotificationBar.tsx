"use client";

import Link from "next/link";

export const NotificationBar = () => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "mainnet") return null;

  return (
    <div className="flex gap-1 items-center justify-center w-full bg-highlight p-2 text-background z-21 font-medium">
      <span>You&apos;re on {process.env.NEXT_PUBLIC_ENVIRONMENT}</span>
      <Link
        href="https://faucet.peridotvault.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold underline"
      >
        Get Test Tokens
      </Link>
    </div>
  );
};
