#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS maintenance script */
/**
 * Move src/lib files into domain folders and rewrite @/lib/... imports.
 *
 * Usage:
 *   node scripts/_reorg_lib.js --dry-run
 *   node scripts/_reorg_lib.js --domains calc
 *   node scripts/_reorg_lib.js --domains calc,builds
 *   node scripts/_reorg_lib.js --all
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const MAP = require("./_reorg_lib_map.js");

const ROOT = path.resolve(__dirname, "..");
const LIB = path.join(ROOT, "src", "lib");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const all = args.includes("--all");
const domainsArg = args.find((a) => a.startsWith("--domains="))?.slice("--domains=".length)
  ?? (args.includes("--domains") ? args[args.indexOf("--domains") + 1] : null);

const allowedDomains = all
  ? null
  : domainsArg
    ? new Set(domainsArg.split(",").map((s) => s.trim()).filter(Boolean))
    : null;

if (!dryRun && !all && !allowedDomains) {
  console.error("Pass --dry-run, --all, or --domains calc,builds");
  process.exit(1);
}

/** @type {Record<string, string>} basename → new @/lib path without extension */
const basenameToNew = {};
for (const [base, domain] of Object.entries(MAP)) {
  if (allowedDomains && !allowedDomains.has(domain)) continue;
  basenameToNew[base] = `${domain}/${base}`;
}

function listFilesRecursive(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next" || ent.name === "generated") continue;
      listFilesRecursive(p, out);
    } else if (/\.(ts|tsx|js|mjs|mts)$/.test(ent.name)) {
      out.push(p);
    }
  }
  return out;
}

function rewriteImportsInFile(filePath) {
  let text = fs.readFileSync(filePath, "utf8");
  const original = text;
  // Match @/lib/<name> optionally with .ts extension, with or without quotes variants already in source
  text = text.replace(
    /(@\/lib\/)([A-Za-z0-9_-]+)(\.ts)?(?=["'])/g,
    (full, prefix, name, ext) => {
      const mapped = basenameToNew[name];
      if (!mapped) return full;
      return `${prefix}${mapped}${ext || ""}`;
    },
  );
  // Relative imports from within src/lib: ./foo or ../foo when foo is moving
  // Handle ./basename and ../basename from lib root or subdirs
  text = text.replace(
    /(from\s+["'])(\.\.?\/)([A-Za-z0-9_-]+)(["'])/g,
    (full, from, rel, name, q) => {
      const mapped = basenameToNew[name];
      if (!mapped) return full;
      // Only rewrite if this looks like a lib-local relative import to a moved module.
      // Compute from file location.
      const fileDir = path.dirname(filePath);
      const resolved = path.normalize(path.join(fileDir, rel + name));
      const libRel = path.relative(LIB, resolved).replace(/\\/g, "/");
      // If resolved path is still under lib and was a top-level basename (no slash) or already domain
      if (libRel.startsWith("..")) return full;
      const targetAbs = path.join(LIB, mapped);
      const newRel = path.relative(fileDir, targetAbs).replace(/\\/g, "/");
      const withDot = newRel.startsWith(".") ? newRel : `./${newRel}`;
      return `${from}${withDot}${q}`;
    },
  );

  if (text !== original) {
    if (!dryRun) fs.writeFileSync(filePath, text);
    return true;
  }
  return false;
}

// 1) Move files
const moves = [];
for (const [base, domain] of Object.entries(MAP)) {
  if (allowedDomains && !allowedDomains.has(domain)) continue;
  const src = path.join(LIB, `${base}.ts`);
  if (!fs.existsSync(src)) {
    console.warn(`skip missing: ${base}.ts`);
    continue;
  }
  const destDir = path.join(LIB, domain);
  const dest = path.join(destDir, `${base}.ts`);
  moves.push({ src, dest, domain, base });
}

console.log(`${dryRun ? "[dry-run] " : ""}Moves: ${moves.length}`);
for (const m of moves) {
  console.log(`  ${path.relative(ROOT, m.src)} → ${path.relative(ROOT, m.dest)}`);
  if (!dryRun) {
    fs.mkdirSync(path.dirname(m.dest), { recursive: true });
    execSync(`git mv "${m.src}" "${m.dest}"`, { cwd: ROOT, stdio: "inherit" });
  }
}

// 2) Rewrite imports across repo
const scanRoots = [
  path.join(ROOT, "src"),
  path.join(ROOT, "bot"),
  path.join(ROOT, "scripts"),
].filter(fs.existsSync);

let changed = 0;
for (const root of scanRoots) {
  for (const file of listFilesRecursive(root)) {
    // skip the map/script itself partially — ok to rewrite scripts too
    if (rewriteImportsInFile(file)) {
      changed++;
      console.log(`  rewrite ${path.relative(ROOT, file)}`);
    }
  }
}
console.log(`${dryRun ? "[dry-run] would change" : "changed"} ${changed} files`);

if (!dryRun) {
  console.log("Fixing relative imports under src/lib...");
  execSync(`node "${path.join(__dirname, "_reorg_lib_fix_rel.js")}"`, {
    cwd: ROOT,
    stdio: "inherit",
  });
}
