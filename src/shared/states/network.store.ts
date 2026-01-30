import { create } from "zustand";
import type { ChainNetwork } from "@/shared/types/chain";

interface NetworkState {
  network: ChainNetwork;
  setNetwork: (network: ChainNetwork) => void;
  toggleNetwork: () => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  network: "testnet",
  setNetwork: (network) => set({ network }),
  toggleNetwork: () =>
    set((state) => ({
      network: state.network === "testnet" ? "mainnet" : "testnet",
    })),
}));
