import { create } from "zustand";
import { ChainKey } from "../types/chain";
import { DEFAULT_CHAIN_KEY } from "../constants/chain";


interface ChainState {
    chainKey: ChainKey;
    setChain: (chainKey: ChainKey) => void;
}

export const useChainStore = create<ChainState>((set) => ({
    chainKey: DEFAULT_CHAIN_KEY,
    setChain: (chainKey) => set({ chainKey }),
}));
