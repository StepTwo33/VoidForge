import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";
import { ContentPanel } from "@/components/page-shell";
import {
  GuideCtaLink,
  GuideMistake,
  GuideTip,
} from "@/components/guides/how-to-mod-ui";

// Metadata only (tab title).
export const metadata: Metadata = pageMetadata({
  path: "/guides/how-to-mod/rivens",
  title: "How to Mod: Rivens",
  description:
    "How Warframe riven mods work: dispositions, stat ranges, rerolls and grading.",
});

export default function HowToModRivensPage() {
  return (
    <>
      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">What a riven is for</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A riven is a weapon-specific mod with random stats scaled by that weapon&apos;s{" "}
          <span className="font-medium text-foreground">disposition</span>. High disposition
          means bigger numbers. Low disposition means the same roll types hit smaller
          ceilings. The riven still spends a full mod slot, so it has to beat a normal mod
          that would live there.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Disposition is per weapon (and known for most of them). Check it before you
            commit Endo, Kuva, or platinum.
          </li>
          <li>
            Rolls can include two or three positives, optional negatives, and different
            polarities. More positives usually means each line is weaker than a clean
            two-stat roll.
          </li>
          <li>
            Negatives are not always bad. A harmless negative can leave more budget on the
            stats you want.
          </li>
        </ul>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">When it earns the slot</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Treat a riven like any other mod: one job in the grid. It should cover a gap or
          beat the next-best option in that slot, not exist because it looks shiny.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Do:</span> crit chance + crit
            damage on a crit stick, multishot + damage on a gun that needs both, or a
            faction line when you farm one enemy type.
          </li>
          <li>
            <span className="font-medium text-foreground">Don&apos;t:</span> keep a riven
            that only repeats a pool you already filled (another flat +damage when Serration
            / Galvanized / primed already covers it) unless the numbers clearly win.
          </li>
          <li>
            Compare against Primed, Galvanized, and dual-stat mods. If the riven loses that
            fight, sell, trade, or reroll. Do not force it.
          </li>
        </ul>
        <GuideTip>
          Equip the riven in the Weapon Builder with your real grid. If DPS barely moves vs
          a normal mod in that slot, the riven is fashion, not power.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Trait Locking</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          When you cycle a riven, you can lock one trait so it stays put while the rest
          reroll. Locking is free, but every cycle with a lock costs{" "}
          <span className="font-medium text-foreground">double Kuva</span>.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Only one trait can be locked at a time. You can unlock or move the lock for free.</li>
          <li>
            The lock clears when you close the cycle menu. Lock it again each time you come
            back.
          </li>
          <li>
            While a trait is locked, the riven keeps its count of positives and negatives
            (a 3-positive, 1-negative roll stays that shape). Unlock everything to reroll
            the layout.
          </li>
        </ul>
        <GuideTip>
          Lock the one trait you would be sad to lose (usually crit chance, multishot, or
          damage), then cycle for the rest. The doubled cost adds up fast, so set a budget
          first.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Riven Splicing</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A <span className="font-medium text-foreground">Riven Splicer</span> (one per
          successful run of The Icebind) merges two specific traits into a new{" "}
          <span className="font-medium text-foreground">spliced trait</span> you can&apos;t
          roll normally. For example, Toxin + Cold becomes Viral, and Damage + Multishot
          becomes Weak Point Damage.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Both source traits are used up. The spliced trait and one random trait take
            their place. The random trait is a negative if either source trait was negative.
          </li>
          <li>
            A spliced trait is always positive, and a riven can only hold one. Its value
            takes the higher roll of the two traits you spliced.
          </li>
          <li>
            It stays locked through cycling and doesn&apos;t double the Kuva cost, so you
            can still lock one more trait on top of it.
          </li>
          <li>
            While it&apos;s on the riven, the positive/negative layout is fixed. You can
            unlock it and cycle it off to splice something else.
          </li>
          <li>
            Every weapon type can splice combined elements (Viral, Corrosive, Gas,
            Radiation, Blast, Magnetic), Status Damage, and Damage to Orokin, Scaldra, or
            Techrot. Guns also get Weak Point Damage, Weak Point Crit Chance, Ammo
            Efficiency, and Reload While Holstered (not archguns). Melee gets Heavy Attack
            Wind Up, Melee Damage On Heavy Attack, Slam Damage, and Parry Angle.
          </li>
        </ul>
        <GuideTip>
          In the Weapon Builder, add spliced traits from the &quot;Spliced traits&quot;
          group in the riven stat picker. Weak point traits only count when Headshots is on,
          and Scaldra or Techrot damage only counts with that target faction picked.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Rolling without going broke</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Grade the roll against disposition ranges before you decide it is &quot;god
            tier&quot; or trash. Voidforge&apos;s Riven Grader does that against scaled
            pools.
          </li>
          <li>
            Reroll cost climbs. Set a stop rule (budget, or &quot;good enough for this
            weapon&quot;) before you start burning Kuva.
          </li>
          <li>
            Unlock and rank the riven so you see real drain and real stats. An unranked
            preview can lie about whether it fits the capacity plan.
          </li>
        </ul>
        <GuideMistake>
          Rolling forever on a low-disposition weapon for meta stats that a normal mod
          already provides. Disposition math will keep punishing that loop.
        </GuideMistake>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <GuideCtaLink href="/riven-calculator">Riven Grader</GuideCtaLink>
          <GuideCtaLink href="/weapon-builder">Weapon Builder</GuideCtaLink>
        </div>
      </ContentPanel>
    </>
  );
}
