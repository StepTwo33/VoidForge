import type { SimulationParams } from "@/lib/types";

/** On-hit / landing-window mods that used to share the leftover trigger bucket. */
export const HIT_WINDOW_TRIGGERS = [
  {
    flag: "applyDoubleTap",
    bucket: "doubleTap",
    modId: "double_tap",
    label: "Double Tap",
    title: "On hit: +20% damage per stack, up to 20 stacks. The sim uses the cap when this is on.",
  },
  {
    flag: "applyTripleTap",
    bucket: "tripleTap",
    modId: "triple_tap",
    label: "Triple Tap",
    title: "On 2 hits within 0.02s: +40% damage for 0.2s.",
  },
  {
    flag: "applyFinalTap",
    bucket: "finalTap",
    modId: "final_tap",
    label: "Final Tap",
    title: "On 4 hits within 0.05s: +100% damage for 0.2s.",
  },
  {
    flag: "applySuddenJustice",
    bucket: "suddenJustice",
    modId: "sudden_justice",
    label: "Sudden Justice",
    title: "On 2 hits within 0.2s: +30% fire rate for 2s.",
  },
  {
    flag: "applyMotusSetup",
    bucket: "motusSetup",
    modId: "motus_setup",
    label: "Motus Setup",
    title: "+100% critical chance and status chance for 4s after a Double or Bullet Jump land.",
  },
] as const;

export type HitWindowFlag = (typeof HIT_WINDOW_TRIGGERS)[number]["flag"];

export function hitWindowFlags(value: boolean): Pick<SimulationParams, HitWindowFlag> {
  return Object.fromEntries(HIT_WINDOW_TRIGGERS.map((t) => [t.flag, value])) as Pick<
    SimulationParams,
    HitWindowFlag
  >;
}
