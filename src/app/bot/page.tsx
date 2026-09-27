"use client";

import Link from "next/link";
import { PageShell, PageMain, PageHero } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Bot, Bell, Radio, Store, ArrowRight, ExternalLink } from "lucide-react";

export default function BotLandingPage() {
  return (
    <PageShell>
      <PageMain maxWidth="lg" className="py-10 sm:py-14">
        <PageHero
          title="Voidforge Bot"
          description="World-state alerts, vendor pings, and open-world cycles — configured from the web, posted to Discord."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Feature
            icon={Bell}
            title="Missions"
            body="Sortie, Archon Hunt, and Arbitration rotations to the channels you choose."
          />
          <Feature
            icon={Store}
            title="Vendors"
            body="Baro, Varzia, Darvo, Teshin, Nightwave, open-world bounties, and Simaris."
          />
          <Feature
            icon={Radio}
            title="Cycles"
            body="Cetus, Vallis, Cambion, Duviri, and Earth transitions without spam."
          />
        </div>

        <div className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/15 p-2.5 text-primary">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Configure your servers</h2>
                <p className="mt-1 text-sm text-muted-foreground max-w-md">
                  Link Discord, pick a guild, and route each alert type to the right channel.
                  No slash-command config maze.
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href="/bot/dashboard">
                Open dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 space-y-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Slash commands (once the bot is online)</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/worldstate</code> — snapshot
            </li>
            <li>
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/alerts</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/invasions</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/fissures</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/events</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/news</code>
            </li>
            <li>
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/sortie</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/archon</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/arbitration</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/archimedea</code>
            </li>
            <li>
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/baro</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/varzia</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/darvo</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/teshin</code>
            </li>
            <li>
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/nightwave</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/bounties</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/simaris</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/outpost</code>,{" "}
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/construction</code>
            </li>
            <li>
              <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/cycles</code> — open-world timers (incl. Zariman)
            </li>
          </ul>
          <p className="pt-2">
            Run the bot process with{" "}
            <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">npm run bot</code> after setting{" "}
            <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">DISCORD_BOT_TOKEN</code> and{" "}
            <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">DISCORD_CLIENT_ID</code>.
          </p>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Fan project — not affiliated with Digital Extremes. Worldstate data via{" "}
          <a
            href="https://docs.warframestat.us/"
            className="underline underline-offset-2 hover:text-foreground inline-flex items-center gap-0.5"
            target="_blank"
            rel="noreferrer"
          >
            warframestat.us
            <ExternalLink className="h-3 w-3" />
          </a>
          .
        </p>
      </PageMain>
    </PageShell>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-4">
      <Icon className="h-5 w-5 text-primary mb-2" />
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
