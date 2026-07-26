"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight, ThumbsUp, Trash2 } from "lucide-react";
import { buildOpenUrl } from "@/lib/builds/build-url";
import { useStaffRole } from "@/lib/auth/use-staff";
import { useConfirmDialog } from "@/components/confirm-dialog-provider";

export type PublicProfileBuild = {
  id: string;
  name: string;
  description: string;
  type: string;
  upvoteCount: number;
  updatedAt: string | Date;
};

export function PublicProfileBuilds({ builds }: { builds: PublicProfileBuild[] }) {
  const isStaff = useStaffRole();
  const { prompt } = useConfirmDialog();
  const router = useRouter();
  const [rows, setRows] = useState(builds);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleStaffDelete = async (build: PublicProfileBuild) => {
    const reason = await prompt({
      title: "Delete this build?",
      description: `"${build.name}" will be permanently removed. The owner will get an email with your reason (if you add one).`,
      inputLabel: "Reason for the owner (optional)",
      placeholder: "e.g. Spam / misleading / guideline issue",
      confirmLabel: "Delete & notify",
      destructive: true,
    });
    if (reason === null) return;

    setDeletingId(build.id);
    try {
      const res = await fetch(`/api/builds/${build.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim(), notifyOwner: true }),
      });
      if (!res.ok) {
        toast.error("Could not delete build");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { notified?: boolean };
      setRows((prev) => prev.filter((b) => b.id !== build.id));
      router.refresh();
      toast.success(
        data.notified
          ? "Build deleted — owner emailed"
          : "Build deleted (no email sent; owner may have no address)",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12 rounded-xl border border-dashed border-border">
        No public builds yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {rows.map((build) => (
        <div
          key={build.id}
          className="flex items-stretch rounded-lg border border-border bg-card overflow-hidden group"
        >
          <Link
            href={buildOpenUrl(build.type, build.id)}
            className="flex flex-1 items-center gap-3 p-4 min-w-0 hover:bg-muted/30 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {build.name}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                <span className="capitalize">{build.type}</span>
                <span>•</span>
                <span>{new Date(build.updatedAt).toLocaleDateString()}</span>
                {build.upvoteCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-0.5">
                      <ThumbsUp className="h-3 w-3" />
                      {build.upvoteCount}
                    </span>
                  </>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
          </Link>
          {isStaff && (
            <button
              type="button"
              onClick={() => handleStaffDelete(build)}
              disabled={deletingId === build.id}
              title="Delete build (staff)"
              className="px-3.5 shrink-0 border-l border-border flex items-center justify-center text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
