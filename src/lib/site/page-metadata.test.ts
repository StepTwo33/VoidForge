import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { OG_IMAGE_URL, pageMetadata } from "./page-metadata";

describe("pageMetadata", () => {
  it("sets title, description, canonical and matching OG/Twitter tags", () => {
    const m = pageMetadata({ path: "/codex", title: "Codex", description: "Browse mods." });
    expect(m.title).toBe("Codex");
    expect(m.description).toBe("Browse mods.");
    expect(m.alternates?.canonical).toBe("/codex");
    const og = m.openGraph as { url: string; title: string; description: string; images: { url: string }[] };
    expect(og.url).toBe("/codex");
    expect(og.title).toBe("Codex | Voidforge");
    expect(og.description).toBe("Browse mods.");
    expect(og.images[0].url).toBe(OG_IMAGE_URL);
    expect((m.twitter as { title: string }).title).toBe("Codex | Voidforge");
  });
});

describe("route metadata coverage", () => {
  const appDir = join(__dirname, "../../app");
  // Auth/account/admin pages keep the global metadata only.
  const SKIP = new Set(["signin", "signup", "verify", "unsubscribe", "profile", "admin", "bot", "api", "build", "mod-browser", "arcane-browser", "feeds"]);

  function routeFiles(dir: string, rel = ""): string[] {
    const out: string[] = [];
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (!statSync(full).isDirectory()) continue;
      if (!rel && SKIP.has(name)) continue;
      const r = rel ? `${rel}/${name}` : name;
      for (const f of ["layout.tsx", "page.tsx"]) {
        try {
          out.push(`${r}/${f}:${readFileSync(join(full, f), "utf8").includes("pageMetadata(") ? "y" : "n"}`);
        } catch {
          /* missing */
        }
      }
      out.push(...routeFiles(full, r));
    }
    return out;
  }

  it("every public route segment sets its own canonical/OG metadata", () => {
    const byRoute = new Map<string, boolean>();
    for (const entry of routeFiles(appDir)) {
      const [file, flag] = entry.split(":");
      const route = file.replace(/\/(layout|page)\.tsx$/, "");
      if (!file.endsWith("page.tsx") && !byRoute.has(route)) byRoute.set(route, false);
      byRoute.set(route, (byRoute.get(route) ?? false) || flag === "y");
    }
    // A child route inherits its layout's metadata when it has none of its own,
    // so only routes with a page.tsx need coverage.
    const pages = routeFiles(appDir).filter((e) => e.split(":")[0].endsWith("page.tsx")).map((e) => e.split(":")[0].replace(/\/page\.tsx$/, ""));
    const missing = pages.filter((r) => !byRoute.get(r));
    expect(missing).toEqual([]);
  });

  it("home page sets canonical /", () => {
    const src = readFileSync(join(appDir, "page.tsx"), "utf8");
    expect(src).toContain('pageMetadata({ path: "/"');
  });
});
