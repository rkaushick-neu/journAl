# Architecture Overview — Encrypted Journal V1

This app is local-first and privacy-first.
Architecture prioritizes clear boundaries between concerns.

---

## High-level layers

### 1. Vault Layer
Responsibilities:
- Password handling
- Key derivation
- Encryption / decryption
- In-memory session state

Rules:
- Never persists plaintext
- Never exposes keys to UI
- All crypto happens here

Example responsibilities:
- unlock(password)
- lock()
- encryptEntry(plaintext)
- decryptEntry(encryptedPayload)

---

### 2. Storage Layer
Responsibilities:
- IndexedDB access
- CRUD for encrypted blobs
- No crypto logic

Rules:
- Treats encrypted data as opaque
- Never attempts to interpret content

---

### 3. Domain Layer
Responsibilities:
- Entry models
- Business rules (e.g. one entry per date)
- Mapping decrypted content to UI-safe structures

Rules:
- No direct IndexedDB access
- No password knowledge

---

### 4. UI Layer
Responsibilities:
- Screens (Locked, Entries, Editor)
- User interactions
- Theme rendering

Rules:
- Never touches raw storage
- Never sees encryption keys
- Receives decrypted text only after unlock

---

## Data flow (write)
UI → Domain → Vault (encrypt) → Storage

## Data flow (read)
Storage → Vault (decrypt) → Domain → UI

---

## Explicit non-goals for V1
- Cloud sync
- Background services
- Analytics