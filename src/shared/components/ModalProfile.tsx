import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { short } from "../utils/customAccountId";
import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
  accountId: string;
};

export const ModalProfile = ({ open, onClose, accountId }: Props) => {
  return (
    <AnimatePresence /* initial={false} boleh ditambah kalau mau */>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-45"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="absolute right-6 sm:right-8 md:right-12 top-21 bg-card rounded-2xl px-4 py-6 max-w-100 w-full flex flex-col gap-4 items-center border border-foreground/10 z-50 duration-300"
            role="dialog"
            aria-label="Required Password"
            initial={{ y: "-10%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-10%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 480,
              damping: 42,
              mass: 0.8,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <section
              aria-label="header-modal"
              className="flex justify-between w-full"
            >
              <div className="flex flex-col gap-2">
                <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center text-highlight text-xl font-black">
                  <span>@</span>
                </div>
                <h2 className="font-medium text-lg">{short(accountId)}</h2>
              </div>
              <div className="">
                <button>Out</button>
              </div>
            </section>

            <section
              aria-label="library"
              className="grid grid-cols-2 w-full gap-2"
            >
              <Link
                href={"/my-games"}
                onClick={onClose}
                className="bg-accent/20 hover:bg-accent/30 duration-300 text-highlight w-full rounded-xl p-4 font-medium"
              >
                My Games
              </Link>
              <Link
                href={""}
                onClick={onClose}
                className="bg-accent/20 text-highlight w-full rounded-xl p-4 font-medium opacity-50 cursor-not-allowed"
              >
                My Items
              </Link>
            </section>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
