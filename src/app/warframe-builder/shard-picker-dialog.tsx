"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArchonShardIcon } from "@/components/archon-shard-slot";
import { SHARD_BONUS_LABELS, formatShardBonusValue } from "@/lib/display/shard-display";
import type { ArchonShard } from "@/lib/types";

export function ShardPickerDialog({
  open,
  onOpenChange,
  allArchonShards,
  onSelectBonus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allArchonShards: ArchonShard[];
  onSelectBonus: (shard: ArchonShard, key: string, value: number) => void;
}) {
  const [selectedShard, setSelectedShard] = useState<ArchonShard | null>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setSelectedShard(null);
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {selectedShard ? `${selectedShard.name} — Select Bonus` : "Select Archon Shard"}
          </DialogTitle>
        </DialogHeader>

        {selectedShard ? (
          <div className="space-y-2">
            {Object.entries(selectedShard.statBonuses).map(([key, value]) => (
              <button
                key={key}
                onClick={() => {
                  onSelectBonus(selectedShard, key, value);
                  setSelectedShard(null);
                }}
                className="w-full text-left p-3 rounded-lg border border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
              >
                <span className="text-sm font-medium">{SHARD_BONUS_LABELS[key] || key}</span>
                <span className="text-sm text-purple-700 dark:text-purple-400 ml-2">
                  {formatShardBonusValue(key, value)}
                </span>
              </button>
            ))}
            <button
              onClick={() => setSelectedShard(null)}
              className="w-full text-sm text-muted-foreground hover:text-foreground py-2"
            >
              ← Back to shard list
            </button>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-1">
              {allArchonShards.map((shard) => (
                <button
                  key={shard.id}
                  onClick={() => setSelectedShard(shard)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all flex items-center gap-3"
                >
                  <ArchonShardIcon color={shard.color} tier={shard.tier} className="shrink-0" />
                  <div>
                    <span className="text-sm font-medium">{shard.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{shard.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
