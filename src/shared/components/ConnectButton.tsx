"use client";

import { useState } from "react";
import { SignState } from "../../features/auth/types/sign";
import { short } from "@/shared/utils/customAccountId";
import { ConnectModal } from "../../features/auth/components/ConnectModal";
import { ModalProfile } from "./ModalProfile";

export function ConnectButton() {
  const [state, setState] = useState<null | SignState>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (state) {
    return (
      <div>
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="flex items-center gap-2 active:scale-95 duration-200 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-highlight text-xl font-black">
            <span>@</span>
          </div>
          <span className="font-medium">{short(state.accountId)}</span>
        </button>

        <ModalProfile
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          accountId={state.accountId!}
        />
      </div>
    );
  } else {
    return (
      <div>
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          disabled={isModalOpen}
          className={`rounded px-8 py-2 duration-300 font-bold 
          ${
            isModalOpen
              ? "bg-white text-background cursor-not-allowed opacity-60"
              : "bg-accent hover:scale-105 cursor-pointer"
          }  `}
        >
          {isModalOpen ? "Connecting..." : "Connect"}
        </button>

        <ConnectModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSigned={(state: SignState) => setState(state)}
        />
      </div>
    );
  }
}
