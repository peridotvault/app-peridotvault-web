"use client";

import Image from "next/image";
import Link from "next/link";
import { ConnectButton, SignState } from "@antigane/wallet-adapters";
import { ModalProfile } from "@/shared/components/ModalProfile";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const [state, setState] = useState<null | SignState>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 16);
  });

  return (
    <motion.header
      className="fixed left-0 top-0 px-6 sm:px-8 md:px-12 py-6 z-20 w-full flex"
      initial={false}
      animate={scrolled ? { y: 0 } : { y: 0 }} // header tidak perlu digeser
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ position: "fixed" }}
    >
      {/* background layer (TIDAK mengubah UI kamu, hanya overlay) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-20"
        initial={false}
        animate={scrolled ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          backgroundColor: "var(--card)",
        }}
      />
      <div className="flex items-center justify-between w-full z-21">
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
    </motion.header>
  );
}
