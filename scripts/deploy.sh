#!/usr/bin/env bash
# Maintainer deploy helper for void-forge.org — not public self-host documentation.
# Server deploy: fetch latest code, discard local npm drift, install, build.
#
# Usage (on the server, from repo root):
#   ./scripts/deploy.sh              # deploy origin/dev (default)
#   ./scripts/deploy.sh main         # deploy origin/main
#
# Do NOT run `npm install` on the server by hand — it rewrites package-lock.json
# and blocks the next `git pull`. This script uses `npm ci` from the committed lockfile.
# Requires FRAMEHUB_MAINTAINER=1 or VOIDFORGE_MAINTAINER=1 in the server .env before build/start.

set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR"

BRANCH="${1:-dev}"

echo "==> Fetching origin/$BRANCH"
git fetch origin "$BRANCH"

echo "==> Resetting working tree to origin/$BRANCH (discards local package.json/lock drift)"
git reset --hard "origin/$BRANCH"

echo "==> Installing dependencies from package-lock.json"
npm ci

echo "==> Building"
npm run build

echo "==> Deploy complete at $(git rev-parse --short HEAD)"
echo "    Restart the app (and bot if running): ./start.sh or your systemd unit"
