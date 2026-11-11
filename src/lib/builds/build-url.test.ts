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
  shareExaltedToBuildSlice,
  shareFormToBuildSlice,
  warframeBuildToShare,
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

describe("dual-form Warframe share links (Shadow / Orion)", () => {
  const sevagoth = warframeBuildToShare({
    warframeId: "sevagoth_prime",
    mods: [{ modId: "intensify_r3", rank: 5, slotIndex: 1 }],
    arcaneIds: ["molt_augmented", null],
    arcaneRanks: [5, 5],
    slotPolarities: { 3: "naramon" },
    shards: [{ id: "tauforged_crimson_shard", bonus: "abilityStrength" }],
    dualFormBuilds: {
      shadow: {
        mods: [
          { modId: "stretch_r3", rank: 5, slotIndex: 1 },
          { modId: "vitality_r3", rank: 10, slotIndex: 2 },
        ],
        arcaneIds: ["arcane_grace", null],
        arcaneRanks: [3, 5],
        slotPolarities: { 4: "madurai" },
      },
    },
  });

  it("puts the default form at the top level and the Shadow in dualFormBuilds", () => {
    expect(sevagoth.itemId).toBe("sevagoth_prime");
    expect(sevagoth.mods.map((m) => m.id)).toEqual(["intensify_r3"]);
    expect(sevagoth.arcanes).toEqual(["molt_augmented", ""]);
    expect(sevagoth.slotPolarities).toEqual({ "3": "naramon" });
    expect(sevagoth.dualFormBuilds?.shadow.mods.map((m) => m.id)).toEqual(["stretch_r3", "vitality_r3"]);
    expect(sevagoth.dualFormBuilds?.shadow.arcanes).toEqual(["arcane_grace", ""]);
    expect(sevagoth.dualFormBuilds?.shadow.slotPolarities).toEqual({ "4": "madurai" });
  });

  it("round-trips through pack / unpack and encode / decode, including Orion", () => {
    const packed = packShareableBuild(sevagoth);
    const extras = packed[4] as Record<string, unknown>;
    expect(extras.df).toBeTruthy();
    const unpacked = unpackShareableBuild(packed);
    expect(unpacked?.dualFormBuilds?.shadow.mods).toEqual(sevagoth.dualFormBuilds?.shadow.mods);
    expect(unpacked?.mods).toEqual(sevagoth.mods);
    expect(unpacked?.shards).toEqual(sevagoth.shards);
    expect(decodeBuild(encodeBuild(sevagoth))).toEqual(unpacked);

    const orion = warframeBuildToShare({
      warframeId: "sirius_orion",
      mods: [{ modId: "continuity_r3", rank: 5, slotIndex: 1 }],
      dualFormBuilds: { orion: { mods: [{ modId: "vitality_r3", rank: 10, slotIndex: 2 }] } },
    });
    expect(decodeBuild(encodeBuild(orion))?.dualFormBuilds?.orion.mods[0]?.id).toBe("vitality_r3");
    expect(decodeBuild(encodeBuild(orion))?.mods[0]?.id).toBe("continuity_r3");
  });

  it("still decodes older share links that have no second form", () => {
    const old = packShareableBuild(sampleWarframe);
    const extras = old[4] as Record<string, unknown> | undefined;
    expect(extras?.df).toBeUndefined();
    const unpacked = unpackShareableBuild(old);
    expect(unpacked?.dualFormBuilds).toBeUndefined();
    expect(unpacked?.itemId).toBe("qorvex");
    expect(decodeBuild(encodeBuild(sampleWarframe))?.mods).toEqual(sampleWarframe.mods);
    // A pre-built packed payload (the exact shape older clients emit) still unpacks.
    const legacyPacked = [1, "f", "sevagoth", [["intensify_r3", 5, 1]], { a: ["molt_augmented"] }];
    const fromLegacy = unpackShareableBuild(legacyPacked);
    expect(fromLegacy).toEqual({
      type: "warframe",
      itemId: "sevagoth",
      mods: [{ id: "intensify_r3", rank: 5, slotIndex: 1 }],
      arcanes: ["molt_augmented"],
    });
    expect(fromLegacy?.dualFormBuilds).toBeUndefined();
  });

  it("omits an empty second form from the packed extras", () => {
    const empty = warframeBuildToShare({
      warframeId: "sevagoth",
      mods: [{ modId: "intensify_r3", rank: 5, slotIndex: 1 }],
      dualFormBuilds: { shadow: { mods: [], arcaneIds: [null, null], arcaneRanks: [5, 5], slotPolarities: {} } },
    });
    expect(empty.dualFormBuilds).toBeUndefined();
    expect((packShareableBuild(empty)[4] as Record<string, unknown> | undefined)?.df).toBeUndefined();
  });

  it("shareFormToBuildSlice restores mods, polarities and arcanes for the builder", () => {
    const slice = shareFormToBuildSlice(sevagoth.dualFormBuilds!.shadow);
    expect(slice.mods).toEqual([
      { modId: "stretch_r3", rank: 5, slotIndex: 1 },
      { modId: "vitality_r3", rank: 10, slotIndex: 2 },
    ]);
    expect(slice.slotPolarities).toEqual({ 4: "madurai" });
    expect(slice.arcaneIds).toEqual(["arcane_grace", null]);
    expect(slice.arcaneRanks).toEqual([3, 5]);
  });
});

describe("Helminth and exalted weapon share links", () => {
  const mesa = warframeBuildToShare({
    warframeId: "mesa_prime",
    mods: [{ modId: "intensify_r3", rank: 5, slotIndex: 1 }],
    arcaneIds: ["molt_augmented", null],
    arcaneRanks: [5, 5],
    hasOrokinReactor: true,
    helminthSlot: 3,
    helminthAbilityId: "helminth_nourish",
    exaltedMods: [
      { modId: "hornet_strike_r3", rank: 10, slotIndex: 0 },
      { modId: "lethal_torrent_r3", rank: 5, slotIndex: 1 },
    ],
    exaltedSlotPolarities: { 0: "madurai" },
    exaltedArcaneIds: ["arcane_acceleration", null],
    exaltedArcaneRanks: [3, 5],
    exaltedStanceModId: undefined,
    exaltedMeleeMods: [{ modId: "pressure_point_r3", rank: 10, slotIndex: 0 }],
    exaltedMeleeSlotPolarities: { 1: "naramon" },
    exaltedMeleeArcaneIds: ["melee_exposure", null],
    exaltedMeleeArcaneRanks: [2, 5],
    exaltedMeleeStanceModId: "severing_spring",
    arcaneStacksById: { molt_augmented: 200 },
    conditionalModStacksById: { growing_power: 1 },
  });

  it("puts Helminth, exalted weapons, reactor and stacks on the share payload", () => {
    expect(mesa.hasOrokinReactor).toBe(true);
    expect(mesa.helminthSlot).toBe(3);
    expect(mesa.helminthAbilityId).toBe("helminth_nourish");
    expect(mesa.exalted?.mods.map((m) => m.id)).toEqual(["hornet_strike_r3", "lethal_torrent_r3"]);
    expect(mesa.exalted?.arcanes).toEqual(["arcane_acceleration", ""]);
    expect(mesa.exalted?.slotPolarities).toEqual({ "0": "madurai" });
    expect(mesa.exaltedMelee?.mods[0]?.id).toBe("pressure_point_r3");
    expect(mesa.exaltedMelee?.stanceModId).toBe("severing_spring");
    expect(mesa.arcaneStacksById).toEqual({ molt_augmented: 200 });
    expect(mesa.conditionalModStacksById).toEqual({ growing_power: 1 });
  });

  it("round-trips through pack / unpack and encode / decode", () => {
    const packed = packShareableBuild(mesa);
    const extras = packed[4] as Record<string, unknown>;
    expect(extras.hr).toBe(1);
    expect(extras.h).toEqual([3, "helminth_nourish"]);
    expect(extras.x).toBeTruthy();
    expect(extras.xm).toBeTruthy();
    expect((extras.xm as Record<string, unknown>).st).toBe("severing_spring");
    expect(extras.as).toEqual({ molt_augmented: 200 });
    expect(extras.cm).toEqual({ growing_power: 1 });
    const unpacked = unpackShareableBuild(packed);
    expect(unpacked?.helminthSlot).toBe(3);
    expect(unpacked?.helminthAbilityId).toBe("helminth_nourish");
    expect(unpacked?.hasOrokinReactor).toBe(true);
    expect(unpacked?.exalted?.mods).toEqual(mesa.exalted?.mods);
    expect(unpacked?.exalted?.arcanes).toEqual(mesa.exalted?.arcanes);
    expect(unpacked?.exaltedMelee?.stanceModId).toBe("severing_spring");
    expect(unpacked?.arcaneStacksById).toEqual({ molt_augmented: 200 });
    expect(decodeBuild(encodeBuild(mesa))).toEqual(unpacked);
  });

  it("shareExaltedToBuildSlice restores mods, polarities, arcanes and stance", () => {
    const slice = shareExaltedToBuildSlice(mesa.exaltedMelee!);
    expect(slice.mods).toEqual([{ modId: "pressure_point_r3", rank: 10, slotIndex: 0 }]);
    expect(slice.slotPolarities).toEqual({ 1: "naramon" });
    expect(slice.arcaneIds).toEqual(["melee_exposure", null]);
    expect(slice.arcaneRanks).toEqual([2, 5]);
    expect(slice.stanceModId).toBe("severing_spring");
  });

  it("omits empty Helminth / exalted / reactor from packed extras", () => {
    const bare = warframeBuildToShare({
      warframeId: "mesa",
      mods: [{ modId: "intensify_r3", rank: 5, slotIndex: 1 }],
    });
    expect(bare.hasOrokinReactor).toBeUndefined();
    expect(bare.helminthSlot).toBeUndefined();
    expect(bare.exalted).toBeUndefined();
    expect(bare.exaltedMelee).toBeUndefined();
    const extras = packShareableBuild(bare)[4] as Record<string, unknown> | undefined;
    expect(extras?.hr).toBeUndefined();
    expect(extras?.h).toBeUndefined();
    expect(extras?.x).toBeUndefined();
    expect(extras?.xm).toBeUndefined();
    expect(extras?.as).toBeUndefined();
  });

  it("still decodes older share links that have none of the new keys", () => {
    const legacyPacked = [1, "f", "mesa", [["intensify_r3", 5, 1]], { a: ["molt_augmented"] }];
    const fromLegacy = unpackShareableBuild(legacyPacked);
    expect(fromLegacy).toEqual({
      type: "warframe",
      itemId: "mesa",
      mods: [{ id: "intensify_r3", rank: 5, slotIndex: 1 }],
      arcanes: ["molt_augmented"],
    });
    expect(fromLegacy?.helminthSlot).toBeUndefined();
    expect(fromLegacy?.exalted).toBeUndefined();
    expect(fromLegacy?.hasOrokinReactor).toBeUndefined();
    expect(fromLegacy?.dualFormBuilds).toBeUndefined();
  });
});
