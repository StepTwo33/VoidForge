import { toast } from "sonner";

/** Remove `?build=` from the address bar so a refresh doesn't repeat the error. */
function stripBuildParam(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has("build")) return;
  url.searchParams.delete("build");
  const qs = url.searchParams.toString();
  window.history.replaceState(window.history.state, "", qs ? `${url.pathname}?${qs}` : url.pathname);
}

/**
 * Call when a builder found `?build=` but the code could not be decoded.
 * Shows one error toast and strips the param. No-op when there is no `?build=`.
 */
export function reportUnreadableShareLink(params: URLSearchParams): boolean {
  if (!params.get("build")) return false;
  toast.error("Couldn't read this share link", {
    id: "share-link-unreadable",
    description: "The build code is incomplete or damaged. Ask for a fresh link, or paste the code in Share Builds → Import.",
  });
  stripBuildParam();
  return true;
}
