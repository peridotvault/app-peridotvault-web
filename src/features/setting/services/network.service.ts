
import { NetworkTypeApi } from "@/core/api/chain.api.type";
import { settingsRepo } from "@/core/db/repositories/setting.repo";
import { DEFAULT_NETWORK } from "@/shared/constants/default";

export const networkService = {
    async getNetwork(): Promise<NetworkTypeApi> {
        const value = await settingsRepo.getValue("network");

        if (!value) return DEFAULT_NETWORK;

        return value as NetworkTypeApi;
    },

    async setNetwork(network: NetworkTypeApi): Promise<void> {
        await settingsRepo.set("network", network!);
    },
};
