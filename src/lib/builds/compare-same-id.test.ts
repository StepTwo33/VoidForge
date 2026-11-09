import { describe, expect, it } from "vitest";
import { compareIdsTaken, isSameCompareSelection } from "@/lib/builds/compare-same-id";

describe("compare same-id guard", () => {
  it("treats the other side's id and cloud id as taken", () => {
    const taken = compareIdsTaken(["local_1", null, "cloud_9", ""]);
    expect(taken).toEqual(["local_1", "cloud_9"]);
    expect(isSameCompareSelection("local_1", taken)).toBe(true);
    expect(isSameCompareSelection("cloud_9", taken)).toBe(true);
    expect(isSameCompareSelection("other", taken)).toBe(false);
  });
});
