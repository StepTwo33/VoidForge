import { ContentPanel } from "@/components/page-shell";
import {
  GuideCtaLink,
  GuideMistake,
  GuideTip,
} from "@/components/guides/how-to-mod-ui";

export default function HowToModCompanionsPage() {
  return (
    <>
      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">A second loadout</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Companions are not cosmetic fluff. They are a second loadout: precepts for what
          they do, mods to keep them alive and linked, and a real build on their weapon.
          Treat that grid with the same honesty as your frame and guns.
        </p>
        <GuideTip>
          Decide the companion&apos;s job before you open precepts. Loot, priming, and damage
          support want different cards.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Precepts</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Give the companion{" "}
            <span className="font-medium text-foreground">one clear job</span>. Stacking
            conflicting precepts usually wastes slots and cancels roles.
          </li>
          <li>
            Many precepts are family- or companion-specific. Moas, Hounds, sentinels, and
            beasts each have their own eligible sets. If Voidforge blocks a precept, it is
            usually eligibility, not a bug.
          </li>
          <li>
            Unlock precepts that match that pet&apos;s kit. Generic fillers that fight the
            pet&apos;s role are dead weight.
          </li>
        </ul>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Weapon and survival</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Mod the companion weapon the same way you would a player weapon. Primers want
            status and the right elements. Damage pets follow crit / status / hybrid from
            base stats.
          </li>
          <li>
            Survival, link, and utility mods are not optional fluff if you rely on precepts.
            A dead pet does nothing.
          </li>
          <li>
            Capacity, polarity, and potatoes still apply. Invest in the companion you
            actually take into missions.
          </li>
        </ul>
        <GuideMistake>
          Leaving the companion weapon empty. That is free priming or free damage you already
          brought into the mission.
        </GuideMistake>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <GuideCtaLink href="/companion-builder">Companion Builder</GuideCtaLink>
          <GuideCtaLink href="/guides/how-to-mod/weapons">Weapons guide</GuideCtaLink>
        </div>
      </ContentPanel>
    </>
  );
}
