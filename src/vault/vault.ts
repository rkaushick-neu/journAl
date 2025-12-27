import type { EncryptedBlob } from "./types";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function b64FromBytes(bytes: Uint8Array): string {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s);
}

function bytesFromB64(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function aesGcmEncrypt(key: CryptoKey, plaintext: Uint8Array): Promise<EncryptedBlob> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  // Fix: Use the underlying ArrayBuffer of the Uint8Array
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
  return { ivB64: b64FromBytes(iv), ctB64: b64FromBytes(new Uint8Array(ct)) };
}

async function aesGcmDecrypt(key: CryptoKey, blob: EncryptedBlob): Promise<Uint8Array> {
  const iv = bytesFromB64(blob.ivB64);
  const ct = bytesFromB64(blob.ctB64);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return new Uint8Array(pt);
}

// ---- Vault session (in-memory only) ----
let masterKey: CryptoKey | null = null;

// You will store this salt in IndexedDB "settings" later.
// For now, generate once and keep stable in db.
export async function deriveMasterKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const pwKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 310000, // strong-ish default; tune if too slow on phone
      hash: "SHA-256",
    },
    pwKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function unlockVault(password: string, salt: Uint8Array) {
  // No logging. Never store password.
  masterKey = await deriveMasterKey(password, salt);

  // Quick verification step (optional, best practice):
  // Later we’ll verify by decrypting a small "vaultCheck" blob.
}

export function lockVault() {
  masterKey = null;
}

export function isUnlocked() {
  return masterKey !== null;
}

export async function generateEntryKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

export async function wrapEntryKey(entryKey: CryptoKey): Promise<EncryptedBlob> {
  if (!masterKey) throw new Error("Vault locked");
  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", entryKey));
  return aesGcmEncrypt(masterKey, raw);
}

export async function unwrapEntryKey(wrapped: EncryptedBlob): Promise<CryptoKey> {
  if (!masterKey) throw new Error("Vault locked");
  const raw = await aesGcmDecrypt(masterKey, wrapped);
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
}

export async function encryptEntryText(entryKey: CryptoKey, text: string): Promise<EncryptedBlob> {
  return aesGcmEncrypt(entryKey, textEncoder.encode(text));
}

export async function decryptEntryText(entryKey: CryptoKey, blob: EncryptedBlob): Promise<string> {
  const pt = await aesGcmDecrypt(entryKey, blob);
  return textDecoder.decode(pt);
}