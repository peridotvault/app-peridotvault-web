import { db } from "..";
import { AuthSessionRow } from "../tables/auth.table";

export const authRepo = {
    async getSession() {
        return db.auth_sessions.get("session");
    },

    async setSession(payload: Omit<AuthSessionRow, "id" | "updated_at">) {
        const row: AuthSessionRow = {
            id: "session",
            ...payload,
            updated_at: Date.now(),
        };

        await db.auth_sessions.put(row);
        return row;
    },

    async updateToken(token: string, expires_at?: string) {
        const current = await this.getSession();
        if (!current) return;

        return db.auth_sessions.put({
            ...current,
            token,
            expires_at: expires_at ?? current.expires_at,
            updated_at: Date.now(),
        });
    },

    async clearSession() {
        await db.auth_sessions.delete("session");
    },
};
