/**
 * Home page three-column layout — side panels only when the viewport fits
 * center grid + both sidebars without overlap (common PWA/tablet issue at xl).
 */

/** Below this width: sidebars stack inline above the feature grid. */
export const HOME_SIDEBAR_MIN = "min-[1400px]";

export const HOME_SIDEBAR_ASIDE_CLASS = [
  "hidden",
  "min-[1400px]:block",
  "min-w-0 w-full max-w-full",
].join(" ");

export const HOME_SIDEBAR_PANEL_CLASS = [
  "sticky top-20 flex w-full flex-col overflow-hidden",
  "min-h-[32rem]",
  "max-h-[calc(100vh-6rem)] h-[calc(100vh-6rem)]",
  "max-h-[calc(100dvh-6rem)] h-[calc(100dvh-6rem)]",
].join(" ");

export const HOME_SIDEBAR_BODY_CLASS = "min-h-0 flex-1 space-y-2 overflow-y-auto p-3";

export const HOME_SIDEBAR_TAB_ROW_CLASS =
  "flex gap-1 border-b border-border/60 px-3 py-2";

/** Inline panels shown below hero on narrower viewports. */
export const HOME_SIDEBAR_INLINE_CLASS = "mb-8 space-y-6 min-[1400px]:hidden";

export const HOME_GRID_CLASS = [
  "mx-auto grid w-full min-w-0 max-w-full grid-cols-1 gap-8",
  "min-[1400px]:grid-cols-[minmax(0,280px)_minmax(0,64rem)_minmax(0,280px)]",
  "min-[1400px]:items-start min-[1400px]:justify-center min-[1400px]:gap-x-4",
  "2xl:grid-cols-[minmax(0,320px)_minmax(0,64rem)_minmax(0,320px)] 2xl:gap-x-6",
].join(" ");

export const HOME_CENTER_CLASS = "min-w-0 max-w-full min-[1400px]:col-start-2";

export const HOME_LEFT_ASIDE_CLASS = "min-[1400px]:col-start-1";

export const HOME_RIGHT_ASIDE_CLASS = "min-[1400px]:col-start-3";
