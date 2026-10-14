/** Semantic accent text/bg classes — readable on light and dark surfaces. */
export const accentTone = {
  amber: {
    text: "text-amber-800 dark:text-amber-300",
    textSoft: "text-amber-800/90 dark:text-amber-300/90",
    textMuted: "text-amber-800/80 dark:text-amber-200/80",
    chipActive: "bg-amber-500/15 font-medium text-amber-900 dark:text-amber-300",
    badge: "border-amber-500/30 text-amber-900 dark:text-amber-300",
    icon: "text-amber-700 dark:text-amber-400",
    iconBg: "bg-amber-500/10 text-amber-800 dark:text-amber-400",
    mono: "font-mono text-amber-800/90 dark:text-amber-300/90",
  },
  blue: {
    text: "text-blue-800 dark:text-blue-300",
    chipActive: "bg-blue-500/15 font-medium text-blue-900 dark:text-blue-300",
    badge: "border-blue-500/30 text-blue-900 dark:text-blue-300",
  },
  purple: {
    text: "text-purple-800 dark:text-purple-300",
    textSoft: "text-purple-800/90 dark:text-purple-300/90",
    chipActive: "bg-purple-500/15 font-medium text-purple-900 dark:text-purple-300",
    badge: "border-purple-500/30 text-purple-900 dark:text-purple-300",
    button:
      "border-purple-500/40 bg-purple-500/10 text-purple-900 hover:bg-purple-500/20 dark:text-purple-300",
    icon: "text-purple-700 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300",
    stat: "text-purple-800 dark:text-purple-300",
    statMuted: "text-purple-600/70 dark:text-purple-400/60",
  },
  cyan: {
    badge: "border-cyan-500/30 text-cyan-900 dark:text-cyan-300",
    stat: "text-cyan-800/90 dark:text-cyan-300/80",
  },
  rose: {
    badge: "border-rose-500/30 text-rose-900 dark:text-rose-300",
    text: "text-rose-700 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300",
    button:
      "border-rose-500/30 bg-rose-500/10 text-rose-800 hover:bg-rose-500/15 dark:text-rose-400 dark:hover:text-rose-300",
  },
  indigo: {
    chipActive: "bg-indigo-500/15 font-medium text-indigo-900 dark:text-indigo-300",
    chipStrong: "bg-indigo-500/20 text-indigo-900 dark:text-indigo-300",
    badge: "border-indigo-500/30 text-indigo-900 dark:text-indigo-300",
  },
  orange: {
    chipActive: "bg-orange-500/15 font-medium text-orange-900 dark:text-orange-300",
    badge: "border-orange-500/30 text-orange-900 dark:text-orange-300",
  },
  emerald: {
    button:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 hover:bg-emerald-500/20 hover:border-emerald-600/50 dark:text-emerald-300 dark:hover:border-emerald-400/50",
  },
} as const;
