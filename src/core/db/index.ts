import Dexie, { Table } from "dexie";
import { authTablesSchema, chainTablesSchema } from "./schema";
import { AuthSessionRow } from "./tables/auth.table";
import { ChainRow } from "./tables/chain.table";

class AppDB extends Dexie {
    auth_sessions!: Table<AuthSessionRow, string>;
    chains!: Table<ChainRow, string>;

    constructor() {
        super("web_peridotvault_db");

        this.version(1).stores({
            ...authTablesSchema,
            ...chainTablesSchema,
        });
    }
}

export const db = new AppDB();
