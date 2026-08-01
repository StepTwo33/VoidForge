"use client";

import Link from "next/link";
import { Swords, Shield, Bug, Wrench, BarChart3, Users, User, Github, Info, BookOpen, FolderOpen, Plane, Rocket } from "lucide-react";
import { VOIDFORGE_GITHUB_URL } from "@/lib/site/site-links";
import { PageShell, PageMain, PageHero, ContentPanel } from "@/components/page-shell";

export default function AboutPage() {
  return (
    <PageShell>
      <PageMain maxWidth="md">
        <PageHero
          icon={Info}
          accent="primary"
          title="About"
          highlight="Voidforge"
          description="A Warframe build planner and theorycrafting toolkit."
        />

        <div className="space-y-6">
          <ContentPanel>
            <h2 className="mb-3 text-lg font-semibold">What is Voidforge?</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Voidforge is a free build planner for Digital Extremes&apos; Warframe.
              It lets you theorycraft weapon, warframe, companion, archwing, railjack, and modular weapon builds
              with real-time stat calculations, elemental combo resolution, damage simulation, and
              time-to-kill estimates against every enemy faction. Browse the Codex to verify mod, arcane, and
              shard data, share builds with the community, and save complete loadouts locally or to your account.
            </p>
          </ContentPanel>

          <ContentPanel>
            <h2 className="mb-4 text-lg font-semibold">Features</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { icon: Swords, title: "Weapon Builder", desc: "Full mod, arcane, riven, and Incarnon support with burst/sustained DPS, status proc breakdowns, and elemental combo resolution." },
                { icon: Shield, title: "Warframe Builder", desc: "Mod slots, archon shards, Helminth abilities, ability scaling preview, augment detection, and survivability stats." },
                { icon: BarChart3, title: "Damage Simulator", desc: "Post-Update 32 enemy scaling, per-faction TTK with Viral/Corrosive status effects, DoT accounting, and armor DR." },
                { icon: Wrench, title: "Modular & Companion", desc: "Zaw, Kitgun, Amp, MOA, and companion builders with category-specific mod pools and riven support." },
                { icon: BookOpen, title: "Codex", desc: "Browse mods, arcanes, archon shards, weapons, and warframes — check drain, effects, arcane triggers, and data coverage." },
                { icon: Users, title: "Discover & Profiles", desc: "Publish builds, browse community loadouts, upvote favorites, and share a public profile at /u/yourname." },
                { icon: FolderOpen, title: "Loadout Manager", desc: "Save complete loadouts with warframe, weapons, and companion builds. Import and export locally or sync to your account." },
                { icon: Plane, title: "Archwing & Necramech", desc: "Dedicated builders for Archwing frames and Necramechs with real-time stat preview and mod capacity." },
                { icon: Rocket, title: "Railjack Builder", desc: "Configure Railjack components, turret stats, and Plexus mods for squad missions." },
                { icon: Bug, title: "Riven Grader", desc: "Grade your rivens against disposition-scaled stat pools with tier rankings and reroll cost reference." },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-lg border border-border/50 bg-background/40 p-4 transition-colors hover:border-primary/30"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="rounded-md bg-primary/10 p-1.5">
                      <f.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold">{f.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </ContentPanel>

          <ContentPanel>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Github className="h-5 w-5 text-primary" />
              Open Source
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              Voidforge is open source under the MIT license. You can browse the code, file issues, suggest features, or contribute pull requests on GitHub.
            </p>
            <a
              href={VOIDFORGE_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <Github className="h-4 w-4" />
              github.com/StepTwo33/Voidforge
            </a>
          </ContentPanel>

          <ContentPanel>
            <h2 className="mb-3 text-lg font-semibold">Data Sources</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              All weapon stats, mod values, warframe abilities, arcane effects, and enemy data are sourced from the{" "}
              <a href="https://wiki.warframe.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Official Warframe Wiki
              </a>{" "}
              and verified against in-game values. Voidforge is not affiliated with or endorsed by Digital Extremes.
            </p>
          </ContentPanel>

          <ContentPanel>
            <h2 className="mb-3 text-lg font-semibold">Feedback</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Found incorrect data or a missing entry? Use the{" "}
              <Link href="/report-issue" className="text-amber-400 hover:underline">Report Issue</Link>{" "}
              page to flag stat discrepancies or missing items. Staff and moderators review reports and can apply
              data corrections through the Codex and Data Fixes tools. Voidforge is built with Next.js, TypeScript, and Tailwind CSS.
            </p>
          </ContentPanel>

          <ContentPanel>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Users className="h-5 w-5 text-primary" />
              Contributors
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { name: "Step-Bro_Prime", role: "Lead Developer", profileUrl: "/u/steptwo" },
                { name: "Axel Shade", role: "Data & Design", profileUrl: "/u/axel-shade" },
              ].map((c) =>
                c.profileUrl ? (
                  c.profileUrl.startsWith("/") ? (
                    <Link
                      key={c.name}
                      href={c.profileUrl}
                      className="group flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 p-3 transition-all hover:border-primary/40 hover:bg-primary/5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold transition-colors group-hover:text-primary">{c.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{c.role}</div>
                      </div>
                      <User className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  ) : (
                    <a
                      key={c.name}
                      href={c.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 p-3 transition-all hover:border-primary/40 hover:bg-primary/5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold transition-colors group-hover:text-primary">{c.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{c.role}</div>
                      </div>
                      <User className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  )
                ) : (
                  <div
                    key={c.name}
                    className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {c.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{c.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{c.role}</div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </ContentPanel>

          <p className="text-center text-xs text-muted-foreground/70">
            Warframe and the Warframe logo are registered trademarks of Digital Extremes Ltd.
            Voidforge is a fan-made tool and is not affiliated with, endorsed, or sponsored by Digital Extremes.
          </p>
        </div>
      </PageMain>
    </PageShell>
  );
}
