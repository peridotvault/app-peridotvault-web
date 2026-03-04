import Dexie, { Table } from "dexie";
import { authTablesSchema, chainTablesSchema, settingTablesSchema } from "./schema";
import { AuthSessionRow } from "./tables/auth.table";
import { ChainRow } from "./tables/chain.table";
import { SettingRow } from "./tables/setting.table";

class AppDB extends Dexie {
    auth_sessions!: Table<AuthSessionRow, string>;
    chains!: Table<ChainRow, string>;
    settings!: Table<SettingRow, string>;

    constructor() {
        super("web_peridotvault_db");

        this.version(1).stores({
            ...authTablesSchema,
            ...chainTablesSchema,
            ...settingTablesSchema,
        });
    }
}

export const db = new AppDB();
