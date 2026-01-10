import { db } from "@/shared/db";
import type { Table } from "dexie";
import { AuthSessionRow } from "./db.table";

function table(): Table<AuthSessionRow, string> {
  return db.table("auth_session");
}

export async function getSession() {
  return table().get("session");
}

export async function setSession(payload: Omit<AuthSessionRow, "id" | "updatedAt">) {
  const row: AuthSessionRow = {
    id: "session",
    ...payload,
    updatedAt: Date.now(),
  };
  await table().put(row);
  return row;
}

export async function updateToken(token: string, expiresAt?: string) {
  const current = await getSession();
  if (!current) return;
  await table().put({
    ...current,
    token,
    expiresAt: expiresAt ?? current.expiresAt,
    updatedAt: Date.now(),
  });
}

export async function clearSession() {
  await table().delete("session");
}