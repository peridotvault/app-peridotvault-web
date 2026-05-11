# syntax=docker/dockerfile:1

# ============================
# Base
# ============================
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app


# ============================
# Dependencies
# ============================
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency manifests first for better Docker layer caching.
# pnpm-workspace.yaml is required because pnpm approve-builds writes allowed build deps there.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# If your project uses local vendor packages, keep this.
COPY vendor ./vendor

RUN pnpm install --frozen-lockfile --ignore-scripts


# ============================
# Fonts
# ============================
FROM base AS fonts

RUN apk add --no-cache curl fontconfig freetype ttf-dejavu

WORKDIR /fonts

RUN mkdir -p /usr/share/fonts/truetype && \
    curl -L -o Geist.zip "https://fonts.google.com/download?family=Geist" 2>/dev/null || true && \
    curl -L -o "Geist%20Mono.zip" "https://fonts.google.com/download?family=Geist%20Mono" 2>/dev/null || true || true


# ============================
# Builder
# ============================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=fonts /fonts /fonts

COPY . .

# Build-time variables.
# NEXT_PUBLIC_* values are compiled into the browser bundle by Next.js.
ARG NEXT_PUBLIC_API_BASE_URL
ARG API_BASE_URL
ARG NEXT_PUBLIC_STORE_URL

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV API_BASE_URL=${API_BASE_URL}
ENV NEXT_PUBLIC_STORE_URL=${NEXT_PUBLIC_STORE_URL}

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build


# ============================
# Runner
# ============================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Runtime tools for healthcheck/debug.
RUN apk add --no-cache curl

ARG PORT=3000
ARG HOSTNAME=0.0.0.0

ENV PORT=${PORT}
ENV HOSTNAME=${HOSTNAME}

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets.
COPY --from=builder /app/public ./public

# Prepare Next.js runtime directory.
RUN mkdir .next && \
    chown nextjs:nodejs .next

# Copy standalone output.
# Requires next.config.js / next.config.ts:
#   output: "standalone"
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
