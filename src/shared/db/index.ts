import Dexie, { Table } from "dexie";
// import {
//   GAME_CACHE_TABLE,
//   GameCacheRow,
//   gameTablesSchemaV1,
// } from "@/features/game/db/game.table";
import { AUTH_SESSION_TABLE, AuthSessionRow } from "@/features/auth/types/db.table";
import { authTablesSchemaV1 } from "@/features/auth/constants/db.schema";

class AppDB extends Dexie {
    // tables (typed)
    [AUTH_SESSION_TABLE]!: Table<AuthSessionRow, string>;
    //   [GAME_CACHE_TABLE]!: Table<GameCacheRow, string>;

    constructor() {
        super("app_peridotvault_db");

        this.version(1).stores({
            ...authTablesSchemaV1,
            //   ...gameTablesSchemaV1,
        });
    }
}

export const db = new AppDB();
