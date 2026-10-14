/**
 * "Tap" on touch screens, "Click" with a mouse/trackpad (CSS `pointer: fine`), so first-time
 * hints never say "tap" on desktop. Pure CSS: no hydration flash, no JS pointer sniffing.
 */
export function PointerVerb({ capitalize = false }: { capitalize?: boolean }) {
  return (
    <>
      <span className="pointer-fine:hidden">{capitalize ? "Tap" : "tap"}</span>
      <span className="hidden pointer-fine:inline">{capitalize ? "Click" : "click"}</span>
    </>
  );
}
