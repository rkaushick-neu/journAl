import { useEffect, useState } from "react";
import { LockedScreen } from "./ui/LockedScreen";
import { EntriesScreen } from "./ui/EntriesScreen";
import { getOrCreateSalt } from "./store/db";
import { unlockVault, isUnlocked } from "./vault/vault";

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [err, setErr] = useState<string | undefined>(undefined);

  useEffect(() => {
    // always start locked
    setUnlocked(isUnlocked());
  }, []);

  async function onUnlock(password: string) {
    try {
      setErr(undefined);
      const salt = await getOrCreateSalt();
      await unlockVault(password, salt);
      setUnlocked(true);
    } catch {
      setErr("Could not unlock. Check password.");
      setUnlocked(false);
    }
  }

  return unlocked ? <EntriesScreen onLock={() => setUnlocked(false)} /> : <LockedScreen onUnlock={onUnlock} error={err} />;
}