/* eslint-disable @next/next/no-img-element */
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WalletButtonContainer } from "./ui/WalletButtonContainer";

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
      logoUrl: "/assets/wallets/metamask.svg",
    },
    {
      name: "phantom",
      title: "Phantom",
      logoUrl: "/assets/wallets/phantom.svg",
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
            className="bg-card rounded-b-4xl p-10 max-w-130 w-full flex flex-col gap-8 items-center border-x border-b border-foreground/20"
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
            <div className="flex flex-col items-center text-center">
              <h2 className="text-xl font-medium">Connect a Wallet</h2>
              <p>Connect your wallet to Login PeridotVault</p>
            </div>

            <PeridotWalletConnect />

            <div className="w-full flex justify-center text-center relative">
              <hr className="border-foreground/10 absolute w-full top-1/2" />
              <span className="text-sm text-muted-foreground px-4 z-10 bg-card">
                Other wallets
              </span>
            </div>

            <div className="bg-background w-full rounded-xl overflow-hidden">
              {listWallet.map((item, index) => (
                <WalletConnect key={index} isFirst={index == 0} item={item} />
              ))}
            </div>

            <div className="w-full flex justify-center text-center">
              <span className="text-sm text-muted-foreground">
                By connecting a wallet, you agree to PeridotVault Terms of
                Service and consent to its Privacy Policy
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PeridotWalletConnect = () => {
  return (
    <WalletButtonContainer
      disabled
      className="relative overflow-hidden bg-linear-to-tr from-highlight/80 from-5% to-accent/80 rounded-xl opacity-50 cursor-not-allowed"
    >
      {/* optional: noise / shine */}
      <div className="flex items-center gap-2">
        <div className="h-12 w-12 overflow-hidden">
          <img src="/assets/wallets/peridotwallet.svg" alt="" className="p-2" />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span>Get Peridot Wallet</span>
          <span className="text-sm">Comming Soon</span>
          {/* <span className="text-sm">Available on iOS, Android and Chrome</span> */}
        </div>
      </div>
      <div className=""></div>
    </WalletButtonContainer>
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
      {!isFirst && <hr className="border-foreground/10" />}
      <WalletButtonContainer className="hover:bg-muted-foreground duration-300 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 aspect-square bg-foreground rounded-md overflow-hidden">
            <img src={item.logoUrl} alt={"Logo" + item.title} />
          </div>
          <span>{item.title}</span>
        </div>
        <div className=""></div>
      </WalletButtonContainer>
    </div>
  );
};
