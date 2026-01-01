# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PeridotVault Web is a Next.js 16 game storefront application built with React 19, TypeScript, and Tailwind CSS. It consumes the PeridotVault API to display and sell blockchain-based games.

**Tech Stack:**
- Next.js 16 with App Router (Server Components + Client Components pattern)
- React 19
- TypeScript 5 with strict mode
- Tailwind CSS 4 (with new @tailwindcss/postcss plugin)
- Axios for HTTP requests
- Font Awesome icons
- Docker for deployment

**Architecture:**
- Feature-based folder structure under `src/features/`
- Shared utilities, components, and types under `src/shared/`
- Client-side data fetching with custom React hooks
- Axios instance configured in `src/shared/lib/http.ts`

## Development Commands

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Project Structure

### `src/app/`
Next.js App Router pages using route groups:
- `(main)/` - Main application routes (home, game detail pages)
  - `[gameName]/[gameId]/page.tsx` - Dynamic game detail page
  - `page.tsx` - Home page with game listings
  - `_components/` - Page-specific components (VaultCarousel, TopGames)
  - `_services/` - Page-specific data fetching services
- `layout.tsx` - Root layout with Geist fonts
- `studio/` - Studio dashboard for game developers (protected routes)

### `src/features/`
Feature-specific modules following a domain-driven pattern:
- `game/` - Game-related feature
  - `hooks/` - Custom React hooks (useGameDetail, usePublishedGames, useBannerGames, useTopGames)
  - `services/` - API calls (detail.ts, published.ts, banner.ts, topGames.ts)
  - `interfaces/` - TypeScript types (Game, GamePreview, GameDistribution, Banner)
- `auth/` - Authentication feature (wallet-based)
  - `context/` - AuthContext for global auth state management
  - `hooks/` - useAuth hook for accessing auth state
  - `services/` - API calls (verifySignature, getUserProfile, logout, refreshToken)
  - `interfaces/` - TypeScript types (AuthCredentials, AuthResponse, etc.)
  - `utils/` - Token and error handling utilities
  - `components/` - Auth-related UI components (ConnectPeridotButton)
- `studio/` - Studio management feature
  - `hooks/` - Custom hooks for studio data (useUserGames, useCreateGame, etc.)
  - `services/` - API calls for studio operations
  - `interfaces/` - TypeScript types for studio entities
  - `_components/` - Studio-specific UI components

### `src/shared/`
Cross-cutting concerns:
- `components/` - Reusable UI components (VerticalCard, CoinWithAmount, Typography components)
- `hooks/` - Shared hooks (useCategories)
- `lib/` - Core libraries (http.ts - configured Axios instance with auth interceptors)
- `utils/` - Utility functions (calculation.ts, coin.ts, formatUrl.ts)
- `interfaces/` - Shared TypeScript types (ApiResponse, Pagination, Category, Coin)
- `constants/` - Application constants (image loading fallbacks)
- `middleware/` - Client-side route protection (ProtectStudioRoute)

## Important Patterns

### Data Fetching
- All API calls use the centralized Axios instance from `@/shared/lib/http`
- Base URL defaults to `https://api.peridotvault.com`, configurable via `PUBLIC_API_BASE_URL` env var
- Custom hooks encapsulate fetching logic with loading/error states
- Hooks follow pattern: `use[Resource]({ id, params }) => { resource, isLoading, hasFetched, error }`

### Component Architecture
- Pages use "use client" directive when using hooks or interactivity
- Route groups `(main)` organize routes without affecting URL structure
- Page-specific components live in `_components/` alongside the page
- Shared UI components live in `src/shared/components/`

### TypeScript Configuration
- Path alias: `@/*` maps to `./src/*`
- Strict mode enabled
- Target: ES2017
- Module resolution: bundler

### Styling
- Tailwind CSS 4 with new PostCSS plugin (`@tailwindcss/postcss`)
- Custom color system with semantic tokens (accent, muted, foreground, etc.)
- Responsive design with mobile-first approach
- Custom shadow utilities (shadow-flat-lg, shadow-arise-sm)

### Environment Variables
Required environment variables (see `.env.example`):
```
PUBLIC_API_BASE_URL=https://api.peridotvault.com
PORT=3000
NODE_ENV=production
HOSTNAME=0.0.0.0
```

## API Integration

The app consumes a REST API with the following endpoints:

### Public Endpoints
- `GET /api/games` - List published games
- `GET /api/games/{id}` - Get game details
- `GET /api/games/banner` - Get banner games
- `GET /api/games/top` - Get top games
- `GET /api/categories` - Get game categories

### Authentication Endpoints (Wallet-based)
- `POST /api/auth/verify` - Verify wallet signature and get auth token
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - Logout and invalidate session
- `POST /api/auth/refresh` - Refresh expired auth token

### Studio Endpoints (Require Authentication)
- `GET /api/studio/games` - List user's games
- `POST /api/studio/games` - Create new game
- `PUT /api/studio/games/{id}` - Update game
- `DELETE /api/studio/games/{id}` - Delete game
- `POST /api/studio/games/{id}/publish` - Publish game

API responses follow the `ApiResponse<T>` wrapper:
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}
```

### Authentication Flow
The app uses wallet-based authentication with Peridot Wallet extension:
1. User clicks "Connect Wallet"
2. Wallet signs a message to authenticate
3. Frontend sends signature to `/api/auth/verify`
4. Backend verifies signature and returns JWT token
5. Token is stored and used for authenticated requests
6. Token auto-refreshes when approaching expiration
7. Server-side middleware protects studio routes

**Key Files:**
- `src/features/auth/context/AuthContext.tsx` - Global auth state with token refresh
- `src/features/auth/services/auth.ts` - Auth API calls (set `USE_MOCK_API=false` for real backend)
- `src/shared/lib/http.ts` - Axios interceptors for auth headers
- `middleware.ts` - Server-side route protection
- `docs/api-specification.md` - Complete API documentation for backend team

## Deployment

- **Docker**: Multi-stage Dockerfile builds standalone Next.js output
- **GitHub Actions**: Automated deployment to VPS on push to `main` branch
- **Docker Compose**: Container orchestration with production config
- Build output: `standalone` (optimized for Docker)

The deployment workflow:
1. Push to `main` branch
2. GitHub Actions triggers SSH to VPS
3. Pulls latest code
4. Creates .env from secrets
5. Runs `docker compose down && docker compose build --no-cache && docker compose up -d`

## Key Files to Understand

### Authentication & Authorization
- `src/features/auth/context/AuthContext.tsx` - Auth state management with token refresh
- `src/features/auth/services/auth.ts` - Auth API calls (switch `USE_MOCK_API` for real backend)
- `src/features/auth/utils/token.ts` - Token validation and expiration utilities
- `src/features/auth/utils/authError.ts` - Error handling utilities
- `src/shared/lib/http.ts` - Axios configuration with auth interceptors
- `middleware.ts` - Server-side route protection
- `src/shared/middleware/ProtectStudioRoute.tsx` - Client-side route protection

### UI Components & UX
- `src/shared/components/ui/Toast.tsx` - Toast notification system for user feedback
- `src/shared/utils/retry.ts` - Retry logic with exponential backoff

### TypeScript Types
- `src/features/auth/interfaces/index.ts` - Auth types with template literals for addresses

### Data Fetching
- `src/shared/lib/http.ts` - HTTP client configuration
- `src/features/game/hooks/useGameDetail.ts` - Example of data fetching pattern

### Routing
- `src/app/(main)/[gameName]/[gameId]/page.tsx` - Complex page with error handling
- `src/app/studio/` - Protected studio routes

### Configuration
- `next.config.ts` - Next.js config (image domains, standalone output)
- `tsconfig.json` - TypeScript config with path aliases
- `docs/api-specification.md` - Complete API documentation

## Best Practices

### Error Handling
Use the toast notification system for user-friendly error messages:

```typescript
import { useToast } from "@/shared/components/ui";

function MyComponent() {
  const { showError, showSuccess } = useToast();

  async function handleAction() {
    try {
      await someAsyncOperation();
      showSuccess("Operation completed successfully!");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Operation failed");
    }
  }
}
```

### Retry Logic with Exponential Backoff
For network operations that may fail temporarily:

```typescript
import { retry, defaultShouldRetry } from "@/shared/utils/retry";

const result = await retry(
  () => fetch('/api/data').then(r => r.json()),
  {
    maxAttempts: 3,
    initialDelay: 1000,
    shouldRetry: defaultShouldRetry,
  }
);
```

### TypeScript Best Practices
Use template literal types for Ethereum addresses:

```typescript
import type { EthereumAddress } from "@/features/auth/interfaces";

function validateAddress(address: EthereumAddress): boolean {
  return address.startsWith('0x') && address.length === 42;
}
```

### Authentication Flow
Always use the auth context for authentication:

```typescript
import { useAuth } from "@/features/auth/hooks/useAuth";

function MyProtectedComponent() {
  const { isAuthenticated, credentials, connect, disconnect } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={connect}>Connect Wallet</button>;
  }

  return <div>Welcome {credentials?.wallet.address}</div>;
}
```
