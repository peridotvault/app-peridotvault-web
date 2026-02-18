import { useEffect, useState } from "react";
import { getChains } from "../services/chain.service";
import { ChainData } from "../types/chain.type";
import { NetworkType } from "../types/network.type";

export function useGetChain({ page, limit, network_type }: {
    page?: number;
    limit?: number;
    network_type?: NetworkType;
}): {
    chains: ChainData[];
    isLoading: boolean;
    error: string | null;
} {
    const [chains, setChains] = useState<ChainData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);

                const resAllChains = await getChains({ page, limit, network_type });

                console.log(resAllChains.data.data);

                setChains(resAllChains.data.data);
            } catch {
                setError("Failed to fetch chains");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [page, limit, network_type]);

    return { chains, isLoading, error };
}
