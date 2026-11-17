#!/usr/bin/env bash
# Maintainer deploy helper for void-forge.org — not public self-host documentation.
# Run on the server (Cockpit terminal), from the repo root:
#   bash scripts/deploy.sh
#
# Fetches origin/dev (or a specified branch like `main`), checks safety rails,
# then runs npm ci, build, DB repair/migrations, and restarts the service.
#
#   bash scripts/deploy.sh main
# deploys `main` instead of `dev`. Because that would put older code live, it
# refuses unless ALLOW_OLDER_DEPLOY=1 when the branch does not contain what is
# live now (see .deploy-last-sha).
#
# Safety rails: refuses to run with local edits (other than npm lockfile drift)
# or with local commits that are not on origin/$BRANCH, backs up the
# SQLite DB before restart (start.sh runs prisma migrate deploy), and records
# the deployed commit in .deploy-last-sha.
#
# Do NOT run `npm install` on the server by hand — it rewrites package-lock.json
# and blocks the next fetch. This script uses `npm ci --omit=dev` from the committed lockfile.
# Dev tools (eslint, shadcn, vitest) stay off the server; they are the braces advisory.
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

# Lockfile drift from a stray `npm install` is expected and gets discarded.
# Anything else uncommitted is somebody's work: stop instead of wiping it.
refuse_local_edits() {
  local dirty
  dirty="$(git status --porcelain --untracked-files=no | grep -vE ' (package\.json|package-lock\.json)$' || true)"
  if [ -n "$dirty" ]; then
    echo "ERROR: uncommitted changes on this server would be wiped by the deploy:"
    echo "$dirty"
    echo "       Commit/push or stash them first (git stash), then run this again."
    exit 1
  fi
}

# Commits that only exist on this server (not on origin/$branch)
# would be thrown away by `reset --hard`.
refuse_unpushed_commits() {
  local branch="$1" stray
  git rev-parse --verify -q "refs/heads/$branch" >/dev/null || return 0
  stray="$(git rev-list --no-merges "refs/heads/$branch" --not "origin/$branch" 2>/dev/null || true)"
  if [ -n "$stray" ]; then
    echo "ERROR: local $branch has commits that are not on GitHub:"
    git log --oneline --no-walk $stray | head -20
    echo "       Push them (or move them to a branch) first, then run this again."
    exit 1
  fi
}

# Old-over-new guard: the new HEAD must contain whatever was deployed last time.
refuse_older_than_live() {
  local target="${1:-HEAD}" last
  [ -f .deploy-last-sha ] || return 0
  last="$(cat .deploy-last-sha)"
  git cat-file -e "$last^{commit}" 2>/dev/null || return 0
  if ! git merge-base --is-ancestor "$last" "$target"; then
    if [ "${ALLOW_OLDER_DEPLOY:-}" != "1" ]; then
      echo "ERROR: $(git rev-parse --short "$target") does not contain the live commit $(git rev-parse --short "$last")."
      echo "       Deploying it would put older code live. Re-run with ALLOW_OLDER_DEPLOY=1 if that is intended."
      [ "$target" = "HEAD" ] && git reset --hard "$last"
      exit 1
    fi
    echo "WARN: ALLOW_OLDER_DEPLOY=1, deploying code older than the live commit $last"
  fi
}

backup_database() {
  local url db_path
  url="$(grep -hE '^DATABASE_URL=' .env .env.local .env.production 2>/dev/null | tail -1 | cut -d= -f2- | tr -d "\"'" || true)"
  url="${url:-file:./dev.db}"
  db_path="${url#file:}"
  [[ "$db_path" = /* ]] || db_path="$DIR/$db_path"
  if [ -f "$db_path" ]; then
    mkdir -p "$DIR/db-backups"
    cp -p "$db_path" "$DIR/db-backups/$(basename "$db_path").$(date +%Y%m%d-%H%M%S).bak"
    echo "==> Backed up $db_path to db-backups/"
  fi
}

FORCE="${FORCE:-0}"
BRANCH="dev"

for arg in "$@"; do
  case "$arg" in
    --force|-f)
      FORCE=1
      ;;
    -*)
      echo "Unknown flag: $arg"
      exit 1
      ;;
    *)
      BRANCH="$arg"
      ;;
  esac
done

echo "==> Fetching origin/$BRANCH"
git fetch --prune origin "+refs/heads/$BRANCH:refs/remotes/origin/$BRANCH"
refuse_local_edits
refuse_unpushed_commits "$BRANCH"
refuse_older_than_live "origin/$BRANCH"
echo "==> Resetting working tree to origin/$BRANCH"
git checkout -f -B "$BRANCH" "origin/$BRANCH"
git reset --hard "origin/$BRANCH"

CURRENT_HEAD="$(git rev-parse HEAD)"
LAST_DEPLOYED="$(cat .deploy-last-sha 2>/dev/null || true)"

if [ -n "$LAST_DEPLOYED" ] && [ "$CURRENT_HEAD" = "$LAST_DEPLOYED" ] && [ "$FORCE" != "1" ]; then
  echo "==> Already up to date at $(git rev-parse --short HEAD) (matches .deploy-last-sha)."
  echo "    Nothing new to deploy. Pass --force or set FORCE=1 to force reinstall, rebuild, and restart."
  exit 0
fi

echo "==> Installing production dependencies from package-lock.json"
npm ci --omit=dev

echo "==> Building"
npm run build

echo "==> Build complete at $(git rev-parse --short HEAD)"
backup_database
echo "==> Applying database schema repair and migrations"
db_url="$(grep -hE '^DATABASE_URL=' .env .env.local .env.production 2>/dev/null | tail -1 | cut -d= -f2- | tr -d "\"'" || true)"
export DATABASE_URL="${db_url:-file:./dev.db}"
db_file="${DATABASE_URL#file:}"
[[ "$db_file" = /* ]] || db_file="$DIR/$db_file"
export SQLITE_DATABASE_PATH="$db_file"
node "$DIR/scripts/repair-db.mjs"
if ! npx prisma migrate deploy; then
  echo "WARN: prisma migrate deploy reported an issue; re-running repair-db.mjs"
  node "$DIR/scripts/repair-db.mjs"
  npx prisma migrate deploy || true
fi
git rev-parse HEAD > .deploy-last-sha
restart_framehub
