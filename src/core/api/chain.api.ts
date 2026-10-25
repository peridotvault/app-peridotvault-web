import { http } from "@/shared/lib/http";
import { ChainApi, ChainDetailsApi, NetworkTypeApi } from "./chain.api.type";
import { ApiResponse, ApiResponseWithPagination } from "./types/response.type";
import { normalizeAssetUrl } from "@/shared/utils/helper.url";

function normalizeChain<T extends ChainApi>(chain: T): T {
  return { ...chain, icon_url: normalizeAssetUrl(chain.icon_url) };
}

export async function getAllChainsApi(params?: {
    page?: number;
    limit?: number;
    network_type?: NetworkTypeApi;
}): Promise<ChainApi[]> {
    const res = await http.get<ApiResponseWithPagination<ChainApi>>("/api/v1/chains", {
        params,
    });

    return (res.data?.data?.data ?? []).map(normalizeChain);
}

export async function getChainDetailsApi(params: {
    caip_2_id: string;
}): Promise<ChainDetailsApi> {
    const res = await http.get<ApiResponse<ChainDetailsApi>>(`/api/v1/chains/${params.caip_2_id}`);

    return normalizeChain(res.data.data);
}
