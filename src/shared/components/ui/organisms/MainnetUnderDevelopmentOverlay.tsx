"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function MainnetUnderDevelopmentOverlay() {
  const [mounted, setMounted] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-modal-fade-in" />

      <div className="relative z-10 mx-4 w-full max-w-md animate-modal-in rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Image
            width={80}
            height={80}
            src="/brand/logo-peridot.png"
            alt="Peridot"
            className="h-16 w-16 object-contain"
          />

          <div className="space-y-2">
            <h2 className="text-xl font-bold">
              <span className="font-bold">Peridot</span>Vault
            </h2>
            <p className="text-muted-foreground">
              Mainnet is currently under development. Please use the testnet
              version while we finalize the mainnet deployment.
            </p>
          </div>

          <a
            href="https://web.testnet.peridotvault.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-primary-foreground transition hover:bg-accent-card active:scale-[0.98]"
          >
            Go to Testnet
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>
    </div>,
    document.body,
  )
}
