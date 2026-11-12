import type { SavedBuild } from "@/lib/builds/build-storage";

/**
 * Newest-first suggestions for the Compare page: already-merged Yours list
 * (device + account), minus anything already sitting on a side.
 */
export function pickCompareSuggestions(
  builds: SavedBuild[],
  opts: { excludeIds?: readonly (string | null | undefined)[]; limit?: number } = {},
): SavedBuild[] {
  const exclude = new Set((opts.excludeIds ?? []).filter((id): id is string => Boolean(id)));
  const limit = opts.limit ?? 8;
  return builds.filter((b) => !exclude.has(b.id)).slice(0, limit);
}

export function compareSuggestionsEmptyCopy(opts: {
  signedIn: boolean;
  typeLabel: string;
}): { title: string; description: string; showSignIn: boolean } {
  if (opts.signedIn) {
    return {
      title: `No saved ${opts.typeLabel} builds yet`,
      description: "Save a build from the builder, then pick it here to compare.",
      showSignIn: false,
    };
  }
  return {
    title: "No builds on this device",
    description:
      "Sign in to see builds saved to your account, or save one locally from a builder first.",
    showSignIn: true,
  };
}

export function compareTypeLabel(type: string): string {
  switch (type) {
    case "warframe":
      return "warframe";
    case "weapon":
      return "weapon";
    case "companion":
      return "companion";
    case "modular":
      return "modular";
    case "archwing":
      return "archwing";
    case "railjack":
      return "railjack";
    case "loadout":
      return "loadout";
    default:
      return "build";
  }
}
