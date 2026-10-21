import type { Metadata } from "next";
import Home from "./home-page";
import { getCatalogCounts } from "@/lib/site/catalog-counts";
import { pageMetadata } from "@/lib/site/page-metadata";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site/site-metadata";

const homeTitle = `${SITE_NAME} - ${SITE_TAGLINE}`;
const base = pageMetadata({ path: "/", title: homeTitle, description: SITE_DESCRIPTION, socialTitle: homeTitle });

export const metadata: Metadata = {
  ...base,
  // Absolute so the root template doesn't turn it into "… | Voidforge".
  title: { absolute: homeTitle },
};

/** Server wrapper: counts are computed here so the client bundle doesn't need the catalogs for them. */
export default function Page() {
  return <Home counts={getCatalogCounts()} />;
}
