import { describe, expect, it } from "vitest";
import {
  decodeBuild,
  decodeBuildAsync,
  decodeJsonPayload,
  encodeBuild,
  encodeBuildAsync,
  encodeJsonPayload,
  isLocalBuildId,
  packShareableBuild,
  unpackShareableBuild,
  type ShareableBuild,
} from "@/lib/builds/build-url";

describe("encodeJsonPayload / decodeJsonPayload", () => {
  it("round-trips ASCII JSON", () => {
    const data = { name: "Lesion Viral", mods: [{ id: "pressure_point", rank: 5 }] };
    const code = encodeJsonPayload(data);
    expect(code.length).toBeGreaterThan(10);
    expect(code).not.toMatch(/[+/=]/);
    expect(decodeJsonPayload(code)).toEqual(data);
  });

  it("round-trips unicode names (emoji / accents)", () => {
    const data = { name: "Lésion 🔥 Viral", note: "café" };
    const code = encodeJsonPayload(data);
    expect(code).not.toBe("");
    expect(decodeJsonPayload(code)).toEqual(data);
  });

  it("still decodes legacy Latin1-only payloads", () => {
    const legacy = btoa(JSON.stringify({ name: "Plain" }))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(decodeJsonPayload(legacy)).toEqual({ name: "Plain" });
  });
});

const sampleWarframe: ShareableBuild = {
  type: "warframe",
  itemId: "qorvex",
  mods: [
    { id: "growing_power", rank: 5, slotIndex: 0 },
    { id: "power_drift", rank: 5, slotIndex: 9 },
    { id: "precision_intensify", rank: 5, slotIndex: 1 },
    { id: "amars_hatred", rank: 5, slotIndex: 2 },
    { id: "transient_fortitude", rank: 10, slotIndex: 3 },
    { id: "streamline_r3", rank: 5, slotIndex: 4 },
    { id: "primed_continuity", rank: 10, slotIndex: 5 },
    { id: "augur_secrets", rank: 5, slotIndex: 6 },
    { id: "fused_crucible", rank: 3, slotIndex: 7 },
    { id: "primed_flow", rank: 10, slotIndex: 8 },
  ],
  arcanes: ["molt_augmented", "arcane_universal_fallout"],
  shards: [],
};

describe("packShareableBuild / unpackShareableBuild", () => {
  it("round-trips packed array form", () => {
    const packed = packShareableBuild(sampleWarframe);
    expect(packed[0]).toBe(1);
    expect(packed[1]).toBe("f");
    expect(unpackShareableBuild(packed)).toEqual({
      type: "warframe",
      itemId: "qorvex",
      mods: sampleWarframe.mods,
      arcanes: sampleWarframe.arcanes,
    });
  });
});

describe("encodeBuild / decodeBuild", () => {
  it("round-trips a weapon share payload", () => {
    const build: ShareableBuild = {
      type: "weapon",
      itemId: "lesion",
      mods: [{ id: "pressure_point", rank: 5 }],
      arcanes: ["melee_afflictions"],
    };
    const code = encodeBuild(build);
    expect(code.length).toBeGreaterThan(10);
    expect(decodeBuild(code)).toEqual(build);
  });

  it("produces shorter codes than legacy object JSON", () => {
    const legacy = encodeJsonPayload(sampleWarframe);
    const compact = encodeBuild(sampleWarframe);
    expect(compact.startsWith("z.")).toBe(true);
    expect(compact.length).toBeLessThan(legacy.length * 0.55);
  });

  it("still decodes legacy object JSON shares", () => {
    const legacy = encodeJsonPayload(sampleWarframe);
    expect(decodeBuild(legacy)).toEqual(sampleWarframe);
  });

  it("async encode/decode round-trips", async () => {
    const code = await encodeBuildAsync(sampleWarframe);
    expect(code.startsWith("z.")).toBe(true);
    const decoded = await decodeBuildAsync(code);
    expect(decoded).toEqual({
      type: "warframe",
      itemId: "qorvex",
      mods: sampleWarframe.mods,
      arcanes: sampleWarframe.arcanes,
    });
  });
});

describe("isLocalBuildId", () => {
  it("detects offline localStorage ids", () => {
    expect(isLocalBuildId("1730000000000_abc1234")).toBe(true);
  });

  it("rejects cloud cuid-style ids", () => {
    expect(isLocalBuildId("clxyz0123456789abcdefgh")).toBe(false);
  });
});
