/**
 * ALT FIRE notes are stored with their wiki source first ("Wiki Corinth Prime attacks 2 and 3. …"),
 * which keeps the data checkable against the wiki's attack list. Players don't need the attack
 * numbers, so the panel shows the sentence without that prefix and keeps the source as a tooltip.
 * Display text only: no numbers in the note are changed.
 */
export interface AltFireNoteDisplay {
  /** Player-facing note ("" when the note was only a source reference). */
  text: string;
  /** Wiki source reference, e.g. "Wiki: Corinth Prime attacks 2 and 3" (tooltip). */
  source?: string;
}

const ATTACK_NUMS = String.raw`\d+(?:\s*(?:-|and|,)\s*\d+)*`;
const PREFIX = new RegExp(
  String.raw`^Wiki\s+(.+?)\s+(attacks?\s+${ATTACK_NUMS})(?:\s*\(([^)]*)\))?(,\s*shown with a full magazine)?\.\s*`,
);
const PAGE_PREFIX = /^Wiki\s+(.+?)\s+page:\s*/;
const INLINE_ATTACK_REF = new RegExp(String.raw`\s*\(attacks?\s+${ATTACK_NUMS}\)`, "g");

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function altFireNoteForDisplay(note: string | undefined | null): AltFireNoteDisplay {
  if (!note) return { text: "" };
  let text = note.trim();
  let source: string | undefined;
  const lead: string[] = [];
  const m = text.match(PREFIX);
  if (m) {
    source = `Wiki: ${m[1]} ${m[2]}`;
    const paren = m[3]?.trim();
    if (paren && /^archgun:/i.test(paren)) {
      lead.push(`Shows ${paren.replace(/^archgun:\s*/i, "")}.`);
    }
    if (m[4]) lead.push("Shown with a full magazine.");
    text = text.slice(m[0].length);
  } else {
    const p = text.match(PAGE_PREFIX);
    if (p) {
      source = `Wiki: ${p[1]} page`;
      text = capitalize(text.slice(p[0].length));
    }
  }
  text = text
    .replace(INLINE_ATTACK_REF, "")
    .replace(/\bnot modell?ed\b/g, "not included");
  return { text: [...lead, text].filter(Boolean).join(" ").trim(), source };
}
