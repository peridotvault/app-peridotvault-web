import {
    getAllChainsApi,
    getChainDetailsApi,
} from "@/core/api/chain.api";
import { chainRepo } from "@/core/db/repositories/chain.repo";
import { TTL } from "@/shared/constants/duration";
import { ChainRow } from "@/core/db/tables/chain.table";
import { networkService } from "@/features/setting/services/network.service";
import { NetworkTypeApi } from "@/core/api/chain.api.type";

export const chainService = {
    async getChains(): Promise<ChainRow[]> {
        const local = await chainRepo.getAll();

        // first load
        if (local.length === 0) {
            return await this.syncAndReturn();
        }

        // background sync
        if (await this.shouldSync(local)) {
            this.syncChains();
        }

        return local;
    },

    async getDefaultChain(network: NetworkTypeApi): Promise<ChainRow | null> {
        const chains = await this.getChains();

        if (network === "testnet") {
            return chains.find(c => c.is_testnet) ?? chains[0];
        }

        if (network === "mainnet") {
            return chains.find(c => !c.is_testnet) ?? chains[0];
        }

        return chains[0];
    },

    async syncAndReturn(): Promise<ChainRow[]> {
        const data = await this.fetchDetailedChains();
        await chainRepo.bulkSave(data);
        return data;
    },

    async syncChains(): Promise<void> {
        try {
            const data = await this.fetchDetailedChains();
            await chainRepo.bulkSave(data);
        } catch (err) {
            console.error("chain sync failed", err);
        }
    },

    async fetchDetailedChains(): Promise<ChainRow[]> {
        const network = await networkService.getNetwork();
        const base = await getAllChainsApi({ network_type: network });

        // ⚠️ N+1 handling simple version
        const detailed = await Promise.all(
            base.map(c =>
                getChainDetailsApi({ caip_2_id: c.caip_2_id })
            )
        );

        // ✅ NO MAPPER (karena shape sama)
        return detailed;
    },

    async shouldSync(local: ChainRow[]): Promise<boolean> {
        if (local.length === 0) return true;

        const lastUpdate = Math.max(
            ...local.map(c => new Date(c.updated_at).getTime())
        );

        return Date.now() - lastUpdate > TTL;
    },
};
