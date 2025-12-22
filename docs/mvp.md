# MVP Definition — Encrypted Journal V1

## Goal
A private, distraction-free journaling app that feels like writing on paper,
stores everything encrypted, and provides gentle therapeutic reflection —
all running locally.

## In scope (must-have)
- Password-based lock/unlock
- Create, edit, and read journal entries by date
- All journal content encrypted at rest
- Works offline
- Paper-like writing UI:
  - Title, date, handwriting-style body
  - Theme: background color + lined/grid/blank
- Local AI reflection:
  - Short reflection
  - Emotional mirror
  - 2–3 reflective questions to continue writing
- No network calls
- No analytics

## Explicitly out of scope (for V1)
- Cloud sync
- Multi-device support
- Account recovery
- Advanced search
- Voice input
- Collaboration

## Definition of “done”
- Clearing browser storage removes access to entries
- Inspecting storage shows no plaintext
- Wrong password cannot decrypt data
- App is usable on laptop and phone browser