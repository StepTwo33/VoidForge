import { ContentPanel } from "@/components/page-shell";
import {
  GuideCtaLink,
  GuideMistake,
  GuideTip,
} from "@/components/guides/how-to-mod-ui";

export default function HowToModArcanesPage() {
  return (
    <>
      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Not a ninth mod</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Arcanes are a parallel investment layer. They sit in their own slots, rank up on
          their own track, and do not spend mod capacity. Treat them as extra power that must
          earn the slot, not as fashion after the grid is done.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Type must match the item: warframe, primary, secondary, melee, Amp, and so on.
            The wrong category will not equip.
          </li>
          <li>
            Rank matters. An unranked Arcane is often a tease of the real effect. Invest in
            the ones you actually keep.
          </li>
          <li>
            Some gear has more than one Arcane slot. Fill them with different jobs when you
            can, not two copies of the same fantasy.
          </li>
        </ul>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Pick for uptime</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A lot of Arcanes are conditional. If you never trigger the condition, the slot is
          empty. Build so the Arcane turns on in the content you run.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Do:</span> pair on-kill, on-crit,
            or on-status Arcanes with a playstyle that proc them constantly.
          </li>
          <li>
            <span className="font-medium text-foreground">Don&apos;t:</span> park a
            headshot-only Arcane on a beam primer you never aim at heads.
          </li>
          <li>
            Survivability Arcanes on frames are real power when they keep you casting. Dead
            frames still deal zero damage.
          </li>
        </ul>
        <GuideTip>
          In the builders, swap Arcanes the same way you swap mods. If the number barely
          moves because the condition never fires in your rotation, pick something reliable.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Don&apos;t echo the mod grid</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            If mods already flood one additive pool, an Arcane that only adds more of the
            same is often a weak spend. Prefer a multiplier, a new conditional, or a gap
            (energy, survivability, multishot-style effects).
          </li>
          <li>
            Frame Arcanes and weapon Arcanes solve different problems. A strong weapon Arcane
            does not replace a frame that cannot stay alive or cast.
          </li>
          <li>
            Browse effects in the Codex when you are unsure what exists for a slot. Then test
            the shortlist on a real build.
          </li>
        </ul>
        <GuideMistake>
          Collecting every shiny Arcane and leaving them unranked while the mod grid is
          already overtuned. Rank the one or two that match the build you play.
        </GuideMistake>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <GuideCtaLink href="/codex?section=arcanes">Codex: Arcanes</GuideCtaLink>
          <GuideCtaLink href="/weapon-builder">Weapon Builder</GuideCtaLink>
          <GuideCtaLink href="/warframe-builder">Warframe Builder</GuideCtaLink>
        </div>
      </ContentPanel>
    </>
  );
}
