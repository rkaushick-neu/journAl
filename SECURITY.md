# Security Policy

This project is a **local-first, end-to-end encrypted** journaling app. The goal is to ensure journal entries are not readable without the user’s unlock secret.

## Supported Versions
Security fixes will be applied to the latest version on the `main` branch.

## Reporting a Vulnerability
If you believe you found a security or privacy issue, please report it **privately**.

- Create a GitHub issue **only if** it does not include sensitive details.
- For sensitive reports, contact the maintainer directly:
  - Email: `rishabh.kaushick.projects@gmail.com`
  - Subject: `Security report: journAl`

Please include:
- What the issue is and why it matters
- Steps to reproduce (no personal journal text)
- Affected browsers/devices
- Any proof-of-concept (safe/sanitized)

## Scope (what we consider a security issue)
Examples:
- Journal content stored in plaintext anywhere (IndexedDB, localStorage, logs, caches)
- Password/master key exposure
- Weak crypto usage or incorrect key derivation
- XSS or injection that could exfiltrate decrypted content
- Accidental network transmission of journal content
- Misconfigured cloud sync (if/when added)

## Out of scope
- Compromised device (malware/keylogger with full access)
- Someone who knows the user’s password
- Issues requiring physical access to an unlocked device

## Safe handling guidelines
- Never request users to share journal content for debugging.
- Avoid asking for screenshots that include personal text.
- Do not introduce analytics or telemetry without explicit opt-in.