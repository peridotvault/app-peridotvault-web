"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WalletButtonContainer } from "./ui/WalletButtonContainer";
import { Metamask } from "../services/metamask";
import { WalletItem } from "../types/wallet";
import { buildChallenge } from "@/shared/utils/buildChallenge";
import { SignState } from "../types/sign";
import { Phantom } from "../services/phantom";

type Props = {
  open: boolean;
  onClose: () => void;
  onSigned: (state: SignState) => Promise<void> | void;
};

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export const ConnectModal = ({ open, onClose, onSigned }: Props) => {
  const [loading, setLoading] = useState<null | string>(null);
  const [error, setError] = useState<string | null>(null);

  // Store Wallets
  const metamask = useMemo(() => new Metamask(), []);
  const metamaskDetected = metamask.isMetamaskInstalled();
  const phantom = useMemo(() => new Phantom(), []);
  const phantomkDetected = phantom.isPhantomInstalled();

  const listWallet: WalletItem[] = [
    {
      name: "metamask",
      title: "Metamask",
      logoUrl: "/assets/wallets/metamask.svg",
      downloadUrl: "https://metamask.io/download",
      detected: metamaskDetected,
      onClick: async () => {
        setError(null);
        setLoading("metamask");
        try {
          const message = buildChallenge("PeridotVault Login");
          const signed = await metamask.Login(message);
          await onSigned(signed);
          onClose();
        } catch (e: unknown) {
          const msg =
            e instanceof Error ? e.message : "Failed to connect MetaMask.";
          setError(msg);
        } finally {
          setLoading(null);
        }
      },
    },
    {
      name: "phantom",
      title: "Phantom",
      logoUrl: "/assets/wallets/phantom.svg",
      downloadUrl: "https://phantom.com/download",
      detected: phantomkDetected,
      onClick: async () => {
        setError(null);
        setLoading("phantom");
        try {
          const message = buildChallenge("PeridotVault Login");
          const signed = await phantom.Login(message);
          await onSigned(signed);
          onClose();
        } catch (e: unknown) {
          const msg =
            e instanceof Error ? e.message : "Failed to connect Phantom.";
          setError(msg);
        } finally {
          setLoading(null);
        }
      },
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
            className="bg-card rounded-b-4xl p-8 max-w-130 w-full flex flex-col gap-8 items-center border-x border-b border-foreground/20"
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
                <WalletConnect
                  key={index}
                  isFirst={index == 0}
                  item={item}
                  loading={loading === item.name}
                />
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
          <span className="text-sm font-normal">Comming Soon</span>
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
  loading,
}: {
  isFirst: boolean;
  item: WalletItem;
  loading: boolean;
}) => {
  const handleClick = () => {
    if (loading) return;

    if (item.detected) {
      void item.onClick();
      return;
    }

    // External link: open new tab
    openExternal(item.downloadUrl);
  };
  return (
    <div className="">
      {!isFirst && <hr className="border-foreground/10" />}
      <WalletButtonContainer
        onClick={handleClick}
        className={
          "duration-300 flex items-center justify-between hover:bg-foreground/10 cursor-pointer"
        }
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 aspect-square bg-foreground rounded-md overflow-hidden">
            <img src={item.logoUrl} alt={"Logo" + item.title} />
          </div>
          <span>{item.title}</span>
        </div>
        <div className="text-sm font-normal text-muted-foreground">
          {item.detected ? "Detected" : ""}
        </div>
      </WalletButtonContainer>
    </div>
  );
};
