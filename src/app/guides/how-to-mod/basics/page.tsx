import { ContentPanel } from "@/components/page-shell";
import {
  GuideCtaLink,
  GuideMistake,
  GuideTip,
} from "@/components/guides/how-to-mod-ui";

export default function HowToModBasicsPage() {
  return (
    <>
      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Capacity</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Every mod has a drain cost. Your item has a capacity budget. Rank a mod up and the
          drain usually goes up with it. Go over budget and the build is illegal.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Base capacity is low (around 30). You will feel cramped until you invest.
          </li>
          <li>
            A <span className="font-medium text-foreground">Catalyst</span> (weapons) or{" "}
            <span className="font-medium text-foreground">Reactor</span> (warframes and
            similar) doubles capacity. This is the first real unlock for serious builds.
          </li>
          <li>
            Mastery Rank 30+ adds a little extra capacity. Nice, but it does not replace a
            potato.
          </li>
          <li>
            On warframes, a matching-polarity{" "}
            <span className="font-medium text-foreground">Aura</span> can{" "}
            <em>add</em> capacity instead of spending it. Aura choice is part of your budget.
          </li>
        </ul>
        <GuideTip>
          Potato the gear you actually play. On everything else, use low-drain mods until you
          know you will keep it.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Polarity &amp; Forma</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Polarities are the symbols on slots and mods. Match a mod to its polarity and the
          drain is cut in half (rounded up). Mismatch costs more. An empty polarity is
          neutral: no bonus, no penalty.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Forma</span> sets or changes a
            slot&apos;s polarity. It also resets the item&apos;s rank, so plan before you
            spend it.
          </li>
          <li>
            Polarize the slots under your heaviest mods first (Primed, Umbral, high-rank
            Galvanized, etc.), not under a tiny utility mod.
          </li>
          <li>
            Umbra mods want Umbra slots. When in doubt, match whatever drains the most.
          </li>
        </ul>
        <GuideMistake>
          Forma-ing every slot to random polarities &quot;for the future.&quot; You will
          fight your own grid every time the build changes. Forma for a concrete plan.
        </GuideMistake>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Don&apos;t double the same bonus</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Not every &quot;+damage&quot; works the same way. A lot of bonuses add into the{" "}
          <span className="font-medium text-foreground">same pool</span>. Two Serration-style
          effects stack with each other, so the second one is a smaller relative gain for a
          full slot.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Other bonuses hit different parts of the formula: multishot, crit chance, crit
          damage, faction mods, and some ability buffs. Those often multiply your whole
          package instead of fighting for the same +% bucket.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Do:</span> one strong base-damage
            source, then diversify into multishot, crit, elements, faction, or conditionals.
          </li>
          <li>
            <span className="font-medium text-foreground">Don&apos;t:</span> equip two mods
            that both just say &quot;damage&quot; without checking if they share a pool.
            Frame buffs and weapon mods can share pools too.
          </li>
        </ul>
        <GuideTip>
          In FrameHub, swap one mod at a time and watch DPS or ability stats. If the number
          barely moves, you found a double additive.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Elemental combos</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Heat, Cold, Electricity, and Toxin combine in equip order into combos like Viral,
          Corrosive, Magnetic, Radiation, Blast, and Gas. Decide the combo you want first,
          then place mods so you get it.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Innate elements on the weapon count. A gun that already has Toxin will merge with
            the next element you add.
          </li>
          <li>
            Common gun pattern: Viral + Heat. Corrosive for armored targets. Pick for the
            mission, not for &quot;more colors.&quot;
          </li>
          <li>
            Plan 1-2 elemental mods on purpose. Random extras often make the wrong combo and
            dilute the procs you care about.
          </li>
        </ul>
        <GuideMistake>
          Adding every elemental mod for more status types. You usually weaken the setup
          instead of improving it.
        </GuideMistake>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Can&apos;t equip both?</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A lot of mods are exclusive with their upgraded cousins. You cannot run Point Blank
          and Primed Point Blank together, or Continuity and Primed Continuity. Umbral sets,
          Archon variants, and some Galvanized lines have the same kind of rule. If the game
          (or FrameHub) blocks a second mod, it is usually exclusivity, not a bug.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Pick the stronger legal option and free the other slot for something that multiplies
          a different part of the build.
        </p>
        <div className="mt-4">
          <GuideCtaLink href="/guides/how-to-mod/weapons">Next: Weapons</GuideCtaLink>
        </div>
      </ContentPanel>
    </>
  );
}
