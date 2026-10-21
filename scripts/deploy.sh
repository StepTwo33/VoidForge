#!/usr/bin/env bash
# Maintainer deploy helper for void-forge.org — not public self-host documentation.
# Run on the server (Cockpit terminal), from the repo root:
#   bash scripts/deploy.sh
#
# Fetches origin/dev and origin/design/ui-pass, fast-forwards dev when the UI
# branch is ahead, merges if the two have diverged, then npm ci, build, and
# restart. Pushes origin/dev when this machine has GitHub credentials.
#
#   bash scripts/deploy.sh main
# deploys that branch only (no UI-pass merge).
#
# Do NOT run `npm install` on the server by hand — it rewrites package-lock.json
# and blocks the next fetch. This script uses `npm ci` from the committed lockfile.
# Requires FRAMEHUB_MAINTAINER=1 or VOIDFORGE_MAINTAINER=1 in the server .env before build/start.

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

# Bring design/ui-pass onto local dev. Push when GitHub login works; otherwise
# still build the merged tree so Cockpit deploys the UI branch.
include_ui_pass() {
  echo "==> Fetching origin/dev and origin/design/ui-pass"
  git fetch origin dev design/ui-pass

  echo "==> Resetting working tree to origin/dev (discards local package.json/lock drift)"
  git checkout dev
  git reset --hard origin/dev

  if git merge-base --is-ancestor origin/design/ui-pass HEAD; then
    echo "==> dev already includes design/ui-pass ($(git rev-parse --short HEAD))"
    return 0
  fi

  if git merge-base --is-ancestor HEAD origin/design/ui-pass; then
    echo "==> Fast-forwarding dev to design/ui-pass"
    git merge --ff-only origin/design/ui-pass
  else
    echo "==> design/ui-pass and dev have diverged; merging"
    git merge --no-edit origin/design/ui-pass
  fi

  echo "==> Pushing dev"
  if GIT_TERMINAL_PROMPT=0 git push origin HEAD:dev; then
    echo "==> origin/dev updated"
  else
    echo "WARN: this box has no GitHub login, so origin/dev was not pushed."
    echo "      The build below still includes design/ui-pass."
  fi
}

BRANCH="${1:-dev}"

if [ "$BRANCH" = "dev" ]; then
  include_ui_pass
else
  echo "==> Fetching origin/$BRANCH"
  git fetch origin "$BRANCH"
  echo "==> Resetting working tree to origin/$BRANCH"
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
fi

echo "==> Installing dependencies from package-lock.json"
npm ci

echo "==> Building"
npm run build

echo "==> Build complete at $(git rev-parse --short HEAD)"
restart_framehub
