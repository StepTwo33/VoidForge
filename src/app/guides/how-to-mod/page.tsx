import Link from "next/link";
import { ContentPanel } from "@/components/page-shell";
import { GuideCtaLink } from "@/components/guides/how-to-mod-ui";
import { HOW_TO_MOD_SECTIONS } from "@/lib/guides/how-to-mod-sections";

export default function HowToModOverviewPage() {
  return (
    <>
      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Start here</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Good modding means every slot has a reason to be there. Pick what the build is
          for, amplify that, and skip extras that fight your goal. You do not need every
          rare mod on day one. You need a clear plan and the habits below.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">One job per build.</span> A
            primer, a crit DPS stick, a CC frame, and a tank all want different mods.
            Mixing goals usually wastes capacity.
          </li>
          <li>
            <span className="font-medium text-foreground">Match the item, not a checklist.</span>{" "}
            Read base stats and abilities first. Mods should boost what is already strong,
            not force a weapon or frame into a role it cannot do well.
          </li>
          <li>
            <span className="font-medium text-foreground">Don&apos;t double the same bonus.</span>{" "}
            Two mods that both add &quot;damage&quot; often share one pool. The second one
            is usually a weak slot.
          </li>
          <li>
            <span className="font-medium text-foreground">Forma after the plan is set.</span>{" "}
            Polarize for a build you intend to keep, not after every shiny new mod drop.
          </li>
        </ul>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-4 text-lg font-semibold">Sections</h2>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          Start with Basics if you are new, then Weapons. Frames and companions after that.
          Archwing and mechs use the same habits with their own mod pools.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {HOW_TO_MOD_SECTIONS.filter((s) => s.id !== "overview").map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.id}
                href={section.href}
                className="rounded-lg border border-border/50 bg-background/40 p-4 transition-colors hover:border-primary/30"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-1.5">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{section.label}</span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {section.description}
                </p>
              </Link>
            );
          })}
        </div>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Practice in FrameHub</h2>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          Try swaps here and watch the numbers before you spend Forma in-game. When a build
          feels right, copy it into your Arsenal.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <GuideCtaLink href="/weapon-builder">Weapon Builder</GuideCtaLink>
          <GuideCtaLink href="/warframe-builder">Warframe Builder</GuideCtaLink>
          <GuideCtaLink href="/companion-builder">Companion Builder</GuideCtaLink>
          <GuideCtaLink href="/archwing-builder">Archwing &amp; Necramech</GuideCtaLink>
        </div>
      </ContentPanel>
    </>
  );
}
