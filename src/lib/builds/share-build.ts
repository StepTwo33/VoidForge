import { toast } from "sonner";
import {
  buildShareUrl,
  encodeBuild,
  isLocalBuildId,
  type ShareableBuild,
} from "@/lib/builds/build-url";
import { copyTextToClipboard } from "@/lib/display/clipboard";

export type ShareBuildOutcome =
  | { kind: "copied"; url: string }
  | { kind: "encode_failed" }
  | { kind: "copy_failed"; url: string };

/**
 * Copy a shareable link for the current builder state.
 * - Public cloud builds → `/build/{id}` (community page)
 * - Otherwise → compact `/{builder}?build=` URL (no save required)
 */
export async function shareBuilderBuild(opts: {
  isPublic: boolean;
  buildId: string | null;
  fallback: ShareableBuild;
}): Promise<ShareBuildOutcome> {
  const canUseCommunityUrl =
    opts.isPublic &&
    Boolean(opts.buildId) &&
    !isLocalBuildId(opts.buildId!);

  let url: string;
  if (canUseCommunityUrl) {
    url = `${window.location.origin}/build/${opts.buildId}`;
  } else {
    const encoded = encodeBuild(opts.fallback);
    if (!encoded) {
      toast.error("Could not create share link", {
        description: "Build data could not be encoded. Try renaming if it has unusual characters.",
      });
      return { kind: "encode_failed" };
    }
    url = window.location.origin + buildShareUrl(opts.fallback);
  }

  const ok = await copyTextToClipboard(url);
  if (ok) {
    toast.success("Share link copied!", {
      description: canUseCommunityUrl
        ? "Community build link copied to clipboard"
        : "Anyone with this link can open the build",
    });
    return { kind: "copied", url };
  }
  toast.error("Could not copy link", { description: url });
  return { kind: "copy_failed", url };
}
