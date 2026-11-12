import { describe, expect, it } from "vitest";
import { isEmptyShareableItem, prepareShareableItems, type ShareableItem } from "./shareable-items";

const item = (over: Partial<ShareableItem>): ShareableItem => ({
  id: over.id ?? "1",
  name: over.name ?? "X",
  type: over.type ?? "weapon",
  updatedAt: over.updatedAt ?? 1,
  data: over.data ?? {},
});

describe("shareable items", () => {
  it("treats a loadout with no slots as empty, and one with a warframe as filled", () => {
    expect(isEmptyShareableItem(item({ type: "loadout", name: "Empty draft", data: {} }))).toBe(true);
    expect(
      isEmptyShareableItem(item({ type: "loadout", data: { warframeBuild: { warframeId: "mesa_prime", mods: [] } } })),
    ).toBe(false);
  });

  it("treats a saved build with no item as empty, and one with a weapon as filled", () => {
    expect(isEmptyShareableItem(item({ type: "weapon", data: { mods: [] } }))).toBe(true);
    expect(isEmptyShareableItem(item({ type: "weapon", data: { weaponId: "braton_prime", mods: [] } }))).toBe(false);
  });

  it("drops empty drafts, id duplicates, and same type+name keeping the newest", () => {
    const list = prepareShareableItems([
      item({ id: "empty", name: "Empty draft", type: "loadout", data: {}, updatedAt: 9 }),
      item({ id: "a", name: "Steel Path Mesa Kit", type: "loadout", data: { warframeBuild: { warframeId: "mesa_prime" } }, updatedAt: 1 }),
      item({ id: "a", name: "Steel Path Mesa Kit", type: "loadout", data: { warframeBuild: { warframeId: "mesa_prime" } }, updatedAt: 5 }),
      item({ id: "b", name: "Steel Path Mesa Kit", type: "loadout", data: { warframeBuild: { warframeId: "mesa_prime" } }, updatedAt: 3 }),
      item({ id: "c", name: "Braton Prime", type: "weapon", data: { weaponId: "braton_prime" }, updatedAt: 2 }),
    ]);
    expect(list.map((i) => i.id)).toEqual(["a", "c"]);
  });
});
