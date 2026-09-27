import { ContentPanel } from "@/components/page-shell";
import {
  GuideCtaLink,
  GuideMistake,
  GuideTip,
} from "@/components/guides/how-to-mod-ui";

export default function HowToModRailjackPage() {
  return (
    <>
      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Same habits, different binder</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Railjack modding lives on the{" "}
          <span className="font-medium text-foreground">Plexus</span>, not on your
          warframe. Capacity, polarity, and Forma still matter on the Integrated grid.
          Warframe mods, Helminth, and most Arcanes do not transfer. Bring the same
          &quot;one job per build&quot; habits with a ship-sized mod pool.
        </p>
        <GuideTip>
          Rank the Railjack and invest Intrinsics that unlock the systems you actually use.
          Empty Plexus slots on a ship you fly every week is free power left on the hangar
          floor.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Plexus grids</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Integrated:</span> permanent ship
            stats (survivability, guns, ordnance, utility). These drain capacity like a
            normal loadout. Match polarities on the heavy mods first.
          </li>
          <li>
            <span className="font-medium text-foreground">Battle:</span> active combat
            abilities. Pick a clear combat kit, not one of every house. You equip abilities
            into the Battle slots rather than stacking every Integrated drain mod here.
          </li>
          <li>
            <span className="font-medium text-foreground">Tactical:</span> cooldowns and
            support tools (cloak, repairs, squad utility). Same idea: choose roles you will
            press, not a museum of unused cards.
          </li>
        </ul>
        <GuideMistake>
          Filling Battle and Tactical with every ability &quot;just in case.&quot; You get a
          cluttered kit and still lose fights because Integrated (hull, shields, guns) was
          ignored.
        </GuideMistake>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Build checklist</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Fund survivability and gun strength on Integrated before chasing exotic Battle
            toys.
          </li>
          <li>
            Ordnance and turrets are their own damage story. If the ship is your DPS, mod
            for that; if you exit to kill crews, fund boarding and survivability instead.
          </li>
          <li>
            House components (reactor, shields, engines, plating) change capacity and
            traits. Rebuild the Plexus after big part swaps, not before.
          </li>
          <li>
            One clear role: tanky gun platform, ordnance boat, or support for the squad.
            Mixing every fantasy wastes slots.
          </li>
        </ul>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <GuideCtaLink href="/railjack-builder">Railjack Builder</GuideCtaLink>
          <GuideCtaLink href="/guides/how-to-mod/basics">Review Basics</GuideCtaLink>
        </div>
      </ContentPanel>
    </>
  );
}
