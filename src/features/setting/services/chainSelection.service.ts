import { settingsRepo } from "@/core/db/repositories/setting.repo";

export const chainSelectionService = {
    async getSelectedChain(): Promise<string | null> {
        return await settingsRepo.getValue("selected_chain");
    },

    async setSelectedChain(caip2Id: string): Promise<void> {
        await settingsRepo.set("selected_chain", caip2Id);
    },
};
