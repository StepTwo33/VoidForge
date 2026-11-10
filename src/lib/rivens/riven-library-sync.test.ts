import { describe, expect, it } from "vitest";
import { cloudPayloadFor, cloudRivenToLocal, mergeCloudRivens } from "./riven-library-sync";
import type { SavedRiven } from "./riven-storage";
import type { SavedRiven as CloudSavedRiven } from "@/lib/riven/saved-rivens";

const cloud: CloudSavedRiven = {
  id: "c1", weaponId: "torid", name: "My lucky Torid", modId: "riven_rifle",
  stats: { criticalChance: 1.2, multishot: 0.8 }, polarity: "vazarin", drain: 15,
  rerolls: null, masteryRank: null, createdAt: 1, updatedAt: 2,
};

describe("account riven merge", () => {
  it("derives rank from the stored drain and keeps the name as typed", () => {
    const r = cloudRivenToLocal(cloud);
    expect(r.rank).toBe(5);
    expect(r.name).toBe("My lucky Torid");
    expect(r.weaponName).toBe("Torid");
  });

  it("keeps this device's rerolls and MR when the account has none stored", () => {
    const local = { ...cloudRivenToLocal(cloud), rerolls: 37, masteryRank: 14 } as SavedRiven;
    const [merged] = mergeCloudRivens([local], [cloud]);
    expect(merged).toMatchObject({ rerolls: 37, masteryRank: 14, rank: 5 });
  });

  it("uses account rerolls and MR when stored", () => {
    const [merged] = mergeCloudRivens([], [{ ...cloud, rerolls: 4, masteryRank: 11 }]);
    expect(merged).toMatchObject({ rerolls: 4, masteryRank: 11 });
  });

  it("sends the real drain for the riven's rank", () => {
    const r = { ...cloudRivenToLocal(cloud), rank: 3, rerolls: 9, masteryRank: 10 } as SavedRiven;
    expect(cloudPayloadFor(r, "riven_rifle")).toMatchObject({ drain: 13, rerolls: 9, masteryRank: 10 });
  });
});
