# Umbra Studio V7 — Validation Status

## Completed in this working session

- V7 change-set TypeScript validation: PASS
- Static import/reference audit: PASS
- No invented publication dates, YouTube URLs, thumbnails, runtime values, or episode canon fields were added
- V6 global motion / scene authority model preserved
- Locked top-level project folder structure preserved

## Full repository validation

The full Umbra Studio repository checkout was not available in this working container, so a complete repository-wide `npm run lint`, `npx tsc --noEmit`, and `npm run build` was not executed here. The V7 package therefore does **not** claim a full-repo green build.

Run these commands from the project root after replacing the files:

```powershell
npm.cmd run lint
npx tsc --noEmit
npm.cmd run build
```

Required final state:

- ESLint: 0 errors, 0 warnings
- TypeScript: PASS
- Next.js production build: PASS
- Routes include `/aktuelno` and `/en/latest`
