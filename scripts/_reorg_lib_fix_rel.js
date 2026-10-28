#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS maintenance script */
/** Fix relative imports under src/lib after domain moves. */
const fs = require("fs");
const path = require("path");
const MAP = require("./_reorg_lib_map.js");

const LIB = path.join(__dirname, "..", "src", "lib");

function resolveImport(fromDir, name) {
  if (fs.existsSync(path.join(fromDir, name + ".ts"))) {
    return "./" + name;
  }
  if (fs.existsSync(path.join(LIB, name + ".ts"))) {
    const rel = path.relative(fromDir, path.join(LIB, name)).replace(/\\/g, "/");
    return rel.startsWith(".") ? rel : "./" + rel;
  }
  const domain = MAP[name];
  if (domain) {
    const dest = path.join(LIB, domain, name);
    if (fs.existsSync(dest + ".ts")) {
      const rel = path.relative(fromDir, dest).replace(/\\/g, "/");
      return rel.startsWith(".") ? rel : "./" + rel;
    }
  }
  for (const ent of fs.readdirSync(LIB, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const dest = path.join(LIB, ent.name, name);
    if (fs.existsSync(dest + ".ts")) {
      const rel = path.relative(fromDir, dest).replace(/\\/g, "/");
      return rel.startsWith(".") ? rel : "./" + rel;
    }
  }
  return null;
}

function fixFile(filePath) {
  let text = fs.readFileSync(filePath, "utf8");
  const dir = path.dirname(filePath);
  let changed = false;
  const next = text.replace(
    /(from\s+["'])(\.\.?\/)([A-Za-z0-9_-]+)(["'])/g,
    (full, a, _rel, name, q) => {
      const resolved = resolveImport(dir, name);
      if (!resolved) return full;
      const want = a + resolved + q;
      if (want !== full) changed = true;
      return want;
    },
  );
  if (changed) {
    fs.writeFileSync(filePath, next);
    console.log("fixed", path.relative(process.cwd(), filePath));
  }
}

function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name)) fixFile(p);
  }
}

const target = process.argv[2] ? path.join(LIB, process.argv[2]) : LIB;
walk(target);
