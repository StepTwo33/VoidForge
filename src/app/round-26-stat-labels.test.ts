import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (rel: string) => readFileSync(join(process.cwd(), "src/app", rel), "utf8");

describe("Round 26: list stat abbreviations are consistent", () => {
  it("weapon, companion and modular lists call crit multiplier 'CD' (critical damage), never 'CM'", () => {
    for (const f of ["weapon-builder/page.tsx", "companion-builder/page.tsx", "modular-builder/page.tsx"]) {
      const src = read(f);
      expect(src, f).not.toMatch(/>\s*CM\s*\{/);
      expect(src, f).not.toMatch(/^\s*CM \{/m);
    }
    expect(read("weapon-builder/page.tsx")).toMatch(/title="Critical damage \(critical multiplier\)">CD \{weapon/);
    expect(read("companion-builder/page.tsx")).toMatch(/title="Critical damage \(critical multiplier\)">CD \{w\./);
  });

  it("the Archwing/Necramech builder UI does not say Railjack", () => {
    const src = read("archwing-builder/page.tsx");
    const jsxAndStrings = src.split("\n").filter((l) => /Railjack/.test(l.replace(/[a-z]Railjack|railjack[A-Za-z_]*|setRailjack\w*/g, "")) && !/^\s*(\/\/|\*|\/\*)/.test(l));
    expect(jsxAndStrings).toEqual([]);
  });
});
