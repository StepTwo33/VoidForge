#!/usr/bin/env bash
# Maintainer deploy helper for void-forge.org — not public self-host documentation.
# Server deploy: fetch latest code, discard local npm drift, install, build, restart.
#
# Usage (on the server, from repo root):
#   bash scripts/deploy.sh              # deploy origin/dev (default) and restart
#   bash scripts/deploy.sh main         # deploy origin/main and restart
#
# Usage (on your PC, from repo root):
#   .\scripts\ship.ps1                  # PowerShell: merge design/ui-pass into dev, push, deploy on .50
#   bash scripts/deploy.sh ship         # Git Bash (not WSL bash — that one has no GitHub login)
#
# Do NOT run `npm install` on the server by hand — it rewrites package-lock.json
# and blocks the next `git pull`. This script uses `npm ci` from the committed lockfile.
# Requires FRAMEHUB_MAINTAINER=1 or VOIDFORGE_MAINTAINER=1 in the server .env before build/start.
#
# ship host override: DEPLOY_HOST (default jason@192.168.1.50)
#                     DEPLOY_REPO (default /home/jason/framehub)

set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR"

# systemd unit runs as jason with Restart=always. sudo needs a password on the box,
# so a SIGTERM of our own MainPID is enough for systemd to start the new build.
restart_framehub() {
  local unit="${FRAMEHUB_SERVICE:-framehub}"
  if ! systemctl cat "$unit" >/dev/null 2>&1; then
    echo "==> No systemd unit '$unit' here; start the app yourself (./start.sh)"
    return 0
  fi

  if sudo -n systemctl restart "$unit" 2>/dev/null; then
    echo "==> Restarted $unit"
    systemctl is-active "$unit"
    return 0
  fi

  local old new state i
  old="$(systemctl show -p MainPID --value "$unit" 2>/dev/null || true)"
  if [ -z "$old" ] || [ "$old" = "0" ]; then
    echo "WARN: $unit is not running and passwordless sudo is unavailable."
    echo "      Start it with: sudo systemctl restart $unit"
    return 1
  fi

  echo "==> Restarting $unit (pid $old)"
  kill -TERM "$old"
  for i in 1 2 3 4 5 6 7 8 9 10 12 14 16 18 20; do
    sleep 1
    new="$(systemctl show -p MainPID --value "$unit" 2>/dev/null || true)"
    state="$(systemctl is-active "$unit" 2>/dev/null || true)"
    if [ "$state" = "active" ] && [ -n "$new" ] && [ "$new" != "0" ] && [ "$new" != "$old" ]; then
      echo "==> $unit active (pid $new) at $(git rev-parse --short HEAD)"
      return 0
    fi
  done

  echo "WARN: $unit did not come back with a new pid (state=${state:-unknown})"
  return 1
}

# From a workstation checkout: publish design/ui-pass onto origin/dev, then deploy that on the box.
if [ "${1:-}" = "ship" ]; then
  HOST="${DEPLOY_HOST:-jason@192.168.1.50}"
  REPO="${DEPLOY_REPO:-/home/jason/framehub}"

  echo "==> Fetching origin/dev and origin/design/ui-pass"
  git fetch origin dev design/ui-pass

  if [ "$(git rev-parse --abbrev-ref HEAD)" != "dev" ]; then
    git checkout dev
  fi
  git merge --ff-only origin/dev

  if [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/design/ui-pass)" ]; then
    echo "==> dev already matches design/ui-pass"
  elif git merge-base --is-ancestor origin/design/ui-pass HEAD; then
    echo "==> dev already includes design/ui-pass"
  else
    echo "==> Merging design/ui-pass into dev"
    git merge --no-edit origin/design/ui-pass
  fi

  git push origin HEAD:dev

  echo "==> Deploying on $HOST"
  ssh -o BatchMode=yes -o ConnectTimeout=15 "$HOST" "cd '$REPO' && bash scripts/deploy.sh dev"
  exit 0
fi

BRANCH="${1:-dev}"

echo "==> Fetching origin/$BRANCH"
git fetch origin "$BRANCH"

echo "==> Resetting working tree to origin/$BRANCH (discards local package.json/lock drift)"
git reset --hard "origin/$BRANCH"

echo "==> Installing dependencies from package-lock.json"
npm ci

echo "==> Building"
npm run build

echo "==> Build complete at $(git rev-parse --short HEAD)"
restart_framehub
