"use client";

import { useEffect, useState } from "react";
import { networkService } from "../services/network.service";
import { NetworkTypeApi } from "@/core/api/chain.api.type";

export function useNetwork() {
    const [network, setNetworkState] = useState<NetworkTypeApi>("testnet");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function load() {
            const value = await networkService.getNetwork();

            if (mounted) {
                setNetworkState(value);
                setLoading(false);
            }
        }

        load();

        return () => {
            mounted = false;
        };
    }, []);

    const setNetwork = async (value: NetworkTypeApi) => {
        await networkService.setNetwork(value);
        setNetworkState(value);
    };

    return {
        network,
        setNetwork,
        loading,
    };
}
