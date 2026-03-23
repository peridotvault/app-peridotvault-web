"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton, SignState } from "@antigane/wallet-adapters";
import { NotificationBar } from "@/shared/components/ui/molecules/NotificationBar";
import { verifyAndCreateSession } from "@/features/auth/verify/verify.service";
import { useAuthStore } from "@/features/auth/_store/auth.store";
import { STYLE_PADDING } from "@/shared/constants/style";
import { ModalProfile } from "@/features/user/components/ModalProfile";
import { authRepo } from "@/core/db/repositories/auth.repo";
import { useModal } from "@/core/ui-system/modal/modal.store";
import ModalShell from "@/core/ui-system/modal/ModalShell";

export default function Navbar() {
  const [state, setState] = useState<null | SignState>();
  const authStatus = useAuthStore((s) => s.status);
  const profileTriggerRef = useRef<HTMLDivElement | null>(null);
  const profileModalIdRef = useRef<string | null>(null);
  const closeModal = useModal((s) => s.close);

  useEffect(() => {
    (async () => {
      const session = await authRepo.getSession();
      if (!session) return;

      setState({
        accountId: session.account_id,
        accountType: session.account_type,
      } as SignState);
    })();
  }, []);

  useEffect(() => {
    if (authStatus === "anonymous") {
      if (profileModalIdRef.current) {
        closeModal(profileModalIdRef.current);
        profileModalIdRef.current = null;
      }

      const id = window.setTimeout(() => setState(null), 0);
      return () => window.clearTimeout(id);
    }
  }, [authStatus, closeModal]);

  useEffect(() => {
    return () => {
      if (profileModalIdRef.current) {
        useModal.getState().close(profileModalIdRef.current);
      }
    };
  }, []);

  async function afterSign(e: SignState) {
    setState(e);
    console.log("SIGNED:", e);

    await verifyAndCreateSession({
      signature: e.signature!,
      message: e.message!,
      accountId: e.accountId!,
      accountType: e.accountType!.toLowerCase(),
    });
  }

  const authed = authStatus === "authenticated";

  const closeProfileModal = () => {
    const modalId = profileModalIdRef.current;
    profileModalIdRef.current = null;

    if (modalId) {
      closeModal(modalId);
    }
  };

  const openProfileModal = () => {
    if (!state?.accountId) return;

    if (profileModalIdRef.current) {
      closeProfileModal();
      return;
    }

    const rect = profileTriggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const panelWidth = 400;
    const left = Math.max(12, rect.right - panelWidth);

    const modalId = useModal.getState().open(
      (id) => (
        <ModalShell
          id={id}
          centered={false}
          containerClassName="fixed inset-0 z-50 pointer-events-none"
          backdropClassName="pointer-events-auto"
          panelClassName="pointer-events-auto"
          panelStyle={{
            top: rect.bottom + 12,
            left,
            width: panelWidth,
          }}
          onCloseStart={() => {
            if (profileModalIdRef.current === id) {
              profileModalIdRef.current = null;
            }
          }}
        >
          <ModalProfile
            onClose={closeProfileModal}
            accountId={state.accountId!}
          />
        </ModalShell>
      ),
      { lockScroll: false },
    );

    profileModalIdRef.current = modalId;
  };

  return (
    <header className="left-0 top-0 z-20 w-full flex flex-col bg-card ">
      <NotificationBar />

      <div className={STYLE_PADDING}>
        <div className="flex items-center justify-between mx-auto max-w-400 w-full z-21 py-4 ">
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

          <div ref={profileTriggerRef} className="flex relative">
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
              onClickAfterSigned={openProfileModal}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
