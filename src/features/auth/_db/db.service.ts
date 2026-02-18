import { getDB } from "@/shared/db";
import type { Table } from "dexie";
import { AuthSessionRow } from "./db.table";

function table(): Table<AuthSessionRow, string> {
  return getDB().table("auth_session");
}

export async function getSession(): Promise<AuthSessionRow | undefined> {
  try {
    return await table().get("session");
  } catch (error) {
    console.error("[DB] Failed to get session:", error);
    // Fallback: try to get from sessionStorage if IndexedDB fails
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("auth_session_fallback");
        return stored ? JSON.parse(stored) : undefined;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}

export async function setSession(payload: Omit<AuthSessionRow, "id" | "updatedAt">): Promise<AuthSessionRow> {
  const row: AuthSessionRow = {
    id: "session",
    ...payload,
    updatedAt: Date.now(),
  };
  
  try {
    await table().put(row);
  } catch (error) {
    console.error("[DB] Failed to set session in IndexedDB:", error);
    // Fallback: store in sessionStorage if IndexedDB fails
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("auth_session_fallback", JSON.stringify(row));
      } catch (storageError) {
        console.error("[DB] Failed to set session in sessionStorage:", storageError);
      }
    }
  }
  
  return row;
}

export async function updateToken(token: string, expiresAt?: string): Promise<void> {
  try {
    const current = await getSession();
    if (!current) return;
    
    const updated = {
      ...current,
      token,
      expiresAt: expiresAt ?? current.expiresAt,
      updatedAt: Date.now(),
    };
    
    await table().put(updated);
    
    // Also update fallback storage
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("auth_session_fallback", JSON.stringify(updated));
      } catch {
        // Silent fail for fallback
      }
    }
  } catch (error) {
    console.error("[DB] Failed to update token:", error);
  }
}

export async function clearSession(): Promise<void> {
  try {
    await table().delete("session");
  } catch (error) {
    console.error("[DB] Failed to clear session from IndexedDB:", error);
  }
  
  // Also clear fallback storage
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem("auth_session_fallback");
    } catch {
      // Silent fail
    }
  }
}