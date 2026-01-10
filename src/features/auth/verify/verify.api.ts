import { http } from "@/shared/lib/http";
import type { VerifyRequest, VerifyResponse } from "./verify.type";
import type { AxiosError } from "axios";

export async function verifyApi(payload: VerifyRequest): Promise<VerifyResponse> {
    try {
        const res = await http.post<VerifyResponse>("/api/auth/verify", payload);
        return res.data;
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = err as AxiosError<any>;
        const backend = e.response?.data;

        if (backend) {
            const backendStr =
                typeof backend === "string" ? backend : JSON.stringify(backend);

            throw new Error(`VERIFY_${e.response?.status}: ${backendStr}`);
        }

        throw err;
    }
}
