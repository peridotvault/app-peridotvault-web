import { create } from "zustand";
import { ChainId } from "../types/chain";


interface ChainState {
    chain: ChainId;
    setChain: (chain: ChainId) => void;
}

export const useChainStore = create<ChainState>((set) => ({
    chain: "ethereum",
    setChain: (chain) => set({ chain }),
}));
