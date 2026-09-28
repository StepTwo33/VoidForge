/** Allowed `Build.type` values — must match client `SavedBuild` and Prisma usage. */
export const ALLOWED_BUILD_TYPES = new Set([
  "weapon",
  "warframe",
  "companion",
  "modular",
  "archwing",
  "railjack",
  "loadout",
]);

export function isAllowedBuildType(type: unknown): type is string {
  return typeof type === "string" && ALLOWED_BUILD_TYPES.has(type);
}

export function safeParseBuildJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Primary item id for filtering public builds (denormalized on Build.itemId). */
export function extractBuildItemId(type: string, data: unknown): string {
  if (!data || typeof data !== "object") return "";

  const d = data as Record<string, unknown>;

  switch (type) {
    case "weapon":
      return typeof d.weaponId === "string" ? d.weaponId : "";
    case "warframe":
      return typeof d.warframeId === "string" ? d.warframeId : "";
    case "companion":
      return typeof d.companionId === "string" ? d.companionId : "";
    case "modular": {
      const modularType = typeof d.modularType === "string" ? d.modularType : "";
      const parts = d.parts as Record<string, string> | undefined;
      if (!modularType || !parts) return modularType;
      const primary =
        parts.chamber ?? parts.strike ?? parts.prism ?? Object.values(parts)[0] ?? "";
      return primary ? `${modularType}:${primary}` : modularType;
    }
    case "archwing":
      if (typeof d.frameId === "string" && d.frameId) return d.frameId;
      if (typeof d.weaponId === "string" && d.weaponId) return d.weaponId;
      return "";
    case "railjack":
      if (typeof d.reactorId === "string" && d.reactorId) return d.reactorId;
      return "railjack";
    case "loadout": {
      const wf = d.warframeBuild as { warframeId?: string } | undefined;
      if (typeof wf?.warframeId === "string" && wf.warframeId) return wf.warframeId;
      const primary = d.primaryBuild as { weaponId?: string } | undefined;
      if (typeof primary?.weaponId === "string" && primary.weaponId) return primary.weaponId;
      return "loadout";
    }
    default:
      return "";
  }
}

export interface PublicBuildSummary {
  id: string;
  name: string;
  description: string;
  type: string;
  itemId: string;
  upvoteCount: number;
  createdAt: number;
  updatedAt: number;
  /** Meta tags (steel_path, budget, …). */
  tags?: string[];
  author: {
    username: string;
    profileSlug?: string | null;
    image: string | null;
    /** True when the author has a Supporter badge. */
    supporter?: boolean;
  };
}
