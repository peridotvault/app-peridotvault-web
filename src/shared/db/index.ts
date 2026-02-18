import Dexie, { Table } from "dexie";
// import {
//   GAME_CACHE_TABLE,
//   GameCacheRow,
//   gameTablesSchemaV1,
// } from "@/features/game/db/game.table";
import { AUTH_SESSION_TABLE, AuthSessionRow } from "@/features/auth/_db/db.table";
import { authTablesSchemaV1 } from "@/features/auth/_db/db.schema";

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

// Lazy singleton pattern to prevent multiple instances
let dbInstance: AppDB | null = null;
let initializationError: Error | null = null;

export function getDB(): AppDB {
    // Return existing instance if already created
    if (dbInstance) {
        return dbInstance;
    }

    // If previous initialization failed, throw the cached error
    if (initializationError) {
        throw initializationError;
    }

    // Check if we're in browser environment
    if (typeof window === "undefined") {
        const error = new Error("IndexedDB is only available in browser environment");
        initializationError = error;
        throw error;
    }

    try {
        // Create new instance with error handling for SES lockdown
        dbInstance = new AppDB();
        return dbInstance;
    } catch (error) {
        // Cache the error to avoid repeated initialization attempts
        initializationError = error instanceof Error ? error : new Error(String(error));
        console.error("[Dexie] Failed to initialize database:", initializationError);
        throw initializationError;
    }
}

// Backward compatibility: export db for legacy code
export const db = new Proxy({} as AppDB, {
    get(_target, prop) {
        const instance = getDB();
        return instance[prop as keyof AppDB];
    }
});
