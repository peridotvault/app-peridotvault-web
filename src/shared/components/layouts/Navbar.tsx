"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton, SignState } from "@antigane/wallet-adapters";
import { ModalProfile } from "@/shared/components/ModalProfile";
import { NotificationBar } from "@/shared/components/NotificationBar";
import { useUIStore } from "@/shared/stores/ui";
import { verifyAndCreateSession } from "@/features/auth/verify/verify.service";
import { useAuthStore } from "@/features/auth/_store/auth.store";
import { getSession } from "@/features/auth/_db/db.service";
import { STYLE_PADDING } from "@/shared/constants/style";

export default function Navbar() {
  const [state, setState] = useState<null | SignState>();
  const authStatus = useAuthStore((s) => s.status);

  const openModal = useUIStore((s) => s.openModal);
  const closeModal = useUIStore((s) => s.closeModal);
  const isProfileOpen = useUIStore((s) => s.isModalOpen("profile"));

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) return;

      setState({
        accountId: session.accountId,
        accountType: session.accountType,
      } as SignState);
    })();
  }, []);

  useEffect(() => {
    if (authStatus === "anonymous") {
      const id = window.setTimeout(() => setState(null), 0);
      return () => window.clearTimeout(id);
    }
  }, [authStatus]);

  async function afterSign(e: SignState) {
    setState(e);

    await verifyAndCreateSession({
      signature: e.signature!,
      message: e.message!,
      accountId: e.accountId!,
      accountType: e.accountType!.toLowerCase(),
    });
  }

  const authed = authStatus === "authenticated";

  return (
    <header className="left-0 top-0 z-20 w-full flex flex-col">
      <NotificationBar />

      <div
        className={
          "flex items-center justify-between w-full z-21 py-4 bg-card " +
          STYLE_PADDING
        }
      >
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
            authState={
              authStatus === "loading"
                ? "loading"
                : authed
                  ? "authenticated"
                  : "anonymous"
            }
            signedState={authStatus === "authenticated" ? state : null}
            onSigned={afterSign}
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
