import { describe, expect, it } from "vitest";
import { localRivenAfterCloudSave, rivenSaveId } from "@/lib/rivens/riven-save-id";

describe("riven library save id", () => {
  it("sends a local riven_ id instead of omitting it", () => {
    expect(rivenSaveId("riven_1_abc")).toBe("riven_1_abc");
    expect(rivenSaveId("cuid_cloud")).toBe("cuid_cloud");
  });

  it("replaces the local row when the account assigns a different id", () => {
    const local = { id: "riven_1_abc", name: "Crit" };
    expect(localRivenAfterCloudSave(local, "riven_1_abc").removedId).toBeUndefined();
    const moved = localRivenAfterCloudSave(local, "cloud_9");
    expect(moved.saved.id).toBe("cloud_9");
    expect(moved.removedId).toBe("riven_1_abc");
  });
});
