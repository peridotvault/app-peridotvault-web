# Agentic Engineering Grant Application Draft

Submit here: https://superteam.fun/earn/grants/agentic-engineering

Source checked on April 29, 2026: the grant is open, global, and lists a 200 USDG cheque size.

## Step 1: Basics

**Project Title**

> PeridotVault

**One Line Description**

> PeridotVault is a game distribution platform where players share games and earn from the sales they drive.

**TG username**

> t.me/ranaufalmuha

**Wallet Address**

> 8wTgZLfsJon5ZFxiBgS94tnG6TEV9WhcmcsddvNb4gzV

## Step 2: Details

**Project Details**

> Many games struggle to reach new players because discovery still depends too much on ads, algorithms, and storefront visibility. PeridotVault solves this by turning players into a growth channel. Players can share the games they love and earn from the sales they drive, while streamers get a clear reason to play and promote games that help them earn too.
>
> PeridotVault gives players a familiar game-store experience: featured games, top games, category/search navigation, detailed game pages, payment-token selection, and a protected "My Games" library tied to the connected wallet. The distribution layer expands that experience beyond a storefront by making every player or streamer a potential sales channel for games they already enjoy.
>
> The current build focuses on the onchain purchase path for Solana while keeping the architecture multi-chain. The web app includes Solana wallet integration, SVM program IDs/IDL/types, PDA/account resolution, a `buyGame` instruction builder, a Solana purchase service that signs and confirms transactions through Phantom or the PeridotWallet bridge, and backend purchase lifecycle APIs for pending/completed purchases. The same purchase abstraction also routes EVM purchases, giving PeridotVault a chain-agnostic interface for game licensing.
>
> The Agentic Engineering Grant will support the next sprint: hardening the Solana purchase flow, fixing build/lint blockers, shipping a public demo, preparing a Colosseum submission, and documenting the AI-assisted development process with exported Codex/Claude session transcripts.

**Deadline**

> May 6, 2026, 23:59 Asia/Calcutta

**Proof of Work**

> GitHub repo: https://github.com/peridotvault/app-peridotvault-web
>
> Live app URL from project metadata: https://web.peridotvault.com
>
> AI-assisted development transcript files exported to the project root on April 29, 2026: `./codex-session.jsonl` and `./claude-session.jsonl`. Attach one or both to the grant form.
>
> Recent shipped work from git history includes: `feat: add agents and solana idl, types`, `feat: add library and buy game`, `feat: add purchase service on solana`, `fix: buy game with solana`, `feat: add buy game on solana`, `feat: connect with iframe parent for desktop`, `feat: add chain solana setup, and add embed consistency`, `feat: add vaultbar and fix search bar`, and `fix: login with phantom`.
>
> Implemented technical scope includes a Next.js 16 App Router web app, game vault routes, game detail pages, protected wallet-based library pages, backend API clients for games/purchases/library/events, Solana SVM purchase services, exported Solana IDL/types, PeridotWallet/Phantom wallet support, EVM purchase service support, chain selection, and wallet-auth/logout/profile flows.
>
> Current verification attempt on April 29, 2026: `pnpm lint` and `pnpm build` were run locally. Lint is currently blocked by three `@typescript-eslint/no-explicit-any` errors in API/library files. Build is currently blocked by a missing `src/core/blockchain/svm/idl/pgc1.json` import and sandbox-restricted Google Font fetches. These are listed as pre-submission hardening items in the milestones below.

**Personal X Profile**

> x.com/ranaufalmuha

**Personal GitHub Profile**

> github.com/ranaufalmuha

**Colosseum Crowdedness Score**

> https://drive.google.com/file/d/1bGkb4mJOHkPJ_cSEZ883HlcRSmUuM1hQ/view?usp=sharing

**AI Session Transcript**

> Attach `./codex-session.jsonl` and/or `./claude-session.jsonl` from the project root. These were exported on April 29, 2026 as proof of AI-assisted development.

## Step 3: Milestones

**Goals and Milestones**

> 1. April 30, 2026: Fix current build and lint blockers, including `pgc1.json`/`pgl1.json` IDL consistency and strict TypeScript errors in purchase/library API code.
> 2. May 2, 2026: Harden the Solana purchase flow end to end: wallet connection, context resolution, duplicate-license checks, transaction signing strategy, confirmation handling, and backend purchase completion.
> 3. May 4, 2026: Complete the player library loop so a successful onchain purchase reliably appears in "My Games" with the purchased game metadata and ownership state.
> 4. May 5, 2026: Prepare public demo evidence: deployed web URL, GitHub repo, short walkthrough, transaction proof on devnet/mainnet as appropriate, and AI session transcript attachment.
> 5. May 6, 2026: Submit Colosseum project materials, Crowdedness Score screenshot link, final GitHub link, and grant completion proof.

**Primary KPI**

> Complete 10 successful Solana game purchase transactions through the PeridotVault web app, with each purchase creating a backend purchase record and appearing in the buyer's "My Games" library.

**Final tranche checkbox**

> I understand that to receive the final tranche I must submit the Colosseum project link, GitHub repo, and AI subscription receipt.
