import { useState } from "react";

export function LockedScreen(props: { onUnlock: (password: string) => Promise<void>; error?: string }) {
  const [pw, setPw] = useState("");

  return (
    <div style={{ maxWidth: 420, margin: "64px auto", padding: 16 }}>
      <h1>Journal Vault</h1>
      <p>Enter your password to unlock.</p>

      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Password"
        style={{ width: "100%", padding: 12, fontSize: 16 }}
      />

      <button
        style={{ marginTop: 12, width: "100%", padding: 12, fontSize: 16 }}
        onClick={() => props.onUnlock(pw)}
      >
        Unlock
      </button>

      {props.error ? <p style={{ marginTop: 12 }}>{props.error}</p> : null}
    </div>
  );
}