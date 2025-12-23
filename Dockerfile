FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run prepare

# Build with dummy env vars (actual values injected at runtime)
RUN DATABASE_URL=postgresql://localhost/dummy \
    BETTER_AUTH_URL=http://localhost \
    BETTER_AUTH_SECRET=dummydummydummydummydummydummydu \
    GITHUB_CLIENT_ID=dummy \
    GITHUB_CLIENT_SECRET=dummy \
    S3_ENDPOINT=http://localhost \
    S3_ACCESS_KEY=dummy \
    S3_SECRET_KEY=dummy \
    S3_BUCKET=dummy \
    S3_PUBLIC_URL=http://localhost \
    bun run build

FROM oven/bun:1-slim
WORKDIR /app

# Install sops, age, and git (for data migration)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates git \
    && curl -LO https://github.com/getsops/sops/releases/download/v3.9.4/sops-v3.9.4.linux.amd64 \
    && mv sops-v3.9.4.linux.amd64 /usr/local/bin/sops \
    && chmod +x /usr/local/bin/sops \
    && curl -LO https://github.com/FiloSottile/age/releases/download/v1.2.0/age-v1.2.0-linux-amd64.tar.gz \
    && tar -xzf age-v1.2.0-linux-amd64.tar.gz \
    && mv age/age /usr/local/bin/ \
    && rm -rf age age-v1.2.0-linux-amd64.tar.gz \
    && apt-get remove -y curl && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# Copy built application
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY secrets.prod.yaml ./secrets.yaml

# Copy drizzle migration files and config
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/src/lib/env/env.server.ts ./src/lib/env/env.server.ts
COPY --from=builder /app/src/lib/shared/models/schema.ts ./src/lib/shared/models/schema.ts
COPY --from=builder /app/bun.lock ./
RUN bun install --frozen-lockfile
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# SOPS_AGE_KEY must be set at runtime
CMD ["sops", "exec-env", "secrets.yaml", "bun drizzle-kit migrate && exec bun build/index.js"]
