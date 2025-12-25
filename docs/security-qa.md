# Security QA Checklist — Encrypted Core (M1)

This checklist is used to verify that no journal content
is accessible without the unlock password.

---

## Manual verification steps

### 1. No plaintext at rest
Steps:
1. Create a journal entry with obvious text (e.g. "MY SECRET ENTRY")
2. Save and lock the app
3. Open browser dev tools
4. Inspect:
   - IndexedDB
   - localStorage
   - sessionStorage
   - Cache storage

Expected:
- ❌ "MY SECRET ENTRY" does NOT appear anywhere
- ✅ Only ciphertext / binary / base64 blobs visible

---

### 2. Wrong password behavior
Steps:
1. Refresh the app
2. Enter an incorrect password

Expected:
- App does NOT unlock
- No partial data shown
- Error message is generic

---

### 3. Refresh lock behavior
Steps:
1. Unlock app
2. Open an entry
3. Refresh the page

Expected:
- App returns to Locked state
- Entry content is no longer visible

---

### 4. Memory-only plaintext
Steps:
1. Unlock app
2. Open entry
3. Do NOT save
4. Lock app

Expected:
- Plaintext is lost
- Re-unlock requires decryption again

---

## Out of scope (acknowledged risks)
- Compromised device
- Screen recording
- Keyloggers
- Shoulder surfing

---

## Sign-off
- [ ] No plaintext found in storage
- [ ] Wrong password blocks access
- [ ] Refresh locks app