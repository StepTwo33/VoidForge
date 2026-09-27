import { ContentPanel } from "@/components/page-shell";
import {
  GuideCtaLink,
  GuideMistake,
  GuideTip,
} from "@/components/guides/how-to-mod-ui";

export default function HowToModModularPage() {
  return (
    <>
      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Parts first, then mods</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Kitguns, Zaws, and Amps are assembled weapons. The parts set fire mode, stance
          family, and base crit / status / damage long before you open the mod grid. Pick a
          job, build the tool for that job, then mod it like any other gun or melee.
        </p>
        <GuideTip>
          In the Modular Builder, lock the part set that matches your role. Only then apply
          the Weapons, Elements, and Rivens habits.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Kitguns</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Chamber</span> sets the core
            behavior (beam, automatic, shotgun-feel, etc.). Start here.
          </li>
          <li>
            <span className="font-medium text-foreground">Grip</span> and{" "}
            <span className="font-medium text-foreground">loader</span> push crit, status,
            magazine, and fire rate. They decide whether the gun wants a crit or status grid.
          </li>
          <li>
            Primary vs secondary Kitguns use different mod pools. Do not assume a secondary
            build pastes cleanly onto a primary chassis.
          </li>
        </ul>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Zaws</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Strike</span>,{" "}
            <span className="font-medium text-foreground">grip</span>, and{" "}
            <span className="font-medium text-foreground">link</span> set stance type and base
            melee stats.
          </li>
          <li>
            After assembly, read unmodded crit and status the same way as any melee. Stance
            still adds capacity when polarity matches.
          </li>
          <li>
            Heavy / combo playstyles need parts that already support that fantasy. Mods
            amplify; they rarely rescue a mismatched strike.
          </li>
        </ul>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Amps</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Prism</span>,{" "}
            <span className="font-medium text-foreground">scaffold</span>, and{" "}
            <span className="font-medium text-foreground">brace</span> define Operator damage
            and feel. This is not a warframe gun.
          </li>
          <li>
            Amps use their own Arcane type. Plan Arcanes with the Amp, not with your primary
            weapon Arcane slot.
          </li>
          <li>
            Build for the content you Operator into (Eidolons, Void angels, general use). One
            Amp rarely does every job perfectly.
          </li>
        </ul>
        <GuideMistake>
          Assembling random parts &quot;because they dropped,&quot; then forcing a meta mod
          checklist that fights the base stats. Fix the parts or pick a different role.
        </GuideMistake>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <GuideCtaLink href="/modular-builder">Modular Builder</GuideCtaLink>
          <GuideCtaLink href="/guides/how-to-mod/weapons">Weapons guide</GuideCtaLink>
        </div>
      </ContentPanel>
    </>
  );
}
