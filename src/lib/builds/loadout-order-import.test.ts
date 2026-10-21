import { beforeEach, describe, expect, it } from "vitest";
import {
  applyImportToLoadout,
  findImportedLoadouts,
  getLoadouts,
  loadoutToBuildData,
  moveLoadout,
  saveLoadout,
} from "@/lib/builds/loadouts";
import type { Loadout } from "@/lib/types";

class MemStorage {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}

const mk = (id: string, extra: Partial<Loadout> = {}): Loadout => ({ id, name: id, createdAt: 1, updatedAt: 1, ...extra });

beforeEach(() => {
  (globalThis as unknown as { window: unknown }).window = globalThis;
  (globalThis as unknown as { localStorage: MemStorage }).localStorage = new MemStorage();
});

describe("loadout order (R11-F10)", () => {
  it("moves up/down and stays in bounds", () => {
    for (const id of ["a", "b", "c"]) saveLoadout(mk(id));
    expect(moveLoadout("c", -1).map((l) => l.id)).toEqual(["a", "c", "b"]);
    expect(getLoadouts().map((l) => l.id)).toEqual(["a", "c", "b"]);
    expect(moveLoadout("a", -1).map((l) => l.id)).toEqual(["a", "c", "b"]);
    expect(moveLoadout("b", 1).map((l) => l.id)).toEqual(["a", "c", "b"]);
    expect(moveLoadout("a", 1).map((l) => l.id)).toEqual(["c", "a", "b"]);
  });
});

describe("re-import (R11-F2)", () => {
  it("finds earlier imports of the same account, case-insensitively", () => {
    saveLoadout(mk("x", { importSource: { platform: "pc", account: "StepBro" } }));
    saveLoadout(mk("y", { importSource: { platform: "ps4", account: "StepBro" } }));
    expect(findImportedLoadouts("pc", " stepbro ").map((l) => l.id)).toEqual(["x"]);
  });

  it("Update keeps identity, name and sharing but replaces slots and warnings", () => {
    const existing = mk("x", {
      name: "My kit",
      cloudId: "c1",
      isPublic: true,
      importWarnings: ["old"],
      warframeBuild: { warframeId: "excalibur", mods: [], shards: [], hasOrokinReactor: false },
    });
    const next = applyImportToLoadout(existing, {
      name: "Me — Imported Oct 20, 2026",
      importSource: { platform: "pc", account: "Me" },
      warframeBuild: { warframeId: "gyre_prime", mods: [], shards: [], hasOrokinReactor: true },
    });
    expect(next).toMatchObject({ id: "x", name: "My kit", cloudId: "c1", isPublic: true, createdAt: 1 });
    expect(next.importWarnings).toBeUndefined();
    expect(next.warframeBuild?.warframeId).toBe("gyre_prime");
    expect(next.importSource).toEqual({ platform: "pc", account: "Me" });
  });

  it("importSource is local-only (stripped from account payloads)", () => {
    const data = loadoutToBuildData(mk("x", { importSource: { platform: "pc", account: "Me" }, importWarnings: ["w"] }));
    expect(data).not.toHaveProperty("importSource");
    expect(data).not.toHaveProperty("importWarnings");
  });
});
