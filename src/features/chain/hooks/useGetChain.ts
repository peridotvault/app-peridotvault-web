import { ChainRow } from "@/core/db/tables/chain.table";
import { useEffect, useState } from "react";
import { chainService } from "../services/chain.service";

export function useGetChains() {
    const [chains, setChains] = useState<ChainRow[]>([]);

    useEffect(() => {
        chainService.getChains().then(setChains);
    }, []);

    return { chains };
}
