import { http } from "@/shared/lib/http";
import { ChainApi, ChainDetailsApi, NetworkTypeApi } from "./chain.api.type";
import { ApiResponse, ApiResponseWithPagination } from "./types/response.type";

export async function getAllChainsApi(params?: {
    page?: number;
    limit?: number;
    network_type?: NetworkTypeApi;
}): Promise<ChainApi[]> {
    const res = await http.get<ApiResponseWithPagination<ChainApi>>("/api/chains", {
        params,
    });

    return res.data.data.data;
}

export async function getChainDetailsApi(params: {
    caip_2_id: string;
}): Promise<ChainDetailsApi> {
    const res = await http.get<ApiResponse<ChainDetailsApi>>(`/api/chains/${params.caip_2_id}`);

    return res.data.data;
}
