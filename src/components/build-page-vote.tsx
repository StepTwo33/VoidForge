"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BuildVoteButton } from "@/components/public-build-row";
import { Button } from "@/components/ui/button";

interface BuildPageVoteProps {
  buildId: string;
  initialUpvoteCount: number;
  isPublic: boolean;
  builderUrl?: string;
  openLabel?: string;
}

export function BuildPageVote({ buildId, initialUpvoteCount, isPublic, builderUrl, openLabel = "Open in Builder" }: BuildPageVoteProps) {
  const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (!isPublic) return;
    fetch(`/api/builds/${buildId}/vote`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setUpvoteCount(data.upvoteCount);
        setVoted(data.voted);
      })
      .catch(() => {});
  }, [buildId, isPublic]);

  return (
    <div className="flex flex-col sm:items-end gap-3 shrink-0">
      {isPublic && (
        <BuildVoteButton
          buildId={buildId}
          initialCount={upvoteCount}
          initialVoted={voted}
          canVote
          size="md"
          className="self-start sm:self-end"
        />
      )}
      {builderUrl && builderUrl !== "#" && (
        <Button asChild className="min-h-11 bg-blue-600 hover:bg-blue-700 text-white shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
          <Link href={builderUrl}>{openLabel}</Link>
        </Button>
      )}
    </div>
  );
}
