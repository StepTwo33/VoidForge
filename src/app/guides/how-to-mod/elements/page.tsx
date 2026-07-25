import { ContentPanel } from "@/components/page-shell";
import {
  GuideCtaLink,
  GuideMistake,
  GuideTip,
} from "@/components/guides/how-to-mod-ui";

const COMBOS: { a: string; b: string; result: string; note: string }[] = [
  { a: "Cold", b: "Toxin", result: "Viral", note: "Health damage taken up. Common all-rounder." },
  { a: "Electricity", b: "Toxin", result: "Corrosive", note: "Armor strip / armored factions." },
  { a: "Heat", b: "Cold", result: "Blast", note: "Knockdown / crowd control flavor." },
  { a: "Heat", b: "Toxin", result: "Gas", note: "AoE toxin clouds. Niche but strong in places." },
  { a: "Cold", b: "Electricity", result: "Magnetic", note: "Shields. Corpus / shield-heavy content." },
  { a: "Heat", b: "Electricity", result: "Radiation", note: "Confusion. Good vs some factions / bosses." },
];

export default function HowToModElementsPage() {
  return (
    <>
      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">How combos form</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Heat, Cold, Electricity, and Toxin pair into six secondary elements. Combination
          follows mod placement: left to right, top row then bottom. Innate weapon elements
          (and most progenitor bonuses) combine{" "}
          <span className="font-medium text-foreground">last</span>, after your elemental
          mods.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Decide the combo first. Then place the two primaries so they meet in the order
            you want.
          </li>
          <li>
            A leftover primary (Heat next to Viral, for example) is often intentional. Extra
            random primaries usually make the wrong mix.
          </li>
          <li>
            Innate secondaries (a gun that already deals Radiation, etc.) stay. You can still
            add another combo on top with mods.
          </li>
        </ul>
        <GuideTip>
          If the Arsenal combo looks wrong, reshuffle slot order before you rip Forma. The
          Weapon Builder shows the resolved elements as you swap.
        </GuideTip>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Combo table</h2>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          Each secondary is just two primaries. Order of the pair does not change the result;
          order on the grid changes what pairs with what when you have more than two.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Primaries</th>
                <th className="px-3 py-2 font-medium">Combo</th>
                <th className="px-3 py-2 font-medium">Typical use</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {COMBOS.map((row) => (
                <tr key={row.result} className="border-b border-border/40 last:border-0">
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="font-medium text-foreground">{row.a}</span>
                    {" + "}
                    <span className="font-medium text-foreground">{row.b}</span>
                  </td>
                  <td className="px-3 py-2.5 font-medium text-foreground">{row.result}</td>
                  <td className="px-3 py-2.5">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentPanel>

      <ContentPanel>
        <h2 className="mb-3 text-lg font-semibold">Mission picks</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Viral + Heat</span> is a common gun
            pattern for mixed content.
          </li>
          <li>
            <span className="font-medium text-foreground">Corrosive</span> (often with Heat)
            when armor is the wall.
          </li>
          <li>
            <span className="font-medium text-foreground">Magnetic</span> when shields are the
            wall.
          </li>
          <li>
            Faction and mission still beat &quot;more colors.&quot; Plan 1–2 elemental mods on
            purpose.
          </li>
        </ul>
        <GuideMistake>
          Equipping every 90% elemental mod you own. You dilute the procs you care about and
          often lock in a combo you did not want.
        </GuideMistake>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <GuideCtaLink href="/weapon-builder">Weapon Builder</GuideCtaLink>
          <GuideCtaLink href="/guides/how-to-mod/basics">Back to Basics</GuideCtaLink>
        </div>
      </ContentPanel>
    </>
  );
}
