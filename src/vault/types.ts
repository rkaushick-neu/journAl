export type EncryptedBlob = {
    ivB64: string;
    ctB64: string;
  };
  
  export type EncryptedEntryEnvelope = {
    id: string;
    date: string; // YYYY-MM-DD
    createdAt: string;
    updatedAt: string;
  
    wrappedEntryKey: EncryptedBlob; // entryKey encrypted with masterKey
    payload: EncryptedBlob;         // entry plaintext encrypted with entryKey
  };