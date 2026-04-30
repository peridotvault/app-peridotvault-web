# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 app using the App Router and TypeScript. Route files live in `src/app`, including the vault route group in `src/app/(vault)` and SEO helpers in `src/app/_seo`. Shared UI, hooks, styles, constants, types, and utilities live under `src/shared`. Domain-specific code belongs in `src/features/<domain>`, while infrastructure and integration code lives in `src/core`, including API clients, Dexie database tables/repositories, blockchain services, modals, and toast utilities. Static assets are in `public`, with wallet assets in `public/assets/wallets`, images in `public/images`, brand assets in `public/brand`, and sounds in `public/sounds`. Vendored local packages are stored in `vendor`.

## Build, Test, and Development Commands

Use `pnpm` because this repository includes `pnpm-lock.yaml`.

- `pnpm dev`: start the local Next.js development server.
- `pnpm build`: create a production build and run Next.js type/build checks.
- `pnpm start`: serve the production build locally after `pnpm build`.
- `pnpm lint`: run ESLint using `eslint.config.mjs`.

Docker files are present for containerized builds: `Dockerfile` and `docker-compose.yml`.

## Coding Style & Naming Conventions

Write TypeScript/TSX with `strict` mode in mind. Use the `@/*` path alias for imports from `src`, for example `@/shared/utils/token`. Follow existing naming patterns: React components use `PascalCase.tsx`, hooks use `useThing.ts`, stores use `*.store.ts`, services use `*.service.ts`, API clients use `*.api.ts`, API types use `*.api.type.ts`, and database files use `*.table.ts` or `*.repo.ts`. Keep feature-specific code inside its feature folder and reusable primitives in `src/shared`.

## Testing Guidelines

No test runner or test script is currently configured. For now, verify changes with `pnpm lint` and `pnpm build`. When adding tests, colocate them near the code they cover using `*.test.ts` or `*.test.tsx`, and add a `pnpm test` script in `package.json` as part of the same change.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit-style prefixes such as `feat:` and `fix:`. Keep commit subjects short and imperative, for example `fix: logout auth` or `feat: add purchase service on solana`. Pull requests should include a clear summary, verification steps (`pnpm lint`, `pnpm build`, manual checks), linked issues when applicable, and screenshots or recordings for UI changes.

## Security & Configuration Tips

Do not commit secrets, private keys, or wallet credentials. Keep chain, API, and network configuration centralized in the existing `src/core`, `src/features/setting`, and `src/shared/constants` modules. Treat `vendor/antigane-wallet-adapters-0.1.2.tgz` as a pinned local dependency; update it intentionally and document why.
