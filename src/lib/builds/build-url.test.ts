import { describe, expect, it } from "vitest";
import {
  decodeBuild,
  decodeJsonPayload,
  encodeBuild,
  encodeJsonPayload,
  isLocalBuildId,
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

describe("encodeBuild / decodeBuild", () => {
  it("round-trips a weapon share payload", () => {
    const build: ShareableBuild = {
      type: "weapon",
      itemId: "lesion",
      mods: [{ id: "pressure_point", rank: 5 }],
      arcanes: ["melee_afflictions"],
    };
    const code = encodeBuild(build);
    expect(decodeBuild(code)).toEqual(build);
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
