"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton, SignState } from "@antigane/wallet-adapters";
import { ModalProfile } from "@/shared/components/ModalProfile";
import { NotificationBar } from "@/shared/components/NotificationBar";
import { useUIStore } from "@/shared/stores/ui";

export default function Navbar() {
  const [state, setState] = useState<null | SignState>();
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useUIStore((s) => s.openModal);
  const closeModal = useUIStore((s) => s.closeModal);
  const isProfileOpen = useUIStore((s) => s.isModalOpen("profile"));

  return (
    <header className="left-0 top-0 z-20 w-full flex flex-col">
      <NotificationBar />

      <div className="flex items-center justify-between w-full z-21 px-6 sm:px-8 md:px-12 py-6 bg-card">
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

        <div className="flex relative">
          <ConnectButton
            // tambahkan on click
            onSigned={(e) => {
              setState(e);
              console.log(e);
            }}
            onClickAfterSigned={() => openModal("profile")}
          />
          {state && (
            <ModalProfile
              open={isProfileOpen}
              onClose={closeModal}
              accountId={state.accountId!}
            />
          )}
        </div>
      </div>
    </header>
  );
}
