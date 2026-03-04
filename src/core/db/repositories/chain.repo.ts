import { db } from "..";
import { ChainRow } from "../tables/chain.table";

export const chainRepo = {
    // 🔹 Get all chains
    async getAll(): Promise<ChainRow[]> {
        return db.chains.toArray();
    },

    // 🔹 Get by CAIP-2 ID
    async getById(caip2Id: string): Promise<ChainRow | undefined> {
        return db.chains.get(caip2Id);
    },

    // 🔹 Get by namespace (evm / solana)
    async getByNamespace(namespace: string): Promise<ChainRow[]> {
        return db.chains.where("namespace").equals(namespace).toArray();
    },

    // 🔹 Get testnet / mainnet
    async getByTestnet(isTestnet: boolean): Promise<ChainRow[]> {
        return db.chains.filter(chain => chain.is_testnet === isTestnet).toArray();
    },

    // 🔹 Save single chain
    async save(chain: ChainRow): Promise<ChainRow> {
        await db.chains.put(chain);
        return chain;
    },

    // 🔹 Bulk insert/update
    async bulkSave(chains: ChainRow[]): Promise<void> {
        await db.chains.bulkPut(chains);
    },

    // 🔹 Delete one
    async delete(caip2Id: string): Promise<void> {
        await db.chains.delete(caip2Id);
    },

    // 🔹 Clear all
    async clear(): Promise<void> {
        await db.chains.clear();
    },
};
