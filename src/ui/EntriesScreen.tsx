import { useEffect, useState } from "react";
import { listEntriesByDateDesc, putEntry } from "../store/db";
import { generateEntryKey, wrapEntryKey, encryptEntryText, lockVault } from "../vault/vault";
import type { EncryptedEntryEnvelope } from "../vault/types";

function todayISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function EntriesScreen(props: { onLock: () => void }) {
  const [items, setItems] = useState<EncryptedEntryEnvelope[]>([]);
  const [text, setText] = useState("");

  async function refresh() {
    setItems(await listEntriesByDateDesc());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createTodayEntry() {
    const id = crypto.randomUUID();
    const date = todayISODate();
    const now = new Date().toISOString();

    const entryKey = await generateEntryKey();
    const wrappedEntryKey = await wrapEntryKey(entryKey);
    const payload = await encryptEntryText(entryKey, text || "");

    const env: EncryptedEntryEnvelope = {
      id,
      date,
      createdAt: now,
      updatedAt: now,
      wrappedEntryKey,
      payload,
    };

    await putEntry(env);
    setText("");
    await refresh();
  }

  return (
    <div style={{ maxWidth: 820, margin: "32px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Entries</h2>
        <button
          onClick={() => {
            lockVault();
            props.onLock();
          }}
        >
          Lock
        </button>
      </div>

      <div style={{ margin: "16px 0" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something (we’ll style this later)…"
          style={{ width: "100%", height: 160, padding: 12, fontSize: 16 }}
        />
        <button style={{ marginTop: 8 }} onClick={createTodayEntry}>
          Save as new entry
        </button>
      </div>

      <ul>
        {items.map((it) => (
          <li key={it.id}>
            {it.date} — {it.id.slice(0, 8)}…
          </li>
        ))}
      </ul>
    </div>
  );
}