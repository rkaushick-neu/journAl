import { openDB } from "idb";
import type { EncryptedEntryEnvelope } from "../vault/types";

export const DB_NAME = "journalVault";
export const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("entries")) {
      const store = db.createObjectStore("entries", { keyPath: "id" });
      store.createIndex("date", "date", { unique: false });
    }
    if (!db.objectStoreNames.contains("settings")) {
      db.createObjectStore("settings", { keyPath: "id" });
    }
  },
});

export type SettingsRecord = { id: "vault-salt"; saltB64: string };

export async function getOrCreateSalt(): Promise<Uint8Array> {
  const db = await dbPromise;
  const existing = (await db.get("settings", "vault-salt")) as SettingsRecord | undefined;

  if (existing?.saltB64) {
    const bin = atob(existing.saltB64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  let s = "";
  salt.forEach((b) => (s += String.fromCharCode(b)));
  await db.put("settings", { id: "vault-salt", saltB64: btoa(s) } satisfies SettingsRecord);
  return salt;
}

export async function putEntry(env: EncryptedEntryEnvelope) {
  const db = await dbPromise;
  await db.put("entries", env);
}

export async function getEntry(id: string): Promise<EncryptedEntryEnvelope | undefined> {
  const db = await dbPromise;
  return (await db.get("entries", id)) as EncryptedEntryEnvelope | undefined;
}

export async function listEntriesByDateDesc(): Promise<EncryptedEntryEnvelope[]> {
  const db = await dbPromise;
  const all = (await db.getAll("entries")) as EncryptedEntryEnvelope[];
  return all.sort((a, b) => (a.date < b.date ? 1 : -1));
}