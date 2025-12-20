# Contributing

Thanks for your interest in contributing.

This project is a privacy-first, end-to-end encrypted journaling app. The main priority is: **never leak plaintext journal content**.

## Quick start
- Install dependencies: `npm install`
- Run the dev server: `npm run dev`
- Run checks: `npm run lint` (and `npm run test` if available)

## What to work on
- Check the GitHub Project board and issues.
- Prefer small PRs that do one thing.

## Coding principles
- Keep features **offline-first**.
- Keep the “vault” (crypto + storage) separate from UI and AI code.
- Avoid adding dependencies unless clearly necessary.

## Privacy rules (non-negotiable)
- **Do not log** journal text, decrypted content, or derived embeddings.
- Do not add analytics/telemetry.
- Do not send journal content to any network service.
- Be careful with error messages: never include plaintext.

## Security & crypto changes
If your change touches cryptography, key derivation, storage format, or authentication:
- Explain the change clearly in the PR description.
- Include test coverage for:
  - correct encryption/decryption
  - wrong-password behavior
  - “no plaintext at rest” checks (at least basic)

## Commit & PR style
- Use clear, descriptive commit messages.
- In PRs, include:
  - What changed
  - Why it changed
  - How to test it

## Reporting bugs
When filing an issue:
- **Do not paste journal content**.
- Prefer minimal repro steps, screenshots of UI only (no personal text).
- Include browser/OS and steps to reproduce.