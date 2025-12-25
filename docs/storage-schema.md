# Storage Schema — Encrypted Journal V1

This document defines how data is stored locally.
All sensitive content MUST be encrypted before storage.

## Storage medium
- IndexedDB
- No usage of localStorage for journal content
- No plaintext persistence anywhere

---

## Database: journalVault (conceptual)

### Object Store: `entries`
Stores encrypted journal entries.

Fields:
- `id` (string, UUID)
- `date` (string, ISO date, e.g. "2025-01-18")
- `ciphertext` (ArrayBuffer | base64 string)
- `iv` (ArrayBuffer | base64 string)
- `wrappedEntryKey` (ArrayBuffer | base64 string)
- `createdAt` (ISO timestamp)
- `updatedAt` (ISO timestamp)

Rules:
- ❌ No plaintext title or body stored
- ❌ No derived summaries stored in plaintext
- ✅ Date is allowed as metadata
- ✅ Entry length is indirectly inferable (acceptable for V1)

---

### Object Store: `settings`
Stores non-sensitive preferences.

Fields:
- `id` (fixed key, e.g. "app-settings")
- `theme` (string)
- `lineStyle` ("lined" | "grid" | "blank")
- `fontSize` ("s" | "m" | "l")

Rules:
- Must NOT include password or keys
- Safe to store unencrypted

---

## Storage rules (non-negotiable)
- Journal content exists in plaintext only:
  - in memory
  - after successful unlock
- Clearing browser storage removes access to all entries
- IndexedDB inspection must show ciphertext only

---

## Versioning
- Schema versioning can be added later
- V1 assumes single schema version