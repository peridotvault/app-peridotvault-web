FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

FROM base AS fonts
RUN apk add --no-cache curl fontconfig freetype ttf-dejavu
WORKDIR /fonts
RUN mkdir -p /usr/share/fonts/truetype && \
    curl -L -o Geist.zip "https://fonts.google.com/download?family=Geist" 2>/dev/null || true && \
    curl -L -o "Geist%20Mono.zip" "https://fonts.google.com/download?family=Geist%20Mono" 2>/dev/null || true || true

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=fonts /fonts /fonts
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

RUN npm run build

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