"use client";

import { useState } from "react";
import { SignState } from "../types/sign";
import { short } from "@/shared/utils/customAccountId";
import { ConnectModal } from "./ConnectModal";

export function ConnectButton() {
  const [state, setState] = useState<null | SignState>();
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);

  if (state) {
    return (
      <div className="">
        <span>{short(state.accountId)}</span>
      </div>
    );
  } else {
    return (
      <div className="">
        <button
          onClick={() => setIsOpenConnectModal(!isOpenConnectModal)}
          disabled={isOpenConnectModal}
          className={`rounded px-8 py-2 duration-300 font-bold 
          ${
            isOpenConnectModal
              ? "bg-white text-background cursor-not-allowed opacity-60"
              : "bg-accent hover:scale-105 cursor-pointer"
          }  `}
        >
          {isOpenConnectModal ? "Connecting..." : "Connect"}
        </button>

        <ConnectModal
          open={isOpenConnectModal}
          onClose={() => setIsOpenConnectModal(false)}
          onSigned={(state: SignState) => setState(state)}
        />
      </div>
    );
  }
}
