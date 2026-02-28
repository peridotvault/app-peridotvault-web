import { http } from "@/shared/lib/http";
import { ChainDataResponse } from "../types/chain.type";
import { NetworkType } from "../types/network.type";

export async function getChains(params?: {
    page?: number;
    limit?: number;
    network_type?: NetworkType;
}): Promise<ChainDataResponse> {
    const res = await http.get<ChainDataResponse>("/api/chains", {
        params,
    });

    return res.data;
}
