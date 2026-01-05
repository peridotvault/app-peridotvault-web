import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WalletContainer } from "./ui/WalletContainer";

type Props = {
  open: boolean;
  onClose: () => void;
};

type WalletProps = {
  name: string;
  title: string;
  logoUrl: string;
};

export const ConnectModal = ({ open, onClose }: Props) => {
  const listWallet: WalletProps[] = [
    {
      name: "metamask",
      title: "Metamask",
      logoUrl: "",
    },
    {
      name: "phantom",
      title: "Phantom",
      logoUrl: "",
    },
  ];

  return (
    <AnimatePresence /* initial={false} boleh ditambah kalau mau */>
      {open && (
        <motion.div
          className="backdrop-blur-sm top-0 left-0 bg-black/50 fixed z-50 w-full h-full flex justify-center items-start"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Panel (slide from left) */}
          <motion.div
            className="bg-card rounded-b-lg p-10 w-[400px] flex flex-col gap-4 items-center border border-foreground/20"
            role="dialog"
            aria-label="Required Password"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 480,
              damping: 42,
              mass: 0.8,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg">Connect a Wallet</h2>

            <PeridotWalletConnect />

            <span className="text-sm">Other wallets</span>

            <div className="bg-background w-full rounded-xl">
              {listWallet.map((item, index) => (
                <WalletConnect key={index} isFirst={index == 0} item={item} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PeridotWalletConnect = () => {
  return (
    <WalletContainer className="bg-linear-to-tr from-accent-foreground from-10% to-accent rounded-xl">
      Get Peridot Wallet
    </WalletContainer>
  );
};

const WalletConnect = ({
  isFirst,
  item,
}: {
  isFirst: boolean;
  item: WalletProps;
}) => {
  return (
    <div className="">
      {!isFirst && <hr className="border-white/10" />}
      <WalletContainer className="hover:bg-background">
        {item.title}
      </WalletContainer>
    </div>
  );
};
