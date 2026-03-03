import { http } from "@/shared/lib/http";
import { BuyGameParams, Purchase } from "./purchase.api.type";
import { ApiResponse } from "./types/response.type";

export async function postGamePurchaseApi(params?: BuyGameParams): Promise<ApiResponse<Purchase>> {
    const res = await http.get<ApiResponse<Purchase>>("/api/chains", {
        params,
    });

    return res.data;
}
