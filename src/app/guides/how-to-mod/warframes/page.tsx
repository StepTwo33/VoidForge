import { ContentPanel } from "@/components/page-shell";
import {
  GuideCtaLink,
  GuideMistake,
  GuideTip,
} from "@/components/guides/how-to-mod-ui";

export default function HowToModWarframesPage() {
  return (
    <>
      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Build for the abilities you use</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          There is no universal &quot;just stack Strength&quot; build. A nuke frame, a gun
          platform, a support, and a tank all want different mixes of Strength, Duration,
          Range, and Efficiency. Read the kit first: which abilities do you press every
          fight, and which stats make those abilities good?
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Spam / energy hungry:</span>{" "}
            Efficiency first (and Duration if you need uptime on buffs or channels). Strength
            comes after you can cast freely.
          </li>
          <li>
            <span className="font-medium text-foreground">Scales with Strength:</span>{" "}
            Strength first, then enough Efficiency and Duration so you are not dry mid-fight.
          </li>
          <li>
            <span className="font-medium text-foreground">CC / zones / auras:</span> Range and
            Duration often matter more than raw Strength.
          </li>
          <li>
            <span className="font-medium text-foreground">Weapon platform:</span>{" "}
            survivability, utility, and buffs that help your guns. Take Strength only where
            the buff actually scales with it.
          </li>
        </ul>
        <GuideTip>
          In the Warframe Builder, watch how each mod moves the four stats. If it does not
          help the abilities you use, it is a vanity slot.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">The four ability stats</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Strength</span> - how hard abilities
            hit, how strong buffs are, and similar numbers. Not every ability scales with it.
            Check the ability.
          </li>
          <li>
            <span className="font-medium text-foreground">Duration</span> - how long buffs,
            debuffs, CC, and channeled effects last. Dumping Duration on a frame that needs
            uptime is a classic self-own.
          </li>
          <li>
            <span className="font-medium text-foreground">Range</span> - how far abilities
            reach and how large zones are. Too little feels broken. Too much can be wasted
            capacity.
          </li>
          <li>
            <span className="font-medium text-foreground">Efficiency</span> - energy cost
            reduction. Soft caps around{" "}
            <span className="font-medium text-foreground">175%</span>. Past that, more
            Efficiency does nothing useful.
          </li>
        </ul>
        <GuideMistake>
          Building 200%+ Efficiency &quot;just in case.&quot; Reclaim those slots for
          Strength, Duration, Range, or survivability.
        </GuideMistake>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Aura, Exilus, and extras</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Aura:</span> squad effect plus
            capacity. Matching polarity can add capacity, so pick something useful for the
            content <em>and</em> your budget.
          </li>
          <li>
            <span className="font-medium text-foreground">Exilus:</span> utility slot
            (movement, drag, stealth angle, QoL). Needs an Exilus Adapter. Keep core power
            mods in the main eight when they belong there.
          </li>
          <li>
            <span className="font-medium text-foreground">Augments / Helminth:</span> changing
            the kit can change which stats you need. Rebuild after you swap, not before.
          </li>
          <li>
            <span className="font-medium text-foreground">Archon Shards:</span> use them to
            patch gaps after the mod grid is honest (more Duration, Strength, energy, etc.).
          </li>
        </ul>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Stay alive</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Dead frames deal zero damage. Armor, Adaptation-style layers, shield tools, and
          healing are not &quot;noob mods.&quot; They are what let a fancy Strength build
          stay in the fight. On the flip side, a pure tank with no energy economy may never
          cast. Balance for the content you run.
        </p>
        <GuideTip>
          If you keep dying, swap one luxury damage mod for a defensive layer before you
          blame the weapon.
        </GuideTip>
        <div className="mt-4">
          <GuideCtaLink href="/warframe-builder">Warframe Builder</GuideCtaLink>
        </div>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Companions</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Companions are a second loadout: precepts for what they do, mods to keep them
          alive and linked, and a real build on their weapon. Treat them like that, not like
          cosmetic fluff.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Give the companion <span className="font-medium text-foreground">one clear job</span>{" "}
            (loot, priming, damage support). Six random precepts usually fight each other.
          </li>
          <li>
            Many precepts are companion-specific. Equip the ones that match that pet&apos;s
            role.
          </li>
          <li>
            Mod the companion weapon the same way you would a player weapon. Primers want
            status. Damage pets follow crit / status / hybrid from base stats.
          </li>
          <li>
            Keep the companion alive if you rely on its precepts. A dead pet does nothing.
          </li>
        </ul>
        <GuideMistake>
          Leaving the companion weapon empty. That is free priming or free damage you already
          brought into the mission.
        </GuideMistake>
        <div className="mt-4">
          <GuideCtaLink href="/companion-builder">Companion Builder</GuideCtaLink>
        </div>
      </ContentPanel>
    </>
  );
}
