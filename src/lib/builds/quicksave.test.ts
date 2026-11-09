import { describe, expect, it } from "vitest";
import { quicksaveRecord, saveAsRecord, saveIdentityId } from "@/lib/builds/quicksave";

const identity = {
  id: "cloud_1",
  name: "Braton",
  description: "notes",
  isPublic: true,
  tags: ["steel_path"],
  type: "weapon" as const,
  createdAt: 100,
};

describe("quicksave vs save as", () => {
  it("updates the same id without changing name, visibility, or tags", () => {
    const next = quicksaveRecord(identity, { weaponId: "braton" });
    expect(next.id).toBe("cloud_1");
    expect(next.name).toBe("Braton");
    expect(next.isPublic).toBe(true);
    expect(next.tags).toEqual(["steel_path"]);
    expect(next.createdAt).toBe(100);
    expect(next.data).toEqual({ weaponId: "braton" });
    expect(next.tags).not.toBe(identity.tags);
  });

  it("save as allocates a different id", () => {
    const copy = saveAsRecord(identity, { weaponId: "braton" });
    expect(copy.id).not.toBe(identity.id);
    expect(saveIdentityId(identity.id, true)).not.toBe(identity.id);
    expect(saveIdentityId(identity.id, false)).toBe(identity.id);
    expect(saveIdentityId(null, false)).not.toBe("");
  });
});
