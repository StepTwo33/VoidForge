import Link from "next/link";
import { ContentPanel } from "@/components/page-shell";
import {
  GuideCtaLink,
  GuideMistake,
  GuideTip,
} from "@/components/guides/how-to-mod-ui";

export default function HowToModWeaponsPage() {
  return (
    <>
      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Check the stats first</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Before you pick mods, look at unmodded{" "}
          <span className="font-medium text-foreground">crit chance</span>,{" "}
          <span className="font-medium text-foreground">crit multiplier</span>, and{" "}
          <span className="font-medium text-foreground">status chance</span>. That tells you
          whether the weapon wants a crit build, a status build, or a hybrid. Your job is to
          amplify what is already there.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          These are rules of thumb, not hard game tags. Borderline guns exist. When unsure,
          compare both styles in the{" "}
          <Link href="/weapon-builder" className="font-medium text-primary hover:text-primary/80">
            Weapon Builder
          </Link>
          .
        </p>
        <GuideTip>
          Single-digit crit and high status → status. Strong crit and a good multiplier →
          crit. Both look usable → hybrid.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Crit builds</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Best when base crit chance is already healthy (often around 20%+ before mods, sometimes
          much higher) and the crit multiplier rewards stacking into yellow / orange / red
          tiers.
        </p>
        <p className="mt-3 text-sm font-medium text-foreground">Slot priority</p>
        <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Crit chance</li>
          <li>Crit damage</li>
          <li>Multishot</li>
          <li>Base damage (one mod)</li>
          <li>Elements / faction</li>
        </ol>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Status is seasoning here unless you are building a hybrid. Heavy status investment
          is usually the wrong spend on a pure crit stick.
        </p>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Status builds</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Best when status chance is high and crit is weak. These guns shine as primers, slash
          carriers, or reliable Viral / Corrosive / Heat appliers. Procs are the point, not
          red crits.
        </p>
        <p className="mt-3 text-sm font-medium text-foreground">Slot priority</p>
        <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Status chance and elemental weighting for your combo</li>
          <li>Multishot (more hits = more procs)</li>
          <li>Fire rate when it helps apply status faster</li>
          <li>Base damage as needed</li>
        </ol>
        <GuideMistake>
          A full crit suite on a status primer &quot;because crit is meta.&quot; If the gun
          never reaches real crit tiers, those slots wanted status, multishot, or elements.
        </GuideMistake>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Hybrid builds</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Best when both crit and status look usable, or when you want crit damage and still
          need enough status to keep Viral / Heat (or similar) up. Split the slots. Do not
          dump everything into one fantasy.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Typical skeleton: two crit mods, status / elements, multishot, and damage. Adjust
          the split toward whichever side the base stats favor.
        </p>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Rules that help every weapon</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Multishot</span> is almost always
            excellent on guns: more hits, more crit rolls, more status rolls.
          </li>
          <li>
            <span className="font-medium text-foreground">One base-damage mod</span> beats
            two that share the same additive pool (see Basics).
          </li>
          <li>
            <span className="font-medium text-foreground">Elements</span> should match the
            mission. Plan the combo. Do not spray random 90% mods.
          </li>
          <li>
            <span className="font-medium text-foreground">Faction mods</span> are huge when
            you farm one enemy type. Less flexible for general use.
          </li>
          <li>
            <span className="font-medium text-foreground">Conditional / Galvanized mods</span>{" "}
            need stacks. Build so you can keep them up, or use the reliable non-conditional
            version when stacks fall off.
          </li>
          <li>
            <span className="font-medium text-foreground">Melee</span> adds combo and heavy
            attacks, but the same crit / status / hybrid read still starts from base stats.
          </li>
        </ul>
        <GuideTip>
          Use the Damage Simulator when armor, Viral, and time-to-kill matter, not just the
          raw DPS number on the builder.
        </GuideTip>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <GuideCtaLink href="/weapon-builder">Weapon Builder</GuideCtaLink>
          <GuideCtaLink href="/damage-simulator">Damage Simulator</GuideCtaLink>
        </div>
      </ContentPanel>
    </>
  );
}
