# Dockerfile multi-stage para producción

FROM node:20-alpine AS base

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache libc6-compat openssl

FROM base AS deps
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma

# Script de inicio
COPY --from=builder /app/next.config.* ./

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Script de inicio que ejecuta migraciones y luego inicia el servidor
CMD npx prisma migrate deploy && node_modules/.bin/next start
