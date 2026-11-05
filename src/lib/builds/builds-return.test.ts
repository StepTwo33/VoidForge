import { describe, expect, it } from "vitest";
import {
  buildsLibraryHref,
  hrefPathname,
  isFromBuilds,
  parseBuildsLibraryQuery,
  parseBuildsReturn,
  resolveBuildsReturnLink,
  withFromBuilds,
} from "./builds-return";

describe("Round 55: /builds URL state", () => {
  it("round-trips type filter and search through the URL", () => {
    const href = buildsLibraryHref({ type: "warframe", q: " saryn spores " });
    expect(href).toBe("/builds?type=warframe&q=saryn+spores");
    expect(parseBuildsLibraryQuery(href.slice(href.indexOf("?")))).toEqual({ type: "warframe", q: "saryn spores" });
  });

  it("uses plain /builds for the default view and ignores unknown types", () => {
    expect(buildsLibraryHref({ type: "all", q: "  " })).toBe("/builds");
    expect(parseBuildsLibraryQuery("?type=nope")).toEqual({ type: "all", q: "" });
  });
});

describe("Round 55: from=builds tag", () => {
  it("keeps existing params and hash", () => {
    expect(withFromBuilds("/warframe-builder?buildId=abc")).toBe("/warframe-builder?buildId=abc&from=builds");
    expect(withFromBuilds("/loadouts#kit-1")).toBe("/loadouts?from=builds#kit-1");
    expect(withFromBuilds("/weapon-builder?localBuild=1&from=builds")).toBe("/weapon-builder?localBuild=1&from=builds");
    expect(isFromBuilds("?buildId=abc&from=builds")).toBe(true);
    expect(isFromBuilds("?buildId=abc")).toBe(false);
    expect(hrefPathname("/railjack-builder?buildId=x#y")).toBe("/railjack-builder");
  });
});

describe("Round 55: return entry", () => {
  const entry = { href: "/builds?type=weapon&q=soma", scrollY: 640, builder: "/weapon-builder" };

  it("accepts only same-site /builds hrefs", () => {
    expect(parseBuildsReturn(JSON.stringify(entry))).toEqual(entry);
    expect(parseBuildsReturn(JSON.stringify({ ...entry, href: "https://evil.example/builds" }))).toBeNull();
    expect(parseBuildsReturn(JSON.stringify({ ...entry, href: "/buildsx" }))).toBeNull();
    expect(parseBuildsReturn("not json")).toBeNull();
    expect(parseBuildsReturn(JSON.stringify({ ...entry, scrollY: -5 }))?.scrollY).toBe(0);
  });

  it("shows Back to your builds in the builder the row opened, with the saved filter", () => {
    expect(resolveBuildsReturnLink({ pathname: "/weapon-builder", search: "", entry, signedIn: false })).toEqual({
      kind: "back",
      href: "/builds?type=weapon&q=soma",
    });
  });

  it("falls back to plain /builds when only the URL tag is present (new tab)", () => {
    expect(resolveBuildsReturnLink({ pathname: "/warframe-builder", search: "?from=builds", entry, signedIn: true })).toEqual({
      kind: "back",
      href: "/builds",
    });
  });

  it("shows Your builds for signed-in users elsewhere, nothing when signed out", () => {
    expect(resolveBuildsReturnLink({ pathname: "/companion-builder", search: "", entry, signedIn: true })).toEqual({
      kind: "library",
      href: "/builds",
    });
    expect(resolveBuildsReturnLink({ pathname: "/companion-builder", search: "", entry: null, signedIn: false })).toBeNull();
  });
});
