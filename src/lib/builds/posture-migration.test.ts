import { describe, expect, it } from "vitest";
import { migrateCompanionPosture, loadoutFromSavedBuild } from "@/lib/builds/loadouts";
import { migratePostureToPostureSlot } from "@/lib/weapons/companion-weapons";
import type { Loadout } from "@/lib/types";

const kavat = { type: "kavat" };
// Shape seen in playersync-stepbro-prod-mapped.json (Vasca claws before the posture mapping).
const oldClaws = () => [
  { modId: "balanced_posture", rank: 3, slotIndex: 0 },
  { modId: "maul", rank: 10, slotIndex: 1 },
  { modId: "bite", rank: 10, slotIndex: 2 },
];

describe("posture load migration (R10-G)", () => {
  it("moves a posture mod from a regular claw slot into the Posture slot (8)", () => {
    const out = migratePostureToPostureSlot(oldClaws(), kavat);
    expect(out.map((m) => `${m.slotIndex}:${m.modId}`)).toEqual(["8:balanced_posture", "1:maul", "2:bite"]);
  });

  it("is idempotent", () => {
    const once = migratePostureToPostureSlot(oldClaws(), kavat);
    const twice = migratePostureToPostureSlot(once, kavat);
    expect(twice).toBe(once);
  });

  it("leaves an occupied Posture slot, non-beasts, and builds without posture mods alone", () => {
    const occupied = [...oldClaws(), { modId: "elusive_posture", rank: 3, slotIndex: 8 }];
    expect(migratePostureToPostureSlot(occupied, kavat)).toBe(occupied);
    const sentinel = oldClaws();
    expect(migratePostureToPostureSlot(sentinel, { type: "sentinel" })).toBe(sentinel);
    const none = oldClaws().slice(1);
    expect(migratePostureToPostureSlot(none, kavat)).toBe(none);
  });

  it("applies to stored loadouts and cloud loadouts by companion id", () => {
    const lo = { companionBuild: { companionId: "vasca", mods: [], weaponMods: oldClaws(), hasReactor: false, hasCatalyst: false } } as Pick<Loadout, "companionBuild">;
    const migrated = migrateCompanionPosture(lo);
    expect(migrated.companionBuild!.weaponMods.find((m) => m.modId === "balanced_posture")!.slotIndex).toBe(8);
    expect(migrateCompanionPosture(migrated)).toBe(migrated);
    const cloud = loadoutFromSavedBuild({ id: "c", name: "c", type: "loadout", createdAt: 0, updatedAt: 0, data: lo } as never);
    expect(cloud.companionBuild!.weaponMods[0].slotIndex).toBe(8);
  });
});
