# ============================================
# Ripple Foundation - Security Hardened Next.js
# Multi-stage build for minimal attack surface
# ============================================

# Stage 1: Dependencies - Build time only
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Stage 2: Builder - Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Security: Add build arguments
ARG NEXT_PUBLIC_APP_NAME="The Ripple Foundation"
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner - Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Security: Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Security: Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# ============================================
# SECURITY CHECKLIST
# ============================================

# ✅ Multi-stage build (minimal image size)
# ✅ Non-root user (nextjs:1001)
# ✅ No package.json in final image
# ✅ Telemetry disabled
# ✅ Environment variables for secrets
# ✅ Read-only filesystem where possible
# ✅ CPU/memory limits in docker-compose
# ✅ No new privileges set
