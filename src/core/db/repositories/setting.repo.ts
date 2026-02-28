import { db } from "..";
import { SettingKey, SettingRow } from "../tables/setting.table";

export const settingsRepo = {
    async get(key: SettingKey): Promise<SettingRow | undefined> {
        return db.settings.get(key);
    },

    async set(key: SettingKey, value: string): Promise<void> {
        await db.settings.put({
            key,
            value,
            updated_at: Date.now(),
        });
    },

    async getValue(key: SettingKey): Promise<string | null> {
        const row = await this.get(key);
        return row?.value ?? null;
    },
};
