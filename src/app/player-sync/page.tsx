"use client";

import { useRouter } from "next/navigation";
import { PageShell, PageMain, PageHero } from "@/components/page-shell";
import { WarframePlayerSync } from "@/components/warframe-player-sync";
import { RefreshCw } from "lucide-react";

export default function PlayerSyncPage() {
  const router = useRouter();

  return (
    <PageShell>
      <PageMain maxWidth="md">
        <PageHero
          icon={RefreshCw}
          accent="primary"
          title="Player Sync"
          description="Import your active Warframe loadout from PC, Xbox, PlayStation, or Switch — the same data source used by the official Arsenal Twitch extension."
        />
        <WarframePlayerSync
          onImported={() => {
            router.push("/loadouts");
          }}
        />
      </PageMain>
    </PageShell>
  );
}
