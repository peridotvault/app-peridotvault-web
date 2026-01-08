"use client";

import Image from "next/image";
import Link from "next/link";
import { ConnectButton, SignState } from "@antigane/wallet-adapters";
import { ModalProfile } from "@/shared/components/ModalProfile";
import { useState } from "react";

export default function Navbar() {
  const [state, setState] = useState<null | SignState>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className=" w-full bg-card px-6 py-6 fixed flex left-0 top-0 z-10">
      <div className="flex items-center justify-between w-full">
        <div>
          <nav className="flex">
            <ol>
              <li>
                <Link href="/" className="flex items-center text-3xl gap-3">
                  <Image
                    width={120}
                    height={120}
                    src="/brand/logo-peridot.png"
                    alt=""
                    className="h-8 w-8 object-contain"
                  />
                  <span>
                    <span className="font-bold">Peridot</span>Vault
                  </span>
                </Link>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex">
          <ConnectButton
            onSigned={(e) => {
              setState(e);
              console.log(e);
            }}
            onClickAfterSigned={() => setIsModalOpen(true)}
          />
          {state && (
            <ModalProfile
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              accountId={state.accountId!}
            />
          )}
        </div>
      </div>
    </header>
  );
}
