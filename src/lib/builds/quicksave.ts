import { generateBuildId, type SavedBuild } from "@/lib/builds/build-storage";

export interface BuildIdentity {
  id: string;
  name: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
  type: SavedBuild["type"];
  createdAt: number;
}

/** Update keeps the open build's id, name, visibility, and tags. Only the payload changes. */
export function quicksaveRecord(identity: BuildIdentity, data: unknown): SavedBuild {
  return {
    id: identity.id,
    name: identity.name,
    description: identity.description,
    isPublic: identity.isPublic,
    tags: identity.tags ? [...identity.tags] : undefined,
    type: identity.type,
    createdAt: identity.createdAt,
    updatedAt: Date.now(),
    data,
  };
}

/** Save as allocates a new id. The previous build is left untouched. */
export function saveAsRecord(
  identity: Omit<BuildIdentity, "id" | "createdAt">,
  data: unknown,
): SavedBuild {
  const now = Date.now();
  return {
    id: generateBuildId(),
    name: identity.name,
    description: identity.description,
    isPublic: identity.isPublic,
    tags: identity.tags ? [...identity.tags] : undefined,
    type: identity.type,
    createdAt: now,
    updatedAt: now,
    data,
  };
}

export function saveIdentityId(currentId: string | null | undefined, asNew: boolean): string {
  if (asNew || !currentId) return generateBuildId();
  return currentId;
}
