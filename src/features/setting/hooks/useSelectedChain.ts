"use client";

import { useEffect, useState } from "react";
import { chainSelectionService } from "../services/chainSelection.service";

export function useSelectedChain() {
    const [chainId, setChainId] = useState<string | null>(null);

    useEffect(() => {
        chainSelectionService.getSelectedChain().then(setChainId);
    }, []);

    const setSelectedChain = async (id: string) => {
        await chainSelectionService.setSelectedChain(id);
        setChainId(id);
    };

    return {
        chainId,
        setSelectedChain,
    };
}
