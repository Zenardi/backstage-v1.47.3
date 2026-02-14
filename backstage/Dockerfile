# ============================================================================
# Multi-stage Dockerfile for Backstage
# Uses Chainguard Node image for the final stage (fewer vulnerabilities)
#
# Build: docker build -t backstage .
# Run:   docker run -p 7007:7007 backstage
#
# Reference: https://backstage.io/docs/deployment/docker/#multi-stage-build
# ============================================================================

# ---------------------------------------------------------------------------
# Stage 1 - packages: Extract package.json skeleton for dependency caching
# ---------------------------------------------------------------------------
FROM node:24-trixie-slim AS packages

WORKDIR /app

COPY package.json yarn.lock ./
COPY .yarn ./.yarn
COPY .yarnrc.yml ./

COPY packages packages
COPY plugins plugins

# Remove everything except package.json files from packages/
# This creates a minimal skeleton layer for yarn install caching
RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -exec rm -rf {} \+

# ---------------------------------------------------------------------------
# Stage 2 - build: Install all dependencies, type-check, and build backend
# ---------------------------------------------------------------------------
FROM node:24-trixie-slim AS build

# Set Python interpreter for node-gyp (required by isolate-vm / scaffolder)
ENV PYTHON=/usr/bin/python3

# Install native build dependencies (isolate-vm, node-gyp)
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends python3 g++ build-essential && \
    rm -rf /var/lib/apt/lists/*

# Install sqlite3 dependencies (required by better-sqlite3)
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /app

# Copy the package.json skeleton from stage 1
COPY --from=packages --chown=node:node /app .
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node .yarnrc.yml ./
COPY --chown=node:node backstage.json ./

# Install all dependencies (including devDependencies for building)
RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn install --immutable

# Copy the full source code
COPY --chown=node:node . .

# Type-check and build the backend
# yarn build:backend produces skeleton.tar.gz and bundle.tar.gz in packages/backend/dist/
RUN yarn tsc
RUN yarn --cwd packages/backend build

# ---------------------------------------------------------------------------
# Stage 3 - final: Production image using Chainguard (minimal CVEs)
# ---------------------------------------------------------------------------
FROM cgr.dev/chainguard/node:latest

WORKDIR /app

# Copy the skeleton tarball and install production-only dependencies
COPY --from=build --chown=node:node /app/yarn.lock /app/package.json /app/packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

COPY --from=build --chown=node:node /app/.yarn ./.yarn
COPY --from=build --chown=node:node /app/.yarnrc.yml ./
COPY --from=build --chown=node:node /app/backstage.json ./

ENV NODE_ENV=production
ENV NODE_OPTIONS="--no-node-snapshot"

RUN yarn workspaces focus --all --production

# Copy the built backend bundle
COPY --from=build --chown=node:node /app/packages/backend/dist/bundle.tar.gz ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

# Copy app-config files (excluding *.local.yaml via .dockerignore)
COPY --from=build --chown=node:node /app/app-config.yaml /app/app-config.production.yaml ./

# Expose the backend port
EXPOSE 7007

CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
