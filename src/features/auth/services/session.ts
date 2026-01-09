import { db } from "@/shared/db";
import { AUTH_SESSION_TABLE, AuthSessionRow } from "../types/db.table";

export async function getSession() {
    return db.table<AuthSessionRow, string>(AUTH_SESSION_TABLE).get("session");
}

export async function setSession(accessToken: string, refreshToken: string) {
    const row: AuthSessionRow = {
        id: "session",
        accessToken,
        refreshToken,
        updatedAt: Date.now(),
    };
    await db.table<AuthSessionRow, string>(AUTH_SESSION_TABLE).put(row);
    return row;
}

export async function clearSession() {
    await db.table<AuthSessionRow, string>(AUTH_SESSION_TABLE).delete("session");
}
