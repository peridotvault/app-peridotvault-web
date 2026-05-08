FROM node:22-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY vendor ./vendor
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ARG API_BASE_URL
ARG NEXT_PUBLIC_STORE_URL

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV API_BASE_URL=${API_BASE_URL}
ENV NEXT_PUBLIC_STORE_URL=${NEXT_PUBLIC_STORE_URL}
ENV NODE_OPTIONS=--max-old-space-size=4096

RUN pnpm run build

FROM base AS runner
WORKDIR /app

ARG NODE_ENV=production
ARG PORT=3000
ARG HOSTNAME=0.0.0.0

ENV NODE_ENV=$NODE_ENV

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE $PORT

ENV PORT=$PORT
ENV HOSTNAME=$HOSTNAME

CMD ["node", "server.js"]