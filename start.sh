#!/bin/bash
# Maintainer deploy helper for frame-hub.com — not public self-host documentation.
# start.sh - Builds and starts Frame Hub in production with optional Cloudflare tunnel
# Usage: ./start.sh [--dev]
#   --dev   Skip build and run Next.js dev server instead
#
# Environment:
#   FRAMEHUB_MAINTAINER  Must be 1 (after .env load) to run the Next app
#   PORT                 Default 3000
#   DATABASE_URL         SQLite URL for Prisma; default file:./dev.db
#   PUBLIC_DOMAIN        Shown in banner; default https://frame-hub.com
#   CLOUDFLARED_CONFIG   Tunnel config file; default ~/.cloudflared/config-framehub.yml
#   SKIP_TUNNEL          Set to 1 to skip Cloudflare (local or no creds)
#   OVERFRAME_SYNC_DATA  Set to 1 to run scripts/convert_data_v2.py before build (needs Dart data path)

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

PORT="${PORT:-3000}"
DOMAIN="${PUBLIC_DOMAIN:-https://frame-hub.com}"
TUNNEL_CONFIG="${CLOUDFLARED_CONFIG:-$HOME/.cloudflared/config-framehub.yml}"
DEV_MODE=false
TUNNEL_PID=""

if [ "$1" = "--dev" ]; then
  DEV_MODE=true
fi

cleanup() {
  echo ""
  echo "Shutting down..."
  kill $(jobs -p) 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM

# --- Load env + apply Prisma migrations (same DB file the app uses) ---
resolve_db_path() {
  local url="${DATABASE_URL:-file:./dev.db}"
  local db_path="${url#file:}"
  if [[ "$db_path" != /* ]]; then
    db_path="$DIR/$db_path"
  fi
  printf '%s' "$db_path"
}

repair_database_schema() {
  echo "Verifying database schema (Node)..."
  node "$DIR/scripts/repair-db.mjs"
}

prepare_database() {
  for env_file in .env .env.local .env.production; do
    if [ -f "$DIR/$env_file" ]; then
      set -a
      # shellcheck disable=SC1090
      source "$DIR/$env_file"
      set +a
    fi
  done

  export DATABASE_URL="${DATABASE_URL:-file:./dev.db}"

  local db_path
  db_path="$(resolve_db_path)"
  if command -v realpath >/dev/null 2>&1; then
    db_path="$(realpath -m "$db_path")"
  fi
  mkdir -p "$(dirname "$db_path")"
  # Next.js / Prisma runtime must open this exact file (not a different cwd-relative path)
  export SQLITE_DATABASE_PATH="$db_path"

  echo "DATABASE_URL=$DATABASE_URL"
  echo "SQLite: $db_path"
  echo "Applying Prisma migrations..."
  if ! npx prisma migrate deploy; then
    echo "WARN: prisma migrate deploy failed — repairing schema and resolving stuck migrations..."
    repair_database_schema || true
    npx prisma migrate resolve --applied 20260604120000_add_user_bio 2>/dev/null || true
    npx prisma migrate resolve --applied 20260607180000_user_created_at_build_fields 2>/dev/null || true
    npx prisma migrate deploy 2>/dev/null || echo "WARN: migrate deploy still failing; schema repair will align columns."
  fi
  repair_database_schema
}

prepare_database

if [ "${FRAMEHUB_MAINTAINER:-}" != "1" ]; then
  echo "Frame Hub is not intended for self-hosting."
  echo "Use the planner at https://frame-hub.com"
  echo "To verify calculations and item catalogs: npm test"
  echo "Maintainers: set FRAMEHUB_MAINTAINER=1 in .env to run the Next app."
  exit 1
fi

# --- Optional: Dart → TypeScript data sync (host must have OVERFRAME_DART_DIR or sibling overframe-app) ---
if [ "${OVERFRAME_SYNC_DATA:-}" = "1" ] && [ -f "$DIR/scripts/convert_data_v2.py" ]; then
  echo "OVERFRAME_SYNC_DATA=1: running scripts/convert_data_v2.py ..."
  python3 "$DIR/scripts/convert_data_v2.py" || {
    echo "WARN: Data converter exited with an error; fix paths or set OVERFRAME_DART_DIR. Continuing."
  }
fi

# --- Kill anything already on our port ---
echo "Checking for existing processes on port $PORT..."
if command -v fuser >/dev/null 2>&1; then
  fuser -k "$PORT"/tcp 2>/dev/null && sleep 2 || true
else
  echo "(fuser not installed; skip port cleanup — ensure port $PORT is free)"
fi

# --- Clean stale build cache ---
if [ -d ".next" ]; then
  echo "Removing stale .next build cache..."
  rm -rf .next 2>/dev/null || sudo rm -rf .next
fi

# --- Start Cloudflare named tunnel (optional) ---
if [ "${SKIP_TUNNEL:-}" = "1" ]; then
  echo "SKIP_TUNNEL=1: not starting Cloudflare tunnel."
elif ! command -v cloudflared >/dev/null 2>&1; then
  echo "cloudflared not in PATH; skipping tunnel. Set SKIP_TUNNEL=1 to silence this."
elif [ ! -f "$TUNNEL_CONFIG" ]; then
  echo "Tunnel config not found: $TUNNEL_CONFIG"
  echo "  Set CLOUDFLARED_CONFIG or SKIP_TUNNEL=1. Continuing without tunnel."
else
  echo "Starting Cloudflare tunnel (frame-hub)..."
  cloudflared tunnel --config "$TUNNEL_CONFIG" run frame-hub &
  TUNNEL_PID=$!
  sleep 2
  if ! kill -0 "$TUNNEL_PID" 2>/dev/null; then
    echo "ERROR: Tunnel failed to start."
    exit 1
  fi
  echo "Tunnel running (PID $TUNNEL_PID)"
fi

# --- Build & Start Next.js ---
echo ""
echo "================================================"
echo "  Local:  http://localhost:$PORT"
echo "  Public: $DOMAIN"
echo "================================================"
echo ""

if [ "$DEV_MODE" = true ]; then
  echo "Starting Next.js dev server..."
  npm run dev
else
  echo "Building for production..."
  npm run build
  echo "Starting Next.js production server..."
  npm run start
fi
