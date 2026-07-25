import { ContentPanel } from "@/components/page-shell";
import {
  GuideCtaLink,
  GuideMistake,
  GuideTip,
} from "@/components/guides/how-to-mod-ui";

export default function HowToModArchwingPage() {
  return (
    <>
      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Same rules, different mods</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Archwings and Necramechs use Strength, Duration, Range, and Efficiency like
          warframes. Capacity, polarity, Catalyst / Reactor, and Forma work the same way as
          in Basics. What changes is the mod pool: most warframe mods, Arcanes, and Helminth
          setups do not transfer over.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          If you already mod frames cleanly, you are most of the way there. Bring the same
          habits. Just use the right binder.
        </p>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Archwing</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Build around the abilities you cast. Read what scales with Strength vs Duration
            vs Range, then fund enough Efficiency to cast.
          </li>
          <li>
            Archwing guns and melee have their own grids and use a{" "}
            <span className="font-medium text-foreground">Catalyst</span>, not a Reactor.
            Use the Weapons guide: crit, status, or hybrid still starts from base stats.
          </li>
          <li>
            Survivability and mobility matter in open space. A glass DPS wing that dies to
            the first volley is just a respawn loop.
          </li>
        </ul>
        <GuideTip>
          Only Forma the Archwing gear you actually fly. A heavily Formad wing you never
          equip is inventory fashion.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Necramech</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Same ability-stat thinking as frames. Separate mod pool, so your Umbra set and
            frame mods stay on the frame.
          </li>
          <li>
            Potato and Forma the mech if you use it for real open-world or bounty content.
            Treat it like a frame you intend to main in the landscape.
          </li>
          <li>
            Mech weapons are their own builds and take a{" "}
            <span className="font-medium text-foreground">Catalyst</span>. Do not leave a
            strong archgun or mech weapon on empty defaults if the mech is your damage
            source.
          </li>
          <li>
            Energy and survivability matter as much as raw Strength. Mechs are big targets.
          </li>
        </ul>
        <GuideMistake>
          Leaving the mech mostly empty because it &quot;feels tanky.&quot; High base stats
          help. Mods still decide whether the kit feels modern.
        </GuideMistake>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Quick checklist</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Reactor on the wing/mech, Catalyst on its weapons → match polarities → Forma
            the heavy slots
          </li>
          <li>Do not stack past 175% Efficiency</li>
          <li>One clear role per build</li>
          <li>Weapons follow the Weapons section</li>
        </ul>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <GuideCtaLink href="/archwing-builder">
            Archwing &amp; Necramech Builder
          </GuideCtaLink>
          <GuideCtaLink href="/guides/how-to-mod/basics">Review Basics</GuideCtaLink>
        </div>
      </ContentPanel>
    </>
  );
}
